"use client"

import { useEquipmentList } from "../queries"
import { EquipmentCardGrid } from "./EquipmentCardGrid"

/**
 * Client orchestrator for the equipment inventory. Fetches the equipment list and
 * renders it as the card grid. View switching, filters, pagination, and richer
 * loading/empty states are layered on in later slices.
 */
export function EquipmentInventory() {
  const { data: equipment, isPending } = useEquipmentList()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex items-center justify-end">
        {equipment ? (
          <p className="text-body-sm text-on-surface-variant">
            Mostrando{" "}
            <span className="font-semibold text-brand-navy">
              {equipment.length}
            </span>{" "}
            equipos
          </p>
        ) : null}
      </div>

      {isPending ? (
        <p className="text-body-sm text-on-surface-variant">Cargando equipos…</p>
      ) : equipment && equipment.length > 0 ? (
        <EquipmentCardGrid equipment={equipment} />
      ) : (
        <p className="text-body-sm text-on-surface-variant">
          No hay equipos para mostrar.
        </p>
      )}
    </div>
  )
}
