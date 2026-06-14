# LogiFleet

The domain context for a fleet and equipment management platform: the physical
assets a company operates, who runs them, and the work logged against them.

## Language

**Equipment**:
A single physical fleet asset (e.g. a forklift, excavator, or truck).
Spanish UI label: **Equipo** (plural **Equipos**); the inventory surface is
**Inventario de Equipos**.
_Avoid_: Machine, vehicle, asset, and their Spanish forms Máquina / Maquinaria.

**Equipment type**:
A classification an Equipment belongs to (category + display metadata).
_Avoid_: Machine type, model

**Operator**:
A field worker who runs or services Equipment, tracked as a directory record
(name, license, active flag) — not an app login. Distinct from the authenticated
**User** (a fleet manager) who operates the app.
_Avoid_: Driver, user

**User**:
A person who authenticates and operates the app (a fleet manager). Carries exactly
one **Role**. Distinct from an **Operator**, who has no login.
_Avoid_: Account, login, member

**Role**:
The single access tier a **User** holds, governing what they may see and do.
Closed set, ordered most to least privileged:
- **super_admin** — full control, including managing other Users
- **manager** — day-to-day fleet operations
- **viewer** — read-only access
_Avoid_: Permission (a Role is a coarse tier, not a fine-grained grant), group

**Equipment status**:
The operational lifecycle state of an Equipment. Closed set:
- **in_use** — currently being operated
- **available** — operational and free to assign, not currently in use
- **in_transit** — being moved between locations
- **maintenance** — down for service
- **retired** — decommissioned, no longer in the fleet
_Avoid_: active (too coarse — split into in_use / available), idle (folded into
available)

**Equipment schedule**:
A period bounded by a start and end during which an **Equipment** is committed.
Modelled as one entity; the kind of commitment is an attribute, not a separate type.
**Kind** (closed set):
- **work** — assigned to a job at a **Site** (UI: "En obra"; a future-dated one is
  "Reservada", created via "Nueva reserva")
- **transit** — being moved between Sites (UI: "En tránsito")
- **maintenance** — down for service (UI: "Mantenimiento")
A schedule also carries a **status**: `active` or `cancelled` (cancelled is never shown).
Spans with no schedule are `available` (UI: "Disponible") — the absence of a row, not a kind.
_Avoid_: schedule_task, booking, event, allocation, gantt bar, a standalone
Reservation/Reserva entity (a reserva is a work-kind schedule, not its own table)

**Client**:
An organization an **Equipment** is committed to work for, tracked as a first-class
directory record. Spanish UI label: **Cliente**.
_Avoid_: Customer, account, company

**Site**:
A job location where committed **Equipment** works, belonging to at most one **Client**
(internal Sites have none). Spanish UI label: **Obra** (plural **Obras**).
_Avoid_: Proyecto (an alias for Site, not a separate grouping level), location, jobsite

## Relationships

- An **Equipment** is classified by exactly one **Equipment type**
- An **Equipment** may have one current **Operator** assigned
- An **Operator** is not (yet) a **User**; the two are different people and
  different rows. An Operator may gain an optional link to a User in the future.
- An **Equipment** has zero or more **Equipment schedule** periods over time
- An **Equipment**'s current **Equipment status** is the kind of the **Equipment
  schedule** active today; spans with no schedule are `available`
- A **Site** belongs to at most one **Client** (internal Sites have none)
- A **work**-kind **Equipment schedule** is at exactly one **Site**; its **Client**
  is reached through that Site, never stored on the schedule
- A **transit**-kind **Equipment schedule** references an origin and a destination **Site**
- For a given **Equipment**, `active` **Equipment schedule** periods never overlap in
  time; a `cancelled` schedule frees its span

## Flagged ambiguities

- The initial ERD named the core table `MACHINES` / `MACHINE_TYPES`; resolved to
  **Equipment** / **Equipment type** to match the established codebase and memory.
- The inventory mockups (Stitch) used "Máquina / Maquinaria" throughout; rejected
  in favour of **Equipo / Equipos** so the ubiquitous language is consistent in
  both code and user-facing Spanish copy. The list route is `/equipment`.
- `schedule_tasks` (deferred in `.scratch/activity-log`) is superseded by
  **Equipment schedule** — they must not coexist. `maintenance_records` remains the
  detailed service history (parts, cost, notes) that references a maintenance-kind
  **Equipment schedule**, not a competing scheduling table.
- "Reservada" and "En obra" are not distinct concepts: both are a **work**-kind
  **Equipment schedule**, shown as "Reservada" before its start date and "En obra"
  during its run. The distinction is derived from the date, never stored.
