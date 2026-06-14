# Role-based access control via a profiles table and a custom access-token hook

LogiFleet authenticates Users through Supabase Auth. Each User carries exactly
one Role from a closed, ordered set (`super_admin`, `manager`, `viewer` — see
CONTEXT.md). We need that Role available in two places: the proxy/middleware
route guard (which reads only the session, before any page renders) and Postgres
RLS policies (which currently grant blanket `authenticated` access per ADR 0002).

## Decision

The Role lives in a `public.profiles` table — one row per `auth.users` row,
linked by id, holding `role app_role not null default 'viewer'`. An on-insert
trigger on `auth.users` creates the matching profile so the two can never drift.
`profiles` is the source of truth and the seam a future user-management surface
hangs off.

A custom access-token hook (`public.custom_access_token_hook`) reads the caller's
profile role and injects it into the JWT as a `user_role` claim. The route guard
and RLS both read the claim — `auth.jwt() ->> 'user_role'` — with no per-request
database round trip. The hook function is granted to `supabase_auth_admin` by the
same migration that defines it.

## Alternatives considered

- **`app_metadata.role` on `auth.users`.** Auto-embedded in the JWT, no table, no
  hook. Rejected because it gives no queryable table for the user-management UI
  we expect, and role changes go through the admin API rather than ordinary SQL.
- **`profiles` table read per request (no hook).** No hook, no dashboard step,
  and role changes apply instantly. Rejected because it costs a database query on
  every guarded request and pushes role-resolution logic into both the middleware
  and a SECURITY DEFINER RLS helper, rather than carrying it once in the token.

## Consequences

- **The hook must be enabled in the remote dashboard** (Authentication → Hooks →
  Customize Access Token). The migration creates and grants the function, but a
  hosted project will not invoke it until the toggle is flipped. Until then the
  `user_role` claim is absent.
- The middleware and RLS therefore treat a **missing claim as "no role"** and
  fail closed at the role layer. The day-one auth gate only checks that the caller
  is authenticated, so the app keeps working before the hook is enabled; the role
  scaffolding (`ROUTE_ROLES` config + `requireRole` helper) stays inert until both
  the hook is on and a route opts in.
- A role change only takes effect on the **next access token** (refresh or
  re-login), the standard trade-off for putting role in the JWT.
- The blanket `authenticated` RLS baseline from ADR 0002 stays in place for now;
  tightening policies to read `user_role` is a follow-up this decision enables
  without a data migration.
