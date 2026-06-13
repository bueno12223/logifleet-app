<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Coding conventions

## Self-documenting code

Code that needs a comment to explain itself is a sign the code needs to be rewritten.
Use named variables and constants instead.

**Wrong:**

```ts
// 2 calls: one initial and one retry
numberOfCalls(2)
```

**Right:**

```ts
const initialCalls = 1
const retryCalls = 1
const totalCalls = initialCalls + retryCalls
numberOfCalls(totalCalls)
```

## Comments

- Never add inline comments explaining what the next line does — rename the variable or function instead.
  **Wrong:**

```ts
// 2 calls, one for the inital and the second for the retry
numberOfCalls(2)
```

**Right:**

```ts
const initialCalls = 1
const retryCalls = 1
const totalCalls = initialCalls + retryCalls
numberOfCalls(totalCalls)
```

- Use `// !` only as a temporary reviewer note to flag something for human review (mock URLs, skipped logic, known gaps). These are never final code.

## UI errors

Never expose raw error messages from HTTP responses or exceptions directly in UI copy.
Always write user-facing error messages explicitly in the component.

## Data fetching

Server state is owned by TanStack Query (`@/core/query`), backed by Supabase and surfaced through sonner toasts. Reads use `useQuery` + `runSupabase`; writes use `useMutation`. Errors normalize to `AppError` and render via `getUserMessage` (never raw `error.message`). Read @docs/data-fetching.md for full rules.

## Emojis

Never use emojis anywhere — not in code, comments, commit messages, or documentation.

## UI components

Use the project's UI kit from `@/core/components/ui` for all interactive elements and UI patterns — a custom set of `cva`-based components built on Radix primitives and styled per `DESIGN.md`.

Direct HTML elements for UI primitives are **prohibited in consumers** (pages and feature components). Always reach for the UI library component first (`Input`, `Button`, `Select`, `Badge`, etc.). Raw HTML is allowed only as a documented exception when no component exists for the use case — and when you do, prefer adding the missing component to the UI kit over inlining HTML.

**Exception (the UI kit itself):** `@/core/components/ui` is the boundary that wraps and styles Radix primitives (`Select` → `@radix-ui/react-select`, etc.). Build kit components on Radix, not on raw HTML interactive elements. The one allowance is primitives Radix does not provide — plain text fields (`Input` → `<input>`, `Textarea` → `<textarea>`) stay native. The prohibition applies to code that consumes the kit, not to the kit's own implementation.

**Exception (layout):** structural elements (`div`, `span` used purely for grouping) and Tailwind utilities for layout and spacing are fine. The rule targets interactive and styled UI primitives, not layout scaffolding.

**Wrong:**

```tsx
<input type="number" className="border rounded px-2" />
<span className="rounded-full border px-2 text-xs uppercase">Active</span>
```

**Right:**

```tsx
<Input type="number" />
<Badge variant="success">Active</Badge>
```

## Constants

No local constants inside component files. Extract them to the appropriate constants location. Read @docs/constants.md for full rules.

## Dates

Never import `temporal-polyfill` directly. Use helpers from `@/core/dates` instead (inversion of dependencies). The polyfill is only consumed inside `core/dates/` -- the rest of the app uses the helpers. Read `core/dates/index.ts` for available functions and formats. (This wrapper is not scaffolded yet -- create it together with the first date-handling code.)

## Switch statements

Prefer map objects over `switch` in JavaScript/TypeScript.

**Wrong:**

```ts
switch (method) {
  case "GET":
    return client.get(path)
  case "POST":
    return client.post(path, body)
}
```

**Right:**

```ts
const dispatch = {
  GET: () => client.get(path),
  POST: () => client.post(path, body),
}
dispatch[method]()
```
