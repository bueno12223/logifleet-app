# Forms

## Philosophy

`useForm` (`core/hooks/useForm.tsx`) is the single abstraction over formik. It
fixes validation timing for the whole app, enhances `getFieldProps`, and
provides a stable `<Form>` component. Components never talk to formik directly,
and validation rules live in yup schemas colocated with the form that owns them.

Most form bugs are *validation-timing* bugs: a field updates but its error does
not, until some unrelated action revalidates. The rules below exist to make that
class of bug impossible.

## No direct formik imports

ESLint (`no-restricted-imports`) blocks `from "formik"` in application code.
Everything a form needs is re-exported from `@/core/hooks`:

`useForm`, `useFormContext`, `FieldArray`, `getIn`, `setIn`.

If you need another formik export, re-export it from `core/hooks/useForm.tsx` —
do not import formik in a component. The abstraction layer is the only place
allowed to depend on formik, so a future form-library swap touches one folder.

```tsx
// Wrong
import { useFormikContext, getIn } from "formik"

// Right
import { getIn, useFormContext } from "@/core/hooks"
```

## Where form logic lives

| Case | Location | Example |
|------|----------|---------|
| One surface owns the form (default) | `validations.ts` next to the component | `app/components/validations.ts` |
| Several surfaces edit the same entity (rare) | `@/forms/<entity>/` | `forms/vehicle/` |

A shared form domain (`forms/vehicle` is the template) owns four things behind
a curated `index.ts`: the empty-values factory, the schema rule groups, the
payload builders, and the form value types. Page-level schemas may only *wrap*
the shared schema (`yup.object({ vehicle: createVehicleSchema })`) — never fork
or extend its rules per flow. Flows that create the same entity must validate
identically; pin it with a parity test.

The example form ([`app/components/vehicle-form-demo.tsx`](../app/components/vehicle-form-demo.tsx)
+ [`validations.ts`](../app/components/validations.ts)) is the single-surface
default: schema, types, and the empty-values factory colocated.

## Validation timing: the contract

`useForm` sets `validateOnChange: false, validateOnBlur: true`. Every input
falls into one of two kinds, and each has exactly one correct wiring:

| Kind | Examples | Validates | Wiring |
|------|----------|-----------|--------|
| Keystroke | `Input`, `Textarea` | on blur | spread `{...getFieldProps(name)}`, or forward `name` + `onBlur`; setters pass `shouldValidate: false` |
| Commit | `OptionSelect`, date/combobox/checkbox, list add/remove | immediately on commit | `onValueChange` from `getFieldProps`, or plain `setFieldValue(path, value)` — both validate by default |

Commit-style controls never blur, so a commit that does not validate leaves the
field's error frozen until something else revalidates the form — the
stuck-error bug.

**1. Spreading `getFieldProps` is the happy path.** It wires `name`, `value`,
`onChange`, `onBlur`, `onValueChange`, `error`, and a `data-testid`. Spread it
**inline** — do not hoist it into a `const`.

```tsx
<FormField required label="Status">
  <OptionSelect options={STATUS_OPTIONS} {...getFieldProps("status")} />
</FormField>
```

**2. Every control renders its own error.** Each input takes an `error: string`
prop, paints itself red, and renders the message below itself (via `FieldError`).
`FormField` only owns the label, the required marker, and an optional action
slot — it does **not** render the error. So a bare `{...getFieldProps(name)}`
already shows validation; you do not pass `error` to `FormField`.

**3. `setFieldValue` and `setValues` validate by default.** `useForm` wraps both
so `shouldValidate` defaults to `true` — unlike stock formik. A commit-style
write needs nothing extra, even when it bypasses `onValueChange` (e.g. the form
stores a number and `getFieldProps` writes strings):

```tsx
onValueChange={(v) => setFieldValue("modelYear", v ? Number(v) : null)}
```

**4. Custom composite inputs must forward `name` and `onBlur`.** A keystroke
setter stays non-validating — but the inner input must receive the field's
`name` and `onBlur` so leaving the field validates.

```tsx
// Wrong: blur never reaches formik — the field can never clear its error
<NumericInput value={amountProps.value} onValueChange={({ floatValue }) => onAmountChange(floatValue ?? null)} />

// Right
<NumericInput
  name={amountProps.name}
  value={amountProps.value}
  onBlur={amountProps.onBlur}
  onValueChange={({ floatValue }) => onAmountChange(floatValue ?? null)}
/>
```

**5. Never validate per keystroke.** A setter that fires on every keypress
(numeric formatters, list row typing) must pass `shouldValidate: false`. Blur
covers those fields (rule 4); per-keystroke validation runs the full schema on
every character.

```tsx
// Wrong: with the validating default, every keypress runs the full schema
onAmountChange={(n) => setFieldValue("inventory.purchasePrice.amount", n)}

// Right
onAmountChange={(n) => setFieldValue("inventory.purchasePrice.amount", n, false)}
```

## Schemas

- yup, with messages written inline in the schema — the schema is their home.
- Build schemas by composing *rule groups* (plain objects of field rules) and
  merging them at definition time.
- **Never extend a schema's nested object with `concat`.** yup's `concat`
  REPLACES nested object fields instead of merging them, silently dropping every
  rule of the original subtree:

```ts
// Wrong: wipes ALL inventory rules (title, pricing, …), keeps only subsidiary
const pageSchema = createVehicleSchema.concat(
  yup.object({ inventory: yup.object({ subsidiary: yup.string().required() }) }),
)

// Right: add the rule to the source rule group in the shared schema
const inventoryCoreCreateRules = {
  subsidiary: yup.string().trim().max(SHORT_TEXT_MAX_LENGTH).required("Subsidiary is required"),
}
```

## Checklist for a new form field

1. Can you spread `{...getFieldProps(name)}` inline? Do that and stop.
2. Commit-style control with manual `setFieldValue`/`setValues`? Nothing extra — they validate by default.
3. Setter that fires per keystroke? Pass `shouldValidate: false` and forward `name` + `onBlur` to the inner input.
4. New rule on a shared entity? Add it to the rule group in `forms/<entity>/schema.ts`, never via `concat` in a page schema.
5. Required field? Mark the `FormField` with `required`.
