import { Temporal } from "temporal-polyfill"

// The single consumer of temporal-polyfill (AGENTS.md). The rest of the app uses
// these helpers, never the polyfill directly, so the date implementation can be
// swapped without touching call sites.

const DATE_LOCALE = "es-ES"

// "12 jul 2026" — day, abbreviated month, year.
const FULL_RELATIVE_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
}

/** Parses an ISO date or datetime string into a calendar date (time discarded). */
function parsePlainDate(iso: string): Temporal.PlainDate {
  return Temporal.PlainDate.from(iso.slice(0, 10))
}

/** Today's date in the system calendar. */
export function today(): Temporal.PlainDate {
  return Temporal.Now.plainDateISO()
}

/** Formats an ISO date string as e.g. "12 jul 2026". */
export function formatDate(iso: string): string {
  return parsePlainDate(iso).toLocaleString(DATE_LOCALE, FULL_RELATIVE_DATE_OPTIONS)
}

/** True when the given ISO date is strictly before today (e.g. overdue maintenance). */
export function isPast(iso: string): boolean {
  return Temporal.PlainDate.compare(parsePlainDate(iso), today()) < 0
}
