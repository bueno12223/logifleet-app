@AGENTS.md

# Design system

The visual language — colors, typography, spacing, elevation, and component
styling — is defined in DESIGN.md. Read it before building or restyling UI.

@DESIGN.md

# Forms

Client-side forms use the `useForm` (Formik + yup) abstraction. For validation
timing and field wiring rules, see docs/forms.md.

## Agent skills

### Issue tracker

Issues and PRDs live as local markdown files under `.scratch/<feature-slug>/`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five canonical triage roles, each using its default string. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
