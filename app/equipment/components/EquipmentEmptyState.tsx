"use client"

import Link from "next/link"
import { PackageOpen, SearchX } from "lucide-react"

import { Button, buttonVariants } from "@/core/components/ui"

import { EQUIPMENT_NEW_PATH } from "../constants"
import { useEquipmentListStore } from "../store"

/**
 * Empty state for the inventory, distinguishing "nothing matches the filters" (with
 * a clear-filters action) from "the fleet has no equipment yet" (with a create CTA).
 */
export function EquipmentEmptyState() {
  const search = useEquipmentListStore((state) => state.search)
  const statuses = useEquipmentListStore((state) => state.statuses)
  const typeIds = useEquipmentListStore((state) => state.typeIds)
  const clearFilters = useEquipmentListStore((state) => state.clearFilters)

  const hasActiveFilters =
    search.trim().length > 0 || statuses.length > 0 || typeIds.length > 0

  const Icon = hasActiveFilters ? SearchX : PackageOpen

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-card-border bg-surface-container-lowest px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-navy/5 text-brand-navy">
        <Icon aria-hidden className="size-6" />
      </span>

      {hasActiveFilters ? (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="text-headline-md text-brand-navy">Sin resultados</h2>
            <p className="text-body-md text-on-surface-variant">
              Ningún equipo coincide con los filtros aplicados.
            </p>
          </div>
          <Button variant="tertiary" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-1">
            <h2 className="text-headline-md text-brand-navy">
              No tienes equipos aún
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Crea tu primer equipo para empezar a gestionar tu inventario.
            </p>
          </div>
          <Link
            className={buttonVariants({ variant: "primary" })}
            href={EQUIPMENT_NEW_PATH}
          >
            Nuevo Equipo
          </Link>
        </>
      )}
    </div>
  )
}
