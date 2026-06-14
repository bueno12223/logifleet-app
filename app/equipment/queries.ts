"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import type { QueryData } from "@supabase/supabase-js"

import { normalizeError } from "@/core/errors"
import { createClient } from "@/lib/supabase/client"
import { runSupabase } from "@/lib/supabase/runSupabase"

import { useEquipmentListStore } from "./store"

const supabase = createClient()

// Equipment plus its type (name + icon) and current operator (name). Aliased so
// consumers read `equipment_type` / `current_operator` instead of table names.
const EQUIPMENT_LIST_SELECT =
  "*, equipment_type:equipment_types(name, icon), current_operator:operators(full_name)"

// Used only to derive the row type via QueryData; never executed.
const _equipmentListBuilder = supabase
  .from("equipment")
  .select(EQUIPMENT_LIST_SELECT)

/** A row of the equipment list: the equipment plus its joined type and operator. */
export type EquipmentListItem = QueryData<typeof _equipmentListBuilder>[number]

// Default order when the user hasn't chosen a sort: "attention first" — soonest /
// overdue next maintenance at the top, units with no scheduled maintenance last.
const ATTENTION_SORT_COLUMN = "next_maintenance_date"

/** A page of equipment plus the total number of matches across all pages. */
export interface EquipmentListPage {
  items: EquipmentListItem[]
  total: number
}

// PostgREST `or()` is comma-separated and paren-delimited; strip those chars from
// the user term so a stray comma can't break the filter expression.
function buildSearchFilter(search: string): string | null {
  const safe = search.replace(/[%,()]/g, " ").trim()
  if (!safe) return null
  return `name.ilike.%${safe}%,serial_number.ilike.%${safe}%,model.ilike.%${safe}%`
}

/**
 * A page of the equipment inventory: filtered (search/status/type), sorted, and
 * paginated server-side from the current store state. Returns the page rows plus
 * the total match count for pagination. Defaults to "attention first" order until
 * the user picks a sort column.
 */
export function useEquipmentList() {
  const search = useEquipmentListStore((state) => state.search)
  const statuses = useEquipmentListStore((state) => state.statuses)
  const typeIds = useEquipmentListStore((state) => state.typeIds)
  const sort = useEquipmentListStore((state) => state.sort)
  const page = useEquipmentListStore((state) => state.page)
  const pageSize = useEquipmentListStore((state) => state.pageSize)

  return useQuery({
    queryKey: ["equipment", "list", { search, statuses, typeIds, sort, page, pageSize }],
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }): Promise<EquipmentListPage> => {
      let query = supabase
        .from("equipment")
        .select(EQUIPMENT_LIST_SELECT, { count: "exact" })

      const searchFilter = buildSearchFilter(search)
      if (searchFilter) query = query.or(searchFilter)
      if (statuses.length > 0) query = query.in("status", statuses)
      if (typeIds.length > 0) query = query.in("equipment_type_id", typeIds)

      const ordered = sort
        ? query.order(sort.column, { ascending: sort.direction === "asc" })
        : query.order(ATTENTION_SORT_COLUMN, { ascending: true, nullsFirst: false })

      const rangeStart = (page - 1) * pageSize
      const rangeEnd = rangeStart + pageSize - 1

      const { data, count, error } = await ordered
        .range(rangeStart, rangeEnd)
        .abortSignal(signal)
      if (error) throw normalizeError(error)

      return { items: (data ?? []) as EquipmentListItem[], total: count ?? 0 }
    },
  })
}

/** Equipment types for the type filter, ordered by name. */
export function useEquipmentTypes() {
  return useQuery({
    queryKey: ["equipment-types"],
    queryFn: ({ signal }) =>
      runSupabase(
        supabase
          .from("equipment_types")
          .select("id, name")
          .order("name", { ascending: true })
          .abortSignal(signal),
      ),
  })
}
