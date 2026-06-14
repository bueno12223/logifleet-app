"use client"

import { useQuery } from "@tanstack/react-query"
import type { QueryData } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/client"
import { runSupabase } from "@/lib/supabase/runSupabase"

import { DEFAULT_PAGE_SIZE } from "./constants"
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

const FIRST_PAGE_START = 0

// PostgREST `or()` is comma-separated and paren-delimited; strip those chars from
// the user term so a stray comma can't break the filter expression.
function buildSearchFilter(search: string): string | null {
  const safe = search.replace(/[%,()]/g, " ").trim()
  if (!safe) return null
  return `name.ilike.%${safe}%,serial_number.ilike.%${safe}%,model.ilike.%${safe}%`
}

/**
 * The equipment list for the inventory, filtered by the current store state
 * (search across name/serial/model, status, and type) server-side. Pagination and
 * sorting arrive in issue 05; for now it reads the first {@link DEFAULT_PAGE_SIZE}
 * matches ordered by name.
 */
export function useEquipmentList() {
  const search = useEquipmentListStore((state) => state.search)
  const statuses = useEquipmentListStore((state) => state.statuses)
  const typeIds = useEquipmentListStore((state) => state.typeIds)

  return useQuery({
    queryKey: ["equipment", "list", { search, statuses, typeIds }],
    queryFn: ({ signal }) => {
      let query = supabase.from("equipment").select(EQUIPMENT_LIST_SELECT)

      const searchFilter = buildSearchFilter(search)
      if (searchFilter) query = query.or(searchFilter)
      if (statuses.length > 0) query = query.in("status", statuses)
      if (typeIds.length > 0) query = query.in("equipment_type_id", typeIds)

      return runSupabase(
        query
          .order("name", { ascending: true })
          .range(FIRST_PAGE_START, DEFAULT_PAGE_SIZE - 1)
          .abortSignal(signal),
      )
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
