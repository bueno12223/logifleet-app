/**
 * Convert an arbitrary identifier (camelCase, dotted field paths, snake_case,
 * spaced) into a stable kebab-case token. Used to derive `data-testid`s from
 * form field names, e.g. `inventory.modelYear` -> `inventory-model-year`.
 */
export function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[\s._]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
}
