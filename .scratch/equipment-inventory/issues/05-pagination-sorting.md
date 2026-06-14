# Server-side pagination + column sorting

Status: done

## What to build

Make the (now filtered) list paginate and sort server-side. Pagination uses a
Supabase count query for totals plus `.range` for the current page; page and page
size live in the Zustand store. A page-size selector offers `[10, 20, 50, 100]`
with a default of 20.

Table column headers for Name, Total hours, and Next maintenance are sortable
(server-side `order`), reflected in the store. The default order (no explicit sort
chosen) is "attention first": `next_maintenance_date asc, nulls last`, so overdue
and soonest-due equipment float to the top and units with no scheduled maintenance
sink to the bottom. Selecting a sortable header overrides the default.

New UI-kit component: `Pagination` (page controls + page-size selector).

## Acceptance criteria

- [x] A `Pagination` component exists in `@/core/components/ui`, styled per DESIGN.md.
- [x] Pagination is server-side (`count` + `.range`); page and page size live in the store and the query key.
- [x] Page-size options are `[10, 20, 50, 100]`, default 20, via a shared constant.
- [x] Name / Total hours / Next maintenance headers sort server-side; default is `next_maintenance_date asc, nulls last`.
- [x] Pagination and sorting compose correctly with the filters from issue 04.

## Blocked by

- Issue 04 (filters: search + status + type multi-select)

## Comments

Implemented. `Pagination` added to the UI kit (prev/next + "Página X de Y" + a
page-size `OptionSelect`). `useEquipmentList` now selects with
`{ count: "exact" }` and `.range((page-1)*size, …)`, returning `{ items, total }`;
`page`, `pageSize`, and `sort` live in the store and in the query key, with
`keepPreviousData` so paging doesn't flash. Page-size options come from the shared
`LIST_PAGE_SIZE_OPTIONS` (`[10,20,50,100]`, default 20).

Name / Total hours / Next maintenance headers are sortable (`SortableHeader` toggles
asc↔desc via the store and shows a direction chevron). With no explicit sort the
query orders `next_maintenance_date asc, nullsFirst: false` (attention first).
Changing any filter, sort, or page size resets to page 1.

Scaffolded `@/core/dates` (the sole temporal-polyfill consumer, per AGENTS.md) with
`formatDate` / `isPast` / `today`; the Next-maintenance column formats the date and
flags overdue units in red.

Verified: `tsc --noEmit` clean, `pnpm lint` clean.
