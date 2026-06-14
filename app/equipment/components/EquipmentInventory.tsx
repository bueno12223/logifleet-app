"use client"

import { LayoutGrid, List } from "lucide-react"

import { ToggleGroup, ToggleGroupItem } from "@/core/components/ui"

import { useEquipmentList } from "../queries"
import { useEquipmentListStore } from "../store"
import type { ViewMode } from "../types"
import { EquipmentCardGrid } from "./EquipmentCardGrid"
import { EquipmentTable } from "./EquipmentTable"

/**
 * Client orchestrator for the equipment inventory. Owns the view toggle (backed by
 * the Zustand store, so it survives the detail round-trip) and renders either the
 * card grid or the data table. Filters, pagination, and richer loading/empty states
 * are layered on in later slices.
 */
export function EquipmentInventory() {
  const view = useEquipmentListStore((state) => state.view)
  const setView = useEquipmentListStore((state) => state.setView)
  const { data: equipment, isPending } = useEquipmentList()

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <ToggleGroup
          aria-label="Vista del inventario"
          type="single"
          value={view}
          onValueChange={(value) => {
            if (value) setView(value as ViewMode)
          }}
        >
          <ToggleGroupItem aria-label="Cuadrícula" value="grid">
            <LayoutGrid aria-hidden className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem aria-label="Lista" value="table">
            <List aria-hidden className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>

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
