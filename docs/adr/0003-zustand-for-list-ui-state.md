# Zustand for equipment list UI state, not URL query params

The equipment inventory list (`/equipment`) holds client-side UI state: active
filters (search text, status, equipment type), sort, page, page size, and the
card/table view mode. This state lives in a dedicated Zustand store, not in the
URL. Server state (the equipment pages themselves) stays in TanStack Query, whose
`queryKey` is derived from the store.

The driving requirement was that opening an Equipment's detail and navigating back
must restore the list exactly as it was left. A Zustand store satisfies this
because it survives client-side navigation within the session.

We considered — and recommended — URL query params instead
(`/equipment?view=grid&status=in_use&page=2`). That approach also restores state on
back-navigation (via Next's scroll restoration plus the warm TanStack cache) and
additionally makes list state shareable and survivable across a hard refresh, with
zero new dependencies. We consciously chose Zustand anyway: the team wants filters
remembered across any in-app navigation (including arriving via the sidebar), which
URL params do not give without extra plumbing.

The trade-offs this decision accepts: list state is **not shareable or
bookmarkable**, and it **resets on a hard refresh** unless we later add Zustand's
`persist` middleware. This is also the first global client-state library in a
codebase that otherwise keeps server state in TanStack Query and nothing else, so
the choice is worth recording lest a future reader assume the more common Next
URL-params pattern was simply overlooked. Revisit if shareable/deep-linkable list
URLs become a requirement.
