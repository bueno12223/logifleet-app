/** The two ways the inventory can be displayed. */
export type ViewMode = "grid" | "table"

/** Columns the table can be sorted by (server-side). */
export type SortColumn = "name" | "total_hours" | "next_maintenance_date"

export type SortDirection = "asc" | "desc"

export interface SortState {
  column: SortColumn
  direction: SortDirection
}
