"use client"

import { useEquipmentList } from "../queries"
import { useEquipmentListStore } from "../store"
import { EquipmentCardGrid } from "./EquipmentCardGrid"
import { EquipmentFilters } from "./EquipmentFilters"
import { EquipmentTable } from "./EquipmentTable"

/**
 * Client orchestrator for the equipment inventory. Renders the filter bar and then
 * the active view (card grid or data table) over the filtered list. Richer
 * loading/empty states arrive in issue 06.
 */
export function EquipmentInventory() {
  const view = useEquipmentListStore((state) => state.view)
  const { data: equipment, isPending } = useEquipmentList()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <EquipmentFilters count={equipment?.length} />

      {isPending ? (
        <p className="text-body-sm text-on-surface-variant">Cargando equipos…</p>
      ) : equipment && equipment.length > 0 ? (
        view === "grid" ? (
          <EquipmentCardGrid equipment={equipment} />
        ) : (
          <EquipmentTable equipment={equipment} />
        )
      ) : (
        <p className="text-body-sm text-on-surface-variant">
          No hay equipos para mostrar.
        </p>
      )}
    </div>
  )
}
