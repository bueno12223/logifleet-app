# Schema changes via Supabase CLI versioned migrations

We manage the database schema as versioned SQL migrations under
`supabase/migrations/`, applied to the linked remote project
(`qgfpfwuycolckhcuwtsw`) with `supabase db push`, and we keep the typed client in
sync via the existing `pnpm db:types` (`supabase gen types`).

We considered applying raw SQL through the dashboard SQL editor (fastest once, but
unversioned and cloud-only) and applying DDL directly over a connection/MCP (not
available: only the publishable anon key is present locally, no service-role key
or DB password). Versioned migrations make the schema a reviewable git artifact,
are repeatable across environments, and form the other half of the existing
`db:types` loop — the same workflow every deferred table will reuse.
