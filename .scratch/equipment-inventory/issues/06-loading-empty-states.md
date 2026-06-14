# Loading skeletons + empty states

Status: done

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

- [x] A `Skeleton` component exists in `@/core/components/ui`.
- [x] Loading shows view-matching skeletons (cards in grid, rows in table) with no layout shift.
- [x] Empty-fleet state shows distinct copy with a `Nuevo Equipo` CTA.
- [x] No-results state shows distinct copy with a working "Limpiar filtros" action that clears store filters.
- [x] Fetch errors surface via the global toast through `getUserMessage`; no raw error text.

## Blocked by

- Issue 04 (filters: search + status + type multi-select)

## Comments

Implemented. `Skeleton` added to the UI kit. `EquipmentListSkeleton` mirrors the
active view — skeleton cards in grid mode, skeleton rows in a bordered container in
table mode — shown on `isPending` (first load); `keepPreviousData` keeps prior rows
visible while paging/filtering, so no flashing.

`EquipmentEmptyState` reads the store to branch: with active filters it shows "Sin
resultados" + a "Limpiar filtros" button (`clearFilters`); with none it shows "No
tienes equipos aún" + a `Nuevo Equipo` CTA.

Errors: the query throws a normalized `AppError`, so the `QueryClient` `onError`
toast (via `getUserMessage`) fires unchanged — no `skipGlobalErrorToast`, no raw
error text. To avoid showing a misleading empty state under the toast, an `isError`
branch renders a neutral one-line message instead.

Verified: `tsc --noEmit` clean, `pnpm lint` clean.
