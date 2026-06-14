# Data table view + grid/list toggle + Zustand list store

Status: ready-for-agent

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

- [ ] A `Table` and a `ToggleGroup` component exist in `@/core/components/ui`, built on Radix, styled per DESIGN.md.
- [ ] The table renders the Core columns; serial and hours use JetBrains Mono; unassigned operator shows an em-dash.
- [ ] A row click navigates to `/equipment/:id`.
- [ ] The toggle switches grid <-> table; default is card grid.
- [ ] A Zustand store holds the active view mode; navigating to a detail stub and back restores it.
- [ ] No local constants inside components; column labels come from shared `fields.ts`.

## Blocked by

- Issue 02 (equipment card grid at /equipment with live data)
