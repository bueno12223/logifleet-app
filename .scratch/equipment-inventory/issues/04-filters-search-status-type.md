# Filters: search + status + type multi-select

Status: ready-for-agent

## What to build

An inline filter bar above both views (card grid and table) with three filters,
all driving server-side queries through the Zustand store:

- A search input matching `name`, `serial_number`, and `model` (server-side
  `ilike` OR), debounced 300ms via a `SEARCH_DEBOUNCE_MS` constant in
  `core/constants`.
- A Status multi-select over the 5 enum values (`in_use`, `available`,
  `in_transit`, `maintenance`, `retired`), server-side `.in`.
- An Equipment Type multi-select whose options come from `equipment_types`,
  server-side `.in`.

Filter state lives in the Zustand store; the TanStack `queryKey` derives from it so
changes refetch and cache independently. A result count ("Mostrando N equipos")
reflects the active filters. Both views respect the same filters.

New UI-kit component: a reusable `MultiSelect` (Radix Popover + checkbox list, a
"N selected" trigger, and a clear action), used for both Status and Type.

## Acceptance criteria

- [ ] A `MultiSelect` component exists in `@/core/components/ui`, built on Radix, styled per DESIGN.md.
- [ ] Search filters `name`/`serial_number`/`model` server-side, debounced 300ms via `SEARCH_DEBOUNCE_MS`.
- [ ] Status and Type multi-selects filter server-side via `.in`; Type options load from `equipment_types`.
- [ ] All filter state lives in the Zustand store and is reflected in the query key; both views honor it.
- [ ] A result count reflects the active filters.
- [ ] Status/field labels come from shared `labels.ts`/`fields.ts`, not inline.

## Blocked by

- Issue 03 (data table view + grid/list toggle + Zustand list store)
