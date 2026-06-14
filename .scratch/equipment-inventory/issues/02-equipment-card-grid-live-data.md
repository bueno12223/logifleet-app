# Equipment card grid at /equipment with live data

Status: ready-for-agent

## What to build

The first end-to-end slice of the equipment inventory: a `/equipment` page that
renders the fleet as a grid of cards backed by real Supabase data. This replaces
the existing `/maquinas` nav stub.

Each card shows: `image_url` (falling back to the `equipment_type.icon` on a tinted
surface when null), a status badge, the equipment name, a subtitle of
`equipment_type.name • serial_number` (serial in JetBrains Mono), and total hours.
Data is read with `useQuery` + `runSupabase`, joining `equipment_types` for the
type name and icon. Render the first 20 rows only — filters, sorting, and
pagination arrive in later slices.

Page chrome: header titled "Inventario de Equipos" with a `Buscar equipo` search
field (visual only this slice), and a `Nuevo Equipo` button that navigates to a
`/equipment/new` placeholder route. Clicking a card navigates to an
`/equipment/:id` placeholder route. Both placeholder routes are simple stubs.

Use the Spanish UI term **Equipo / Equipos** throughout (never Máquina), per
CONTEXT.md. Status badge tones live in a shared `ui.ts` constant:
`available -> success`, `in_use -> navy`, `in_transit -> warning`,
`maintenance -> error`, `retired -> neutral`. Status display labels live in
`labels.ts`.

## Acceptance criteria

- [ ] `/equipment` renders a responsive card grid of real equipment from Supabase via `useQuery` + `runSupabase`.
- [ ] Each card shows image (with `equipment_type.icon` fallback), status badge with correct tone, name, `type • serial` subtitle, and total hours.
- [ ] The `/maquinas` nav entry is updated to `/equipment` and marked active there.
- [ ] All user-facing copy uses Equipo/Equipos, not Máquina.
- [ ] `Nuevo Equipo` navigates to a `/equipment/new` stub; a card click navigates to an `/equipment/:id` stub.
- [ ] Status tone map and status labels live in shared constants (`ui.ts`, `labels.ts`), not inline.
- [ ] No raw error messages surfaced; failures go through the global toast.

## Blocked by

None - can start immediately.
