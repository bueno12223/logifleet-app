import { create } from "zustand"

import type { Database } from "@/lib/supabase/database.types"

import { DEFAULT_PAGE_SIZE, DEFAULT_VIEW } from "./constants"
import type { SortColumn, SortState, ViewMode } from "./types"

type EquipmentStatus = Database["public"]["Enums"]["equipment_status"]

const FIRST_PAGE = 1

// Client-side UI state for the equipment list. A module-level Zustand store, so it
// survives navigation within the session — opening an equipment detail and going
// back restores the list as the user left it (see docs/adr/0003). Anything that
// changes which rows match (filters, sort, page size) resets to the first page.
interface EquipmentListState {
  view: ViewMode
  setView: (view: ViewMode) => void

  search: string
  setSearch: (search: string) => void

  statuses: EquipmentStatus[]
  setStatuses: (statuses: EquipmentStatus[]) => void

  typeIds: string[]
  setTypeIds: (typeIds: string[]) => void

  /** null means the default "attention first" order (soonest/overdue maintenance). */
  sort: SortState | null
  /** Toggles asc/desc on the same column, or starts a new column ascending. */
  toggleSort: (column: SortColumn) => void

  page: number
  setPage: (page: number) => void

  pageSize: number
  setPageSize: (pageSize: number) => void

  /** Resets every filter (search + status + type); keeps the view mode. */
  clearFilters: () => void
}

export const useEquipmentListStore = create<EquipmentListState>((set) => ({
  view: DEFAULT_VIEW,
  setView: (view) => set({ view }),

  search: "",
  setSearch: (search) => set({ search, page: FIRST_PAGE }),

  statuses: [],
  setStatuses: (statuses) => set({ statuses, page: FIRST_PAGE }),

  typeIds: [],
  setTypeIds: (typeIds) => set({ typeIds, page: FIRST_PAGE }),

  sort: null,
  toggleSort: (column) =>
    set((state) => ({
      page: FIRST_PAGE,
      sort:
        state.sort?.column === column
          ? {
              column,
              direction: state.sort.direction === "asc" ? "desc" : "asc",
            }
          : { column, direction: "asc" },
    })),

  page: FIRST_PAGE,
  setPage: (page) => set({ page }),

  pageSize: DEFAULT_PAGE_SIZE,
  setPageSize: (pageSize) => set({ pageSize, page: FIRST_PAGE }),

  clearFilters: () =>
    set({ search: "", statuses: [], typeIds: [], page: FIRST_PAGE }),
}))
