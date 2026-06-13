# Constants

> **Project paths.** This repo uses the `@/*` import alias, which maps to the repo
> root (see `tsconfig.json`). App-wide constants live in `core/constants/`; page-scoped
> constants live alongside their pages under `app/<page>/constants/`.
> Every import below uses the `@/` alias.

## Philosophy

Constants are named values that replace magic numbers, strings, and inline configuration. They make code self-documenting and reduce duplication. A well-placed constant eliminates the need for a comment.

## Rules

**1. No local constants in components**

Never define constants inside a component file. Extract them to the appropriate constants location.

**Wrong:**

```tsx
// EquipmentList.tsx
const PAGE_SIZE = 20
const STATUS_OPTIONS = ["active", "inactive"]

export function EquipmentList() {
  // ...
}
```

**Right:**

```tsx
// app/equipment/constants/pages/equipment-list.ts
export const PAGE_SIZE = 20
export const STATUS_OPTIONS = ["active", "inactive"] as const

// EquipmentList.tsx
import {
  PAGE_SIZE,
  STATUS_OPTIONS,
} from "@/app/equipment/constants/pages/equipment-list"
```

**2. Choose the right scope**

| Scope       | Location                  | Example                                   |
| ----------- | ------------------------- | ----------------------------------------- |
| App-wide    | `core/constants/`         | `TOAST_DURATION_MS`, `SEARCH_DEBOUNCE_MS` |
| Single page | `app/<page>/constants.ts` | `STEP_LABELS`, `INPUT_MODE_OPTIONS`       |

**3. Naming conventions**

Use `SCREAMING_SNAKE_CASE` for all constants. The name should be descriptive enough to understand without context.

```ts
// Good: clear, descriptive, self-documenting
export const MAX_ITEMS_PER_BATCH = 1000
export const FULL_RELATIVE_DATE = "DD MMM YYYY"
export const TOAST_DURATION_MS = 4_000
export const LIST_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const

// Bad: ambiguous, too short, or needs a comment to explain
export const MAX = 1000
export const FORMAT = "DD MMM YYYY"
export const DURATION = 4000
```

**4. Use `as const` for literal arrays and objects**

When the constant is a set of fixed values, use `as const` to get literal types.

```ts
export const STATUS_OPTIONS = ["active", "inactive", "pending"] as const
// type: readonly ["active", "inactive", "pending"]

export const LIST_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
// type: readonly [10, 20, 50, 100]
```

**5. Group related constants in one file with section comments**

```ts
// =============================================================================
// Constants for app/equipment/import
// =============================================================================

export const INPUT_MODE_OPTIONS: FormMode[] = ["MODE_A", "MODE_B"]

export const MAX_ITEMS_PER_BATCH = 1000

export const STEP_LABELS = ["Input", "Review", "Confirm", "Done"]
```

**6. Barrel exports**

Every `constants/` folder has an `index.ts` that re-exports everything:

```ts
// constants/index.ts
export * from "./ui"
export * from "./api"
export * from "./pages"
```

## Labels, fields, and UI config: three separate buckets

Display constants are not all the same. Splitting them by _what they map_ keeps each
file single-purpose and tells you exactly where a new constant belongs. Across the app,
use three shared files instead of scattering strings across page files.

| Bucket           | File        | Maps                                                     | Example                                     |
| ---------------- | ----------- | -------------------------------------------------------- | ------------------------------------------- |
| **Value labels** | `labels.ts` | a closed-set _value_ (enum member) → human text          | `statusLabels[Status.ACTIVE] = "Active"`    |
| **Field labels** | `fields.ts` | a _model field_ (object key) → human text                | `USER_FIELD_LABELS.email = "Email address"` |
| **UI config**    | `ui.ts`     | non-text UI constants: tones, nav, debounce, shared copy | `STATUS_TONE`, `LIST_PATH`, `DEBOUNCE_MS`   |

### 1. Value labels (`labels.ts`)

One record per enum, keyed by the enum so every member is covered. These translate a
_value_ a record holds into something a human reads. Reused by tables, filters, forms,
and detail views alike.

```ts
// labels.ts
export const orderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: "Pending",
  [OrderStatus.SHIPPED]: "Shipped",
  [OrderStatus.DELIVERED]: "Delivered",
}
```

### 2. Field labels (`fields.ts`) — key the map to the model

A field label answers "what do we call this _column/field_?" — the same answer in a table
header, a filter label, a form field, and a read-only detail row. Define it **once**, keyed
by the model type, so the type system forces a label for every displayable field. Add a
field to the model and forget its label → the build fails.

