# Equipment card grid at /equipment with live data

Status: done

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

- [x] `/equipment` renders a responsive card grid of real equipment from Supabase via `useQuery` + `runSupabase`.
- [x] Each card shows image (with icon fallback), status badge with correct tone, name, `type • serial` subtitle, and total hours.
- [x] The `/maquinas` nav entry is updated to `/equipment` and marked active there.
- [x] All user-facing copy uses Equipo/Equipos, not Máquina.
- [x] `Nuevo Equipo` navigates to a `/equipment/new` stub; a card click navigates to an `/equipment/:id` stub.
- [x] Status tone map and status labels live in shared constants (`ui.ts`, `labels.ts`), not inline.
- [x] No raw error messages surfaced; failures go through the global toast.

## Blocked by

None - can start immediately.

## Comments

Implemented. `/equipment` page (`app/equipment/page.tsx`) renders `EquipmentInventory`
(client) which reads the first `DEFAULT_PAGE_SIZE` (20) rows via `useEquipmentList`
(`useQuery` + `runSupabase`), joining `equipment_types` (name, icon) and `operators`
(full_name). Row type is derived with Supabase's `QueryData` so the joins are typed.

Cards: `EquipmentCard` shows the photo (or a generic `Container` glyph when
`image_url` is null), a status `Badge` (tone from `EQUIPMENT_STATUS_TONE`), name,
`type • serial` subtitle (mono), and total hours. Whole card links to
`/equipment/:id`. Constants split per docs/constants.md: status labels in
`labels.ts`, tone map + paths in `ui.ts`, column labels in `fields.ts`.

Stubs added at `/equipment/new` and `/equipment/[id]`. Nav updated Máquinas→Equipos,
`/maquinas`→`/equipment`.

Notes / deviations:
- Icon fallback is a single generic equipment glyph, not a per-type mapping from the
  `equipment_type.icon` string — the icon-string vocabulary isn't defined yet. Swap in
  a string→glyph map once that vocabulary exists.
- The visual "Buscar equipo" field is delivered (functional) in issue 04; not added as
  a dead visual-only field here.

Verified: `tsc --noEmit` clean, `pnpm lint` clean. Full `next build` run at the end of
the feature branch.
