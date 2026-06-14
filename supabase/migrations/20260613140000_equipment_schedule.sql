-- Equipment schedule data model: clients, sites, equipment_schedule, and the
-- schedule kind/status enums. A single Equipment schedule entity carries the kind
-- of commitment as an attribute rather than a table per kind (see docs/adr/0003).
-- Single-tenant with an authenticated-only RLS baseline (see docs/adr/0002).
-- Applied as a versioned migration via `supabase db push` (see docs/adr/0001).

-- The non-overlap exclusion constraint mixes an equality test on equipment_id
-- with a range-overlap test; btree_gist teaches GiST to index the equality side.
create extension if not exists btree_gist with schema extensions;

-- btree_gist lives in the extensions schema; put it on the search_path so the GiST
-- exclusion constraint below can resolve the equality operator class in any environment
-- (Supabase configures this by default; a bare Postgres may not).
set search_path = public, extensions;

-- The kind of commitment an Equipment schedule represents. Closed set; a new kind
-- is a new enum value, never a new table (see docs/adr/0003).
create type public.schedule_kind as enum (
  'work',
  'transit',
  'maintenance'
);

-- An Equipment schedule is either a real commitment (active) or freed (cancelled);
-- cancelled schedules are never shown and do not reserve their span.
create type public.schedule_status as enum (
  'active',
  'cancelled'
);

-- A Client is an organization an Equipment is committed to work for. UI: "Cliente".
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- A Site is a job location where committed Equipment works, belonging to at most
-- one Client. Internal Sites have none, so client_id is nullable. UI: "Obra".
create table public.sites (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients (id) on delete restrict,
  name text not null,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index sites_client_id_idx on public.sites (client_id);

-- An Equipment schedule is a half-open [starts_at, ends_at) time range during
-- which one Equipment is committed. Work-kind rows reference one Site; transit-kind
-- rows reference an origin and a destination Site; maintenance references neither.
-- The Client of a work schedule is reached through the Site, never stored here.
create table public.equipment_schedule (
  id uuid primary key default gen_random_uuid(),
  equipment_id uuid not null references public.equipment (id) on delete cascade,
  kind public.schedule_kind not null,
  status public.schedule_status not null default 'active',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  site_id uuid references public.sites (id) on delete restrict,
  origin_site_id uuid references public.sites (id) on delete restrict,
  destination_site_id uuid references public.sites (id) on delete restrict,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- A half-open range is only well-formed when it has positive length.
  constraint equipment_schedule_range_well_formed check (starts_at < ends_at),

  -- Each kind references exactly the Sites its commitment needs: work has one Site
  -- and no transit endpoints; transit has both endpoints and no work Site; and
  -- maintenance references no Site at all.
  constraint equipment_schedule_kind_sites check (
    case kind
      when 'work' then
        site_id is not null
        and origin_site_id is null
        and destination_site_id is null
      when 'transit' then
        site_id is null
        and origin_site_id is not null
        and destination_site_id is not null
        and origin_site_id <> destination_site_id
      when 'maintenance' then
        site_id is null
        and origin_site_id is null
        and destination_site_id is null
    end
  )
);

create index equipment_schedule_equipment_id_idx on public.equipment_schedule (equipment_id);
create index equipment_schedule_status_idx on public.equipment_schedule (status);
create index equipment_schedule_site_id_idx on public.equipment_schedule (site_id);
create index equipment_schedule_origin_site_id_idx on public.equipment_schedule (origin_site_id);
create index equipment_schedule_destination_site_id_idx on public.equipment_schedule (destination_site_id);

-- Non-overlap invariant: for a given Equipment, two active schedules may not
-- overlap in time (see docs/adr/0003). Enforced in Postgres so it holds for every
-- writer. The tstzrange is half-open '[)', so adjacent periods (one ending exactly
-- when the next begins) touch without colliding. The partial WHERE clause excludes
-- cancelled schedules, so a cancelled schedule frees its span.
alter table public.equipment_schedule
  add constraint equipment_schedule_no_overlap
  exclude using gist (
    equipment_id with =,
    tstzrange(starts_at, ends_at, '[)') with &&
  )
  where (status = 'active');

create trigger sites_set_updated_at
  before update on public.sites
  for each row
  execute function public.set_updated_at();

create trigger clients_set_updated_at
  before update on public.clients
  for each row
  execute function public.set_updated_at();

create trigger equipment_schedule_set_updated_at
  before update on public.equipment_schedule
  for each row
  execute function public.set_updated_at();

-- RLS: the app reaches Supabase with the publishable (anon) key, so every table
-- must be protected. Baseline grants authenticated callers full access and locks
-- out anon entirely; tighten per-role later without a data migration (see docs/adr/0002).
alter table public.clients enable row level security;
alter table public.sites enable row level security;
alter table public.equipment_schedule enable row level security;

create policy "Authenticated full access" on public.clients
  for all to authenticated using (true) with check (true);

create policy "Authenticated full access" on public.sites
  for all to authenticated using (true) with check (true);

create policy "Authenticated full access" on public.equipment_schedule
  for all to authenticated using (true) with check (true);
