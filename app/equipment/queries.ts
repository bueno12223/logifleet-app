"use client"

import { useQuery } from "@tanstack/react-query"
import type { QueryData } from "@supabase/supabase-js"

import { createClient } from "@/lib/supabase/client"
import { runSupabase } from "@/lib/supabase/runSupabase"

import { DEFAULT_PAGE_SIZE } from "./constants"

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

/**
 * First page of equipment for the inventory list. Filters, sorting, and real
 * pagination arrive in later slices; this reads the first {@link DEFAULT_PAGE_SIZE}
 * rows ordered by name.
 */
export function useEquipmentList() {
  return useQuery({
    queryKey: ["equipment", "list"],
    queryFn: ({ signal }) =>
      runSupabase(
        supabase
          .from("equipment")
          .select(EQUIPMENT_LIST_SELECT)
          .order("name", { ascending: true })
          .range(FIRST_PAGE_START, DEFAULT_PAGE_SIZE - 1)
          .abortSignal(signal),
      ),
  })
}
