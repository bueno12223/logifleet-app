-- Seed a minimal but realistic demo set so the Fleet Availability Timeline renders
-- real data: Clients, Sites (some internal, some linked to a Client), Equipment
-- referencing the already-seeded equipment_types, and Equipment schedules across
-- all three kinds (work / transit / maintenance) with deliberate available gaps.
-- "Today" for this demo is 2026-06-13, so the June 2026 month shows a live mix of
-- in-use, reserved, transit, maintenance, and available spans.
--
-- Idempotent: the whole block is skipped if its first Client already exists, so a
-- re-run (or running after the timeline has real data) does not duplicate the demo.
-- Adjacent schedules are half-open and touch at a day boundary without colliding;
-- the cancelled schedule deliberately overlaps an active one to prove that a
-- cancelled schedule frees its span (it is excluded from the no-overlap constraint).

do $$
declare
  client_construction_id uuid;
  client_mining_id uuid;

  site_north_tower_id uuid;
  site_south_building_id uuid;
  site_mine_id uuid;
  site_internal_yard_id uuid;

  type_forklift_id uuid;
  type_excavator_id uuid;
  type_wheel_loader_id uuid;
  type_truck_id uuid;
  type_crane_id uuid;

  equipment_excavator_id uuid;
  equipment_truck_id uuid;
  equipment_loader_id uuid;
  equipment_forklift_id uuid;
begin
  if exists (select 1 from public.clients where name = 'Constructora Andes') then
    return;
  end if;

  insert into public.clients (name) values
    ('Constructora Andes') returning id into client_construction_id;
  insert into public.clients (name) values
    ('Mineria del Norte') returning id into client_mining_id;

  -- A Site belongs to at most one Client; the internal yard Site has none.
  insert into public.sites (client_id, name, address) values
    (client_construction_id, 'Obra Torre Norte', 'Av. Las Condes 1200')
    returning id into site_north_tower_id;
  insert into public.sites (client_id, name, address) values
    (client_construction_id, 'Obra Edificio Sur', 'Calle Sur 450')
    returning id into site_south_building_id;
  insert into public.sites (client_id, name, address) values
    (client_mining_id, 'Mina Los Pelambres', 'Ruta 5 km 230')
    returning id into site_mine_id;
  insert into public.sites (client_id, name, address) values
    (null, 'Patio Central', 'Camino Industrial 80')
    returning id into site_internal_yard_id;

  select id into type_forklift_id from public.equipment_types where name = 'Forklift';
  select id into type_excavator_id from public.equipment_types where name = 'Excavator';
  select id into type_wheel_loader_id from public.equipment_types where name = 'Wheel Loader';
  select id into type_truck_id from public.equipment_types where name = 'Truck';
  select id into type_crane_id from public.equipment_types where name = 'Crane';

  -- equipment.status caches the kind of today's active schedule (see docs/adr/0003):
  -- the excavator and truck are committed today, the forklift is in maintenance,
  -- the loader is free today (a future reservation), and the crane is unscheduled.
  insert into public.equipment (equipment_type_id, name, model, serial_number, license_plate, status) values
    (type_excavator_id, 'Excavadora CAT 320', 'CAT 320', 'EXC-320-0001', null, 'in_use')
    returning id into equipment_excavator_id;
  insert into public.equipment (equipment_type_id, name, model, serial_number, license_plate, status) values
    (type_truck_id, 'Camion Volvo FH', 'Volvo FH16', 'TRK-FH-0002', 'LF-1234', 'in_transit')
    returning id into equipment_truck_id;
  insert into public.equipment (equipment_type_id, name, model, serial_number, license_plate, status) values
    (type_wheel_loader_id, 'Cargador Frontal 950', 'CAT 950', 'WLD-950-0003', null, 'available')
    returning id into equipment_loader_id;
  insert into public.equipment (equipment_type_id, name, model, serial_number, license_plate, status) values
    (type_forklift_id, 'Montacargas Toyota', 'Toyota 8FG', 'FRK-8FG-0004', null, 'maintenance')
    returning id into equipment_forklift_id;
  insert into public.equipment (equipment_type_id, name, model, serial_number, license_plate, status) values
    (type_crane_id, 'Grua Liebherr LTM', 'Liebherr LTM 1090', 'CRN-LTM-0005', 'LF-5678', 'available');

  -- Excavator: a finished work span, a touching transit, the active work span
  -- running today, an available gap, then maintenance. The half-open ranges touch
  -- at 06-10 -> 06-11 and at 06-20 (work ends) without colliding.
  insert into public.equipment_schedule (equipment_id, kind, status, starts_at, ends_at, site_id) values
    (equipment_excavator_id, 'work', 'active', '2026-06-01 08:00:00+00', '2026-06-10 18:00:00+00', site_north_tower_id);
  insert into public.equipment_schedule (equipment_id, kind, status, starts_at, ends_at, origin_site_id, destination_site_id) values
    (equipment_excavator_id, 'transit', 'active', '2026-06-10 18:00:00+00', '2026-06-11 09:00:00+00', site_north_tower_id, site_south_building_id);
  insert into public.equipment_schedule (equipment_id, kind, status, starts_at, ends_at, site_id) values
    (equipment_excavator_id, 'work', 'active', '2026-06-11 09:00:00+00', '2026-06-20 18:00:00+00', site_south_building_id);
  insert into public.equipment_schedule (equipment_id, kind, status, starts_at, ends_at) values
    (equipment_excavator_id, 'maintenance', 'active', '2026-06-25 08:00:00+00', '2026-06-28 18:00:00+00');
  -- A cancelled work span overlapping the active 06-11 -> 06-20 work: proves a
  -- cancelled schedule is excluded from the no-overlap constraint and frees its span.
  insert into public.equipment_schedule (equipment_id, kind, status, starts_at, ends_at, site_id) values
    (equipment_excavator_id, 'work', 'cancelled', '2026-06-15 08:00:00+00', '2026-06-18 18:00:00+00', site_mine_id);

  -- Truck: in transit today, then a work span at the mine.
  insert into public.equipment_schedule (equipment_id, kind, status, starts_at, ends_at, origin_site_id, destination_site_id) values
    (equipment_truck_id, 'transit', 'active', '2026-06-12 06:00:00+00', '2026-06-14 12:00:00+00', site_internal_yard_id, site_mine_id);
  insert into public.equipment_schedule (equipment_id, kind, status, starts_at, ends_at, site_id) values
    (equipment_truck_id, 'work', 'active', '2026-06-14 12:00:00+00', '2026-06-22 18:00:00+00', site_mine_id);

  -- Loader: free today, with a future-dated work span (shows as reserved until it starts).
  insert into public.equipment_schedule (equipment_id, kind, status, starts_at, ends_at, site_id) values
    (equipment_loader_id, 'work', 'active', '2026-06-18 08:00:00+00', '2026-06-30 18:00:00+00', site_north_tower_id);

  -- Forklift: down for maintenance today, available afterwards.
  insert into public.equipment_schedule (equipment_id, kind, status, starts_at, ends_at) values
    (equipment_forklift_id, 'maintenance', 'active', '2026-06-08 08:00:00+00', '2026-06-15 18:00:00+00');

  -- Crane: no schedules at all -> reads as available for the whole month.
end $$;
