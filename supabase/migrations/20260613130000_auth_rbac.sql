-- Auth + role-based access control: app_role, profiles, the access-token hook,
-- and the seeded super-admin User. See docs/adr/0003 (RBAC via profiles + hook)
-- and docs/adr/0002 (single-tenant RLS baseline).
-- Applied as a versioned migration via `supabase db push` (see docs/adr/0001).

-- crypt()/gen_salt() for hashing the seeded password live in pgcrypto.
create extension if not exists pgcrypto with schema extensions;

-- The single access tier a User holds, ordered most to least privileged.
create type public.app_role as enum (
  'super_admin',
  'manager',
  'viewer'
);

-- One profile per auth user, holding the Role. Source of truth for RBAC; the
-- access-token hook reads it, future user-management surfaces edit it.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role public.app_role not null default 'viewer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Keep profiles in lockstep with auth.users: every new auth user gets a profile
-- at the least-privileged default. Security definer so it bypasses RLS on insert.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- RLS: a User reads their own profile; a super_admin manages all. The
-- super_admin policy reads the user_role JWT claim, so it fails closed until the
-- access-token hook is enabled (no claim -> not 'super_admin' -> denied).
alter table public.profiles enable row level security;

create policy "Users read own profile" on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy "Super admins manage all profiles" on public.profiles
  for all to authenticated
  using ((auth.jwt() ->> 'user_role') = 'super_admin')
  with check ((auth.jwt() ->> 'user_role') = 'super_admin');

-- Custom access-token hook: injects the caller's Role into the JWT as the
-- `user_role` claim. Enabled in the Supabase dashboard (Authentication > Hooks >
-- Customize Access Token). Runs as supabase_auth_admin, which therefore needs
-- read access to profiles.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  caller_role public.app_role;
begin
  select role into caller_role
  from public.profiles
  where id = (event ->> 'user_id')::uuid;

  claims := event -> 'claims';

  if caller_role is not null then
    claims := jsonb_set(claims, '{user_role}', to_jsonb(caller_role));
  else
    claims := jsonb_set(claims, '{user_role}', 'null'::jsonb);
  end if;

  return jsonb_set(event, '{claims}', claims);
end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;

grant all on table public.profiles to supabase_auth_admin;

create policy "Auth admin reads profiles for the token hook" on public.profiles
  for select to supabase_auth_admin
  using (true);

-- Seed the bootstrap super-admin User. Idempotent: skip entirely if the email
-- already exists. The on-insert trigger creates the profile as 'viewer'; we then
-- promote it to 'super_admin'.
-- ! Seeded with email == password for bootstrap only; rotate after first login.
do $$
declare
  seeded_user_id uuid := gen_random_uuid();
  seeded_email text := 'jesus@mindcodeservice.com';
begin
  if exists (select 1 from auth.users where email = seeded_email) then
    return;
  end if;

  -- GoTrue scans the *_token / email_change columns into Go strings, so they
  -- must be '' (empty), never NULL, or login fails with "Database error
  -- querying schema".
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change_token_new,
    email_change, email_change_token_current, phone_change,
    phone_change_token, reauthentication_token
  ) values (
    '00000000-0000-0000-0000-000000000000',
    seeded_user_id,
    'authenticated',
    'authenticated',
    seeded_email,
    extensions.crypt(seeded_email, extensions.gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    '', '', '', '', '', '', '', ''
  );

  insert into auth.identities (
    provider_id, user_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  ) values (
    seeded_user_id::text,
    seeded_user_id,
    jsonb_build_object('sub', seeded_user_id::text, 'email', seeded_email),
    'email',
    now(), now(), now()
  );

  update public.profiles
  set role = 'super_admin'
  where id = seeded_user_id;
end $$;
