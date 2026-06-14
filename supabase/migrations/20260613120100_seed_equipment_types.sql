-- Seed a starter set of equipment types so equipment (which requires a NOT NULL
-- equipment_type_id) can be created immediately. These are starting points the
-- user can rename or extend; the `category` groups types for filtering.

insert into public.equipment_types (name, category, icon) values
  ('Forklift', 'material-handling', 'forklift'),
  ('Excavator', 'earthmoving', 'excavator'),
  ('Wheel Loader', 'earthmoving', 'loader'),
  ('Truck', 'transport', 'truck'),
  ('Crane', 'lifting', 'crane');
