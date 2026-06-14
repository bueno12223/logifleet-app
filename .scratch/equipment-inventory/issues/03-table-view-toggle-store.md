# Data table view + grid/list toggle + Zustand list store

Status: done

## What to build

Add the second view mode and the client state that switches between them. A dense
data table (DESIGN.md "Lists": high-density, subtle horizontal dividers, hover
tint) renders the same equipment with the Core column set: Name, Type (with icon),
Status (badge), Operator (em-dash when unassigned), Serial number (mono), Total
hours (mono, right-aligned), Next maintenance. A whole row click navigates to the
`/equipment/:id` stub.

A `ToggleGroup` in the filter bar switches between card grid and data table; the
default is card grid. The active view mode is held in a dedicated Zustand store
(the first global client-state store in the app — see docs/adr/0003). The store is
the seed for later filter/sort/page state too.

The requirement this slice proves: opening an equipment detail stub and navigating
back restores the view mode the user left (store survives client navigation).

New UI-kit components: `Table` (and subcomponents) and `ToggleGroup`, both built on
Radix primitives and styled per DESIGN.md.

## Acceptance criteria

- [x] A `Table` and a `ToggleGroup` component exist in `@/core/components/ui`, built on Radix, styled per DESIGN.md.
- [x] The table renders the Core columns; serial and hours use JetBrains Mono; unassigned operator shows an em-dash.
- [x] A row click navigates to `/equipment/:id`.
- [x] The toggle switches grid <-> table; default is card grid.
- [x] A Zustand store holds the active view mode; navigating to a detail stub and back restores it.
- [x] No local constants inside components; column labels come from shared `fields.ts`.

## Blocked by

- Issue 02 (equipment card grid at /equipment with live data)

## Comments

Implemented. `Table` (+ `TableHeader/Body/Row/Head/Cell`) added to the UI kit over
native table elements (Radix has no table primitive — the documented AGENTS.md
allowance), and `ToggleGroup`/`ToggleGroupItem` over `@radix-ui/react-toggle-group`.
Both styled per DESIGN.md (high-density rows, card-border dividers, navy hover tint;
segmented control with navy active state).

`EquipmentTable` renders the Core columns with serial + hours in mono, hours
right-aligned, and `—` for an unassigned operator. The whole row navigates to
`/equipment/:id` via `useRouter`; the name cell is also a real `<Link>`
(stopPropagation) for keyboard/AT users. Column headers come from `fields.ts`.

`useEquipmentListStore` (Zustand, module-level) holds `view`; `EquipmentInventory`
binds the `ToggleGroup` to it and renders grid or table. Because the store lives at
module scope it survives client navigation, so the detail round-trip restores the
view. Default view is `grid` (`DEFAULT_VIEW`).

Deviation: the "Type (with icon)" only shows the type name — the per-type icon is the
same generic-glyph situation noted in issue 02 (no icon-string vocabulary yet), and a
repeated generic glyph per row adds noise, so it's omitted pending a real mapping.

Verified: `tsc --noEmit` clean, `pnpm lint` clean.
