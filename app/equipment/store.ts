import { create } from "zustand"

import type { Database } from "@/lib/supabase/database.types"

import { DEFAULT_VIEW } from "./constants"
import type { ViewMode } from "./types"

type EquipmentStatus = Database["public"]["Enums"]["equipment_status"]

// Client-side UI state for the equipment list. A module-level Zustand store, so it
// survives navigation within the session — opening an equipment detail and going
// back restores the list as the user left it (see docs/adr/0003). Sorting and
// pagination join this store in issue 05.
interface EquipmentListState {
  view: ViewMode
  setView: (view: ViewMode) => void

  search: string
  setSearch: (search: string) => void

  statuses: EquipmentStatus[]
  setStatuses: (statuses: EquipmentStatus[]) => void

  typeIds: string[]
  setTypeIds: (typeIds: string[]) => void

  /** Resets every filter (search + status + type); keeps the view mode. */
  clearFilters: () => void
}

export const useEquipmentListStore = create<EquipmentListState>((set) => ({
  view: DEFAULT_VIEW,
  setView: (view) => set({ view }),

  search: "",
  setSearch: (search) => set({ search }),

  statuses: [],
  setStatuses: (statuses) => set({ statuses }),

  typeIds: [],
  setTypeIds: (typeIds) => set({ typeIds }),

  clearFilters: () => set({ search: "", statuses: [], typeIds: [] }),
}))
