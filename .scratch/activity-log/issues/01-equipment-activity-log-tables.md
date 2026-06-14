# Equipment activity-log tables (maintenance, fuel, schedule, attachments)

Status: needs-triage

## Summary

Design and implement the activity-stream tables that hang off `equipment`,
deferred from the initial equipment-core data model:

- `maintenance_records` — service history per equipment
- `fuel_logs` — refuel events per equipment
- `schedule_tasks` — calendar entries / operator assignments
- `attachments` — files attached to equipment or to one of the above records
- `equipment_assignments` — operator assignment **history**
  (equipment_id, operator_id, started_at, ended_at). The equipment-core migration
  only carries `equipment.current_operator_id` (latest operator, no history); this
  table is where "who ran machine #7 last Tuesday?" gets answered. "Current" is the
  open row (null `ended_at`).

## Why this is out of scope (for now)

The initial request was the **equipment core** data model. During grilling we
scoped the first Supabase migration down to `equipment`, `equipment_types`, and
`operators` so that:

- the first migration stays small and reviewable, and the foundational
  conventions (types, RLS, units) are settled before they get copied across many
  tables;
- each activity stream is its own feature with its own UI surface;
- `attachments` is **polymorphic** (`record_type` + `record_id` in the ERD) and
  needs a dedicated design pass — a plain FK can't model it, so we should decide
  between separate per-parent FK columns, a typed join, or a checked
  polymorphic reference before committing it.

## Open questions to resolve at triage

- Should each activity table reference `operators` directly, or via a shared
  assignment concept?
- How are statuses/types on these tables modeled (enum vs lookup vs check)? Reuse
  whatever convention the equipment-core migration establishes.
- Attachments: polymorphic reference strategy (see above).

## Related

- Initial equipment-core data model (the grill session that spawned this ticket)
- Glossary: [CONTEXT.md](../../../CONTEXT.md)
