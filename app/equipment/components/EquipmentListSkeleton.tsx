import { Card, Skeleton } from "@/core/components/ui"

import type { ViewMode } from "../types"

// Placeholder count for first paint — purely local to this render.
const SKELETON_ITEM_COUNT = 8
const TABLE_COLUMN_COUNT = 7

const placeholders = Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => index)
const columns = Array.from({ length: TABLE_COLUMN_COUNT }, (_, index) => index)

/** Loading placeholders that mirror the active view to avoid layout shift. */
export function EquipmentListSkeleton({ view }: { view: ViewMode }) {
  if (view === "grid") {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {placeholders.map((index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-44 w-full rounded-none" />
            <div className="flex flex-col gap-3 p-4">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="mt-3 h-4 w-full" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-card-border bg-surface-container-lowest">
      {placeholders.map((index) => (
        <div
          key={index}
          className="flex items-center gap-6 border-b border-card-border px-4 py-3.5 last:border-b-0"
        >
          {columns.map((column) => (
            <Skeleton key={column} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}
