# Server-side pagination + column sorting

Status: ready-for-agent

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

- [ ] A `Pagination` component exists in `@/core/components/ui`, styled per DESIGN.md.
- [ ] Pagination is server-side (`count` + `.range`); page and page size live in the store and the query key.
- [ ] Page-size options are `[10, 20, 50, 100]`, default 20, via a shared constant.
- [ ] Name / Total hours / Next maintenance headers sort server-side; default is `next_maintenance_date asc, nulls last`.
- [ ] Pagination and sorting compose correctly with the filters from issue 04.

## Blocked by

- Issue 04 (filters: search + status + type multi-select)
