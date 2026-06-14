"use client"

import { Pagination } from "@/core/components/ui"

import { LIST_PAGE_SIZE_OPTIONS } from "../constants"
import { useEquipmentList } from "../queries"
import { useEquipmentListStore } from "../store"
import { EquipmentCardGrid } from "./EquipmentCardGrid"
import { EquipmentEmptyState } from "./EquipmentEmptyState"
import { EquipmentFilters } from "./EquipmentFilters"
import { EquipmentListSkeleton } from "./EquipmentListSkeleton"
import { EquipmentTable } from "./EquipmentTable"

/**
 * Client orchestrator for the equipment inventory. Renders the filter bar, then the
 * active view (card grid or data table) over the current page, plus pagination.
 * Loading shows view-matching skeletons; an empty result shows a tailored empty
 * state; fetch errors surface via the global toast (QueryClient onError).
 */
export function EquipmentInventory() {
  const view = useEquipmentListStore((state) => state.view)
  const page = useEquipmentListStore((state) => state.page)
  const pageSize = useEquipmentListStore((state) => state.pageSize)
  const setPage = useEquipmentListStore((state) => state.setPage)
  const setPageSize = useEquipmentListStore((state) => state.setPageSize)

  const { data, isPending, isError } = useEquipmentList()
  const items = data?.items ?? []
  const total = data?.total

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <EquipmentFilters count={total} />

      {isPending ? (
        <EquipmentListSkeleton view={view} />
      ) : isError ? (
        <p className="rounded-lg border border-card-border bg-surface-container-lowest px-6 py-16 text-center text-body-md text-on-surface-variant">
          No se pudieron cargar los equipos.
        </p>
      ) : items.length > 0 ? (
        view === "grid" ? (
          <EquipmentCardGrid equipment={items} />
        ) : (
          <EquipmentTable equipment={items} />
        )
      ) : (
        <EquipmentEmptyState />
      )}

      {total != null && total > 0 ? (
        <Pagination
          page={page}
          pageSize={pageSize}
          pageSizeOptions={LIST_PAGE_SIZE_OPTIONS}
          total={total}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      ) : null}
    </div>
  )
}
