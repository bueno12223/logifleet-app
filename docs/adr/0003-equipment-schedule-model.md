# Equipment schedule: one entity, database-enforced non-overlap

The fleet availability timeline needs time-bounded bars of several kinds (work,
transit, maintenance) per Equipment. We model these as a single **Equipment schedule**
entity with a `kind` attribute and a `status` (`active`/`cancelled`), rather than one
table per kind, because every kind shares the same core invariant ("an Equipment is
committed for a time range") and the set of kinds is open — a new kind is a new enum
value, not a new table. Work-kind rows reference a Site (the Client is reached through
the Site, never stored on the schedule); transit references an origin and destination
Site; maintenance references neither. "Reservada" vs "en obra" is derived from the
current date against the row's range, never stored.

Non-overlap (no Equipment is committed to two active schedules at once) is enforced in
Postgres with a partial GiST exclusion constraint over `equipment_id` and a half-open
`tstzrange(starts_at, ends_at)` where `status = 'active'` — not in application code — so
the invariant holds regardless of the writer (seed, manual SQL, or the future
interaction feature). Half-open ranges let adjacent periods (a work span ending exactly
when a transit span begins) touch without colliding.

## Considered options

- **One table per kind (Reservation / MaintenanceWindow / Transfer).** Rejected: every
  new bar kind (e.g. transit) forces a new table, migration, and another source to union
  in the timeline view-model; the kinds are an open set aligned to `equipment_status`.
- **Application-level overlap checks.** Rejected: cannot guarantee consistency across
  seeds, manual SQL, and multiple write paths; the timeline's correctness depends on the
  invariant always holding.

## Consequences

- `equipment.status` becomes a cache of the kind of the schedule active today; spans
  with no active schedule are `available`.
- `schedule_tasks` (deferred in `.scratch/activity-log`) is superseded by this entity;
  `maintenance_records` becomes detailed service history that references a
  maintenance-kind schedule, not a competing scheduling table.
