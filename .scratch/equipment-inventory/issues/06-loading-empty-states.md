# Loading skeletons + empty states

Status: ready-for-agent

## What to build

The non-data paths for the equipment list. While a page is fetching, show skeleton
placeholders that match the active view: skeleton cards in grid mode, skeleton rows
in table mode, with no layout shift.

Two distinct empty states:

- No equipment in the fleet at all: a message like "No tienes equipos aún" with a
  `Nuevo Equipo` call to action.
- Filters matched nothing: "Sin resultados" with a "Limpiar filtros" action that
  resets the filter state in the store.

Confirm fetch errors surface through the existing global error toast
(`QueryClient` `onError` -> `getUserMessage`); do not set `skipGlobalErrorToast`
and do not render raw error text.

New UI-kit component: `Skeleton`.

## Acceptance criteria

- [ ] A `Skeleton` component exists in `@/core/components/ui`.
- [ ] Loading shows view-matching skeletons (cards in grid, rows in table) with no layout shift.
- [ ] Empty-fleet state shows distinct copy with a `Nuevo Equipo` CTA.
- [ ] No-results state shows distinct copy with a working "Limpiar filtros" action that clears store filters.
- [ ] Fetch errors surface via the global toast through `getUserMessage`; no raw error text.

## Blocked by

- Issue 04 (filters: search + status + type multi-select)
