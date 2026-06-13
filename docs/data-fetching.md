# Data fetching

> **Project paths.** `@/*` maps to the repo root (`tsconfig.json`). The data layer
> lives in `core/query/` (TanStack Query + toasts), `core/errors/` (error
> normalization + user-facing copy), `lib/supabase/` (clients + helpers), and
> `core/http/` (REST for non-Supabase APIs).

## Philosophy

Supabase is the data layer. Its client is a typed query builder, so we never
hand-write API paths or REST verbs against it. **TanStack Query** owns server
state — caching, deduping, retries, and abort — and is the only place that holds
remote data. **sonner** surfaces failures as toasts. Errors are normalized once
and shown to users as explicit, friendly copy; the raw `error.message` is never
rendered.

This replaces hand-rolled fetch clients, manual `{ loading, error }` state, and
per-call abort/retry plumbing. If you find yourself writing those, reach for
`useQuery` / `useMutation` instead.

## The pieces

| Piece | Location | Responsibility |
|-------|----------|----------------|
| `QueryProvider` | `@/core/query` | Mounts `QueryClientProvider` + the themed `<Toaster>`. Already wrapped around the app in `app/layout.tsx`. |
| `makeQueryClient` | `@/core/query` | Builds the `QueryClient`; its cache `onError` shows a user-friendly toast for every unhandled failure. |
| `runSupabase` | `@/lib/supabase/runSupabase` | Awaits a supabase-js builder, returns `data`, throws a normalized `AppError` on `error`. |
| `AppError` / `normalizeError` | `@/core/errors` | One error shape for supabase, HTTP, network, and abort failures. |
| `getUserMessage` | `@/core/errors` | The single source of user-facing error copy. |
| `apiFetch` | `@/core/http` | Thin fetch for non-Supabase REST APIs. |

## Reading data

`queryFn` calls Supabase through `runSupabase` and forwards TanStack's `signal`
for abort:

```tsx
const supabase = createClient()

const { data, isLoading, error } = useQuery({
  queryKey: ["equipment"],
  queryFn: ({ signal }) =>
    runSupabase(supabase.from("equipment").select("*").abortSignal(signal)),
})
```

`queryKey` is the cache identity — include every input the query depends on
(`["equipment", id]`) so that changing `id` refetches and caches independently.

## Writing data

```tsx
const queryClient = useQueryClient()

const { mutate, isPending } = useMutation({
  mutationFn: (input: EquipmentInsert) =>
    runSupabase(supabase.from("equipment").insert(input).select().single()),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["equipment"] }),
})
```

## Errors are always user-friendly

Every unhandled query/mutation failure shows a friendly toast automatically — the
copy comes from `getUserMessage`, never the raw message. Two ways to handle a
specific error yourself:

**Inline** (preferred when the error belongs next to the UI). Opt out of the
global toast and render your own copy:

```tsx
const { error } = useQuery({
  queryKey: ["equipment"],
  queryFn: ({ signal }) => runSupabase(supabase.from("equipment").select("*").abortSignal(signal)),
  meta: { skipGlobalErrorToast: true },
})

if (error) {
  return <p className="text-status-error">{getUserMessage(error).title}</p>
}
```

**Branch on the failure.** `AppError` carries `kind`, `status`, `code`, and
`details`:

```ts
import { normalizeError } from "@/core/errors"

const failure = normalizeError(error)
if (failure.code === "23505") {
  // duplicate — show the relevant field error
}
```

Rules:

- Never render `error.message` (the "UI errors" rule in `AGENTS.md`). Use
  `getUserMessage`, or write explicit copy in the component.
- Add new tailored copy to `core/errors/messages.ts`, keyed by code or status —
  that is the one place user-facing error text lives.

## Non-Supabase REST APIs

For external services or internal route handlers, `apiFetch` returns parsed JSON
and throws a normalized `AppError`. TanStack still owns retries and abort —
forward its `signal`:

```ts
useQuery({
  queryKey: ["rates", zip],
  queryFn: ({ signal }) => apiFetch<RateResponse>("/api/rates", { params: { zip }, signal }),
})
```

## Database types

The typed client (`createClient<Database>`) is only as good as
`lib/supabase/database.types.ts`. Regenerate it whenever the schema changes:

```bash
supabase login            # or set SUPABASE_ACCESS_TOKEN
pnpm db:types
```

Until it is generated, a placeholder keeps the client compiling but table-level
queries are not type-checked against the schema.

## Do / Don't

- **Do** put remote reads in `useQuery`, writes in `useMutation`, and unwrap
  Supabase with `runSupabase`.
- **Don't** hand-roll a fetch client, a `{ loading, error }` hook, or per-call
  abort/retry — TanStack does this.
- **Don't** call Supabase with REST verbs or paths; use the query builder.
- **Don't** surface raw error text; always go through `getUserMessage`.
