# Single-tenant data model with an authenticated-only RLS baseline

LogiFleet is modeled as single-tenant: one company's fleet, no `company_id` /
`org_id` on any table. Because the app reaches Supabase with the publishable
(anon) key, every table has Row Level Security enabled with a baseline policy of
"`authenticated` callers have full access, `anon` has none" until real roles
exist.

We considered multi-tenant from day one (a `company_id` on every table with
company-scoped policies). It is far cheaper to add now than later, but the initial
ERD carries no org column and there is no known second company, so we are not
modeling tenancy speculatively. Revisit this ADR before onboarding a second
company — retrofitting tenancy after there is data is the expensive path this
decision is consciously deferring.
