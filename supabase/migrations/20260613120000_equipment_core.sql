-- Equipment core data model: equipment_types, operators, equipment.
-- Single-tenant with an authenticated-only RLS baseline (see docs/adr/0002).
-- Applied as a versioned migration via `supabase db push` (see docs/adr/0001).

-- The placeholder demo `equipment` table is replaced wholesale by the real
-- schema; its throwaway demo rows are intentionally discarded.
drop table if exists public.equipment;

create type public.equipment_status as enum (
  'in_use',
  'available',
  'in_transit',
  'maintenance',
  'retired'
);

create table public.equipment_types (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  icon text
);

create table public.operators (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  license_number text,
  phone text,
  avatar_url text,
  active boolean not null default true
);

-- A license number identifies an operator, but not every operator has one on
-- file; enforce uniqueness only when present.
create unique index operators_license_number_key
  on public.operators (license_number)
  where license_number is not null;

create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  equipment_type_id uuid not null references public.equipment_types (id) on delete restrict,
  current_operator_id uuid references public.operators (id) on delete set null,
  name text not null,
  model text,
  serial_number text not null unique,
  license_plate text,
  status public.equipment_status not null default 'available',
  total_hours integer not null default 0 check (total_hours >= 0),
  total_km integer not null default 0 check (total_km >= 0),
  last_maintenance_date date,
  next_maintenance_date date,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Forklifts and attachments have no plate; trucks do. Unique only when present.
create unique index equipment_license_plate_key
  on public.equipment (license_plate)
  where license_plate is not null;

create index equipment_equipment_type_id_idx on public.equipment (equipment_type_id);
create index equipment_current_operator_id_idx on public.equipment (current_operator_id);
create index equipment_status_idx on public.equipment (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger equipment_set_updated_at
  before update on public.equipment
  for each row
  execute function public.set_updated_at();

-- RLS: the app reaches Supabase with the publishable (anon) key, so every table
-- must be protected. Baseline grants authenticated callers full access and locks
-- out anon entirely; tighten per-role later without a data migration.
alter table public.equipment_types enable row level security;
alter table public.operators enable row level security;
alter table public.equipment enable row level security;

create policy "Authenticated full access" on public.equipment_types
  for all to authenticated using (true) with check (true);

create policy "Authenticated full access" on public.operators
  for all to authenticated using (true) with check (true);

create policy "Authenticated full access" on public.equipment
  for all to authenticated using (true) with check (true);
