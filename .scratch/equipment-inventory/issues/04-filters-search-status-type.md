# Filters: search + status + type multi-select

Status: done

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

- [x] A `MultiSelect` component exists in `@/core/components/ui`, built on Radix, styled per DESIGN.md.
- [x] Search filters `name`/`serial_number`/`model` server-side, debounced 300ms via `SEARCH_DEBOUNCE_MS`.
- [x] Status and Type multi-selects filter server-side via `.in`; Type options load from `equipment_types`.
- [x] All filter state lives in the Zustand store and is reflected in the query key; both views honor it.
- [x] A result count reflects the active filters.
- [x] Status/field labels come from shared `labels.ts`/`fields.ts`, not inline.

## Blocked by

- Issue 03 (data table view + grid/list toggle + Zustand list store)

## Comments

Implemented. `MultiSelect` added to the UI kit on `@radix-ui/react-popover`: a
"Label (N)" trigger, a checkbox-style option list, and a Limpiar (clear) action.

`EquipmentFilters` is an inline bar with debounced search (local input state →
`setSearch` after `SEARCH_DEBOUNCE_MS`, applied as a PostgREST `or()` of
`name/serial_number/model ilike`, with the term sanitized so a comma can't break the
filter), a Status `MultiSelect` (enum values via `Constants` + `equipmentStatusLabels`),
and a Type `MultiSelect` (options from `useEquipmentTypes`). The bar also hosts the
result count and the view toggle.

All filter state lives in `useEquipmentListStore`; `useEquipmentList` reads it, applies
`.or`/`.in` server-side, and includes `{ search, statuses, typeIds }` in the query key
so each filter combination caches independently. Both views render the same filtered
list. Added a `clearFilters` action for the issue-06 "no results" state.

Verified: `tsc --noEmit` clean, `pnpm lint` clean.
