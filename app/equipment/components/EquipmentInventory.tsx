"use client"

import { Pagination } from "@/core/components/ui"

import { LIST_PAGE_SIZE_OPTIONS } from "../constants"
import { useEquipmentList } from "../queries"
import { useEquipmentListStore } from "../store"
import { EquipmentCardGrid } from "./EquipmentCardGrid"
import { EquipmentFilters } from "./EquipmentFilters"
import { EquipmentTable } from "./EquipmentTable"

/**
 * Client orchestrator for the equipment inventory. Renders the filter bar, the
 * active view (card grid or data table) over the current page, and the pagination
 * controls. Richer loading/empty states arrive in issue 06.
 */
export function EquipmentInventory() {
  const view = useEquipmentListStore((state) => state.view)
  const page = useEquipmentListStore((state) => state.page)
  const pageSize = useEquipmentListStore((state) => state.pageSize)
  const setPage = useEquipmentListStore((state) => state.setPage)
  const setPageSize = useEquipmentListStore((state) => state.setPageSize)

  const { data, isPending } = useEquipmentList()
  const items = data?.items ?? []
  const total = data?.total

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <EquipmentFilters count={total} />

      {isPending ? (
        <p className="text-body-sm text-on-surface-variant">Cargando equipos…</p>
      ) : items.length > 0 ? (
        view === "grid" ? (
          <EquipmentCardGrid equipment={items} />
        ) : (
          <EquipmentTable equipment={items} />
        )
      ) : (
        <p className="text-body-sm text-on-surface-variant">
          No hay equipos para mostrar.
        </p>
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
