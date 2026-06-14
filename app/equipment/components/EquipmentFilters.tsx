"use client"

import { useEffect, useState } from "react"
import { LayoutGrid, List, Search } from "lucide-react"

import { SEARCH_DEBOUNCE_MS } from "@/core/constants"
import {
  Input,
  MultiSelect,
  ToggleGroup,
  ToggleGroupItem,
} from "@/core/components/ui"
import { Constants } from "@/lib/supabase/database.types"

import { equipmentStatusLabels } from "../constants"
import { useEquipmentTypes } from "../queries"
import { useEquipmentListStore } from "../store"
import type { ViewMode } from "../types"

// Option list derived from the status enum — file scope, not inside the component.
const STATUS_OPTIONS = Constants.public.Enums.equipment_status.map((status) => ({
  value: status,
  label: equipmentStatusLabels[status],
}))

interface EquipmentFiltersProps {
  /** Number of matches to show in the result count; omitted while loading. */
  count?: number
}

/**
 * Inline filter bar for the inventory: debounced search (name/serial/model), a
 * status multi-select, a type multi-select, the result count, and the view toggle.
 * All filter state lives in the Zustand store, which drives the list query.
 */
export function EquipmentFilters({ count }: EquipmentFiltersProps) {
  const storeSearch = useEquipmentListStore((state) => state.search)
  const setSearch = useEquipmentListStore((state) => state.setSearch)
  const statuses = useEquipmentListStore((state) => state.statuses)
  const setStatuses = useEquipmentListStore((state) => state.setStatuses)
  const typeIds = useEquipmentListStore((state) => state.typeIds)
  const setTypeIds = useEquipmentListStore((state) => state.setTypeIds)
  const view = useEquipmentListStore((state) => state.view)
  const setView = useEquipmentListStore((state) => state.setView)

  const { data: equipmentTypes } = useEquipmentTypes()
  const typeOptions = (equipmentTypes ?? []).map((type) => ({
    value: type.id,
    label: type.name,
  }))

  const [term, setTerm] = useState(storeSearch)
  useEffect(() => {
    const timer = setTimeout(() => setSearch(term), SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [term, setSearch])

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search
          aria-hidden
          className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-on-surface-variant/50"
        />
        <Input
          aria-label="Buscar equipo"
          className="w-64 pl-9"
          placeholder="Buscar por nombre, serie o modelo..."
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
        />
      </div>

      <MultiSelect
        label="Estado"
        options={STATUS_OPTIONS}
        value={statuses}
        onValueChange={(value) => setStatuses(value as typeof statuses)}
      />
      <MultiSelect
        label="Tipo"
        options={typeOptions}
        value={typeIds}
        onValueChange={setTypeIds}
      />

      <div className="ml-auto flex items-center gap-3">
        {count != null ? (
          <p className="text-body-sm text-on-surface-variant">
            Mostrando{" "}
            <span className="font-semibold text-brand-navy">{count}</span> equipos
          </p>
        ) : null}

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
      </div>
    </div>
  )
}
