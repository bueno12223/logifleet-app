# Component Structure

> **Project paths.** This repo uses the `@/*` import alias, which maps to the repo
> root (see `tsconfig.json`). Pages live directly under `app/<page>/` and there
> are no nested route groups. Every import below uses the `@/` alias.

## Philosophy

Components are organized as a tree. A page imports components, which may import sub-components. The importer does not care if the import is a folder or a file - it only cares about the public interface.

## Folder Structure

```
app/<page>/
├── page.tsx                 # Page orchestrates the flow
├── components/
│   ├── Form/
│   │   ├── index.tsx        # Public API
│   │   ├── validations.ts   # Step-specific logic
│   │   └── components/     # Sub-components used only here
│   ├── OtherComponent/
```

## Rules

**1. Import interface, not implementation**

```tsx
// Good: Importing from index (public API)
import { FormStep } from "./components/FormStep"

// Bad: Reaching into internals
import { StatusIcon } from "./components/FormStep/components/StatusIcon"
```

**2. Co-locate related files**

- `validations.ts` - Yup schemas, transform functions
- `components/` - Sub-components used only by this component
- `constants.ts` - Component-specific constants

**3. The underscore convention**

- `utils.ts` - Private utilities (do not import from outside the folder)

**4. Barrel exports**

Every component folder has an `index.tsx` that exports only what is public:

```tsx
export { FormStep } from "./FormStep"
export type { FormStepProps } from "./types"
```

**5. JSDoc on shared code**

Every reusable component exported from `core/components/ui/` and every custom hook exported from `core/hooks/` must have a JSDoc block explaining what it does and when to use it. Include an `@example` tag. This does not apply to types, constants, or other self-documenting exports.

```tsx
/**
 * Declarative select built on top of {@link SelectRoot}.
 *
 * Renders a complete select from a flat `options` array.
 * Spread `getFieldProps()` directly for form integration.
 *
 * @example
 * <OptionSelect options={categoryOptions} {...getFieldProps("category")} />
 */
export function OptionSelect(...) { ... }
```

## Page Structure

A page can co-locate its own types, reducer, and constants alongside `page.tsx`:

```
app/<page>/
├── page.tsx             # Page component (orchestration)
├── types.ts             # Page-specific types
├── reducer.ts           # State machine / useReducer for the page
├── components/
│   ├── StepA/
│   │   ├── index.tsx
│   │   ├── validations.ts
│   │   └── components/
│   ├── StepB/
│   └── StepIndicator.tsx
```

**Rules:**

- `types.ts` holds types unique to the page (e.g. `WizardStep`, `InputMode`).
- `reducer.ts` centralizes page-level state transitions when there are 3+ related `useState` calls.
- Constants shared across steps live alongside the page (see [`constants.md`](./constants.md)).

## One Component per File

Each `.tsx` file exports exactly one React component. Co-located helpers (types, constants, validations) go in separate files within the same folder.

**Wrong:**

```tsx
// EquipmentActions.tsx
export function DeleteButton() { ... }
export function EditButton() { ... }
export function EquipmentActions() { ... }
```

**Right:**

```
EquipmentActions/
├── index.tsx            # exports EquipmentActions
├── components/
│   ├── DeleteButton.tsx
│   └── EditButton.tsx
```

Small, purely presentational sub-components that exist only to reduce JSX nesting within the same component (e.g., a `Row` or `Cell` used only in one table) may be defined in the same file as an un-exported function. The file still has a single public export.

## Component Boundaries

- A component owns its UI, state, and validations
- A page owns orchestration (which step is active)
- Shared logic goes to `core/`

## Constants Organization

Const declaration on top of the file are NOT allowed. They must be grouped by category and declared in a separate file.

Constant placement, scoping, and file layout are owned by [`constants.md`](./constants.md). Co-locate page-specific constants alongside the page and follow that guide.