```ts
// fields.ts
import type { User } from "@/core/types/user"

// Curate which fields ever surface in the UI. Exclude system/internal ones.
export type DisplayableUserField = Exclude<
  keyof User,
  "id" | "createdAt" | "passwordHash"
>

export const USER_FIELD_LABELS: Record<DisplayableUserField, string> = {
  name: "Name",
  email: "Email address",
  role: "Role",
  // drop any line above → compile error: "property '<field>' is missing in type"
}

// Nested objects get their own keyed map at their own level:
export const ADDRESS_FIELD_LABELS: Record<keyof Address, string> = {
  street: "Street",
  city: "City",
  postalCode: "Postal code",
}

// Section/group titles shared by form and detail view:
export const USER_SECTION_LABELS = {
  identity: "Identity",
  contact: "Contact",
  security: "Security",
} as const
```

Then every surface consumes the same source:

```tsx
// Table header
<th>{USER_FIELD_LABELS.email}</th>
// Filter label
<label>{USER_FIELD_LABELS.role}</label>
// Form field
<FormField label={USER_FIELD_LABELS.name}>...</FormField>
// Detail row
<DetailField label={USER_FIELD_LABELS.name} value={user.name} />
```

**Curated vs strict:** use `Record<keyof T, string>` to force a label for _every_ field
(maximum completeness), or `Record<DisplayableField, string>` over a curated
`Exclude<keyof T, ...>` union to force labels only for fields you actually render. Prefer
the curated form when the model has many system/internal fields. Keep the curation to
**top-level keys** — for nested objects, give each sub-type its own keyed map rather than
flattening dotted paths (those can't be enforced by `keyof`).

### 3. UI config (`ui.ts`)

Everything display-related that is **not** label text: status→tone maps (drive a `Badge`
color), navigation paths/labels, debounce/limits, and shared empty-state / not-found copy.
A status tone sits here, not in `labels.ts`, because it maps a value to a _visual_ token,
not to text.

```ts
// ui.ts
import type { BadgeTone } from "@/core/components/ui"

export const SEARCH_DEBOUNCE_MS = 300
export const EQUIPMENT_LIST_PATH = "/equipment"

export const ORDER_STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  [OrderStatus.PENDING]: "warning",
  [OrderStatus.SHIPPED]: "info",
  [OrderStatus.DELIVERED]: "success",
}

export const NOT_FOUND_TITLE = "Not found"
export const EMPTY_LIST_DESCRIPTION = "Nothing here yet."
```

### Why this kills most `pages/<page>.ts` files

A page file should hold only constants that are genuinely single-page. Most "page"
constants are not: a status tone, a field label, or an empty-state string is reused the
moment a second view touches the same data. Promote them to `labels.ts` / `fields.ts` /
`ui.ts` and the page file often disappears entirely. Keep in the component itself the
values that are purely local to one render (e.g. a placeholder count for a mock grid) —
those are not shared and do not belong in the constants tree.

## Not everything is a constant

Extracting _everything_ into the constants tree is itself bad practice. A constant earns
its place only when it does one of two things:

1. **Encodes a mapping** the type system should enforce or that more than one surface
   reuses — an enum→label record, a value→tone map, a model→field-label record.
2. **Is shared, configurable, or non-obvious** — a limit, a debounce, an API path, a base
   URL: a value a second file reads or a reviewer would want to tune in one place.

Anything else stays inline where it is used:

- **One-off UI copy** — an empty-state title, a dialog hint, a button label, a toast
  message. Write it directly in the component/hook. A string used in exactly one place is
  not made clearer by living three files away under a `SCREAMING_SNAKE_CASE` alias.
- **Validation messages** — write them inline in the schema (`.required("…")`,
  `.test("…", "message", …)`). The schema _is_ their single home.
- **Self-evident arithmetic** — `10 * 1024 * 1024` for ten megabytes is clearer inline
  than a `BYTES_PER_KILOBYTE * KILOBYTES_PER_MEGABYTE * …` ladder. Add a local `const` in
  the logic file only if the number is reused.
- **Option lists derived from an enum** — `Object.values(Enum).map(toOption)` lives at the
  top of the form file that renders it (file scope, not inside the component), unless a
  second form needs the same list.

`pages/<page>.ts` is for **genuine edge cases** — the rare value that is both single-page
_and_ worth naming. It is not a dumping ground for every string a page renders. Before
adding a file there, check: does this need a mapping, or is it shared? If neither, it
belongs inline, and the page file should not exist. Reach for the **lowest** scope that
fits — inline first, then the logic file, then a shared `labels.ts`/`ui.ts`, and only
then a page file.

## When NOT to use a constant

- One-off UI copy and validation messages — keep them inline (see above).
- Inline values used exactly once inside a utility function that is itself self-documenting (e.g., `return value > 0`).
- Standard framework values that are well-known (`"GET"`, `"POST"`, `200`).
- Values that change per invocation -- those are parameters, not constants.
