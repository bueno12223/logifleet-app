import { create } from "zustand"

import { DEFAULT_VIEW } from "./constants"
import type { ViewMode } from "./types"

// Client-side UI state for the equipment list. A module-level Zustand store, so it
// survives navigation within the session — opening an equipment detail and going
// back restores the list as the user left it (see docs/adr/0003). Filters, sort,
// and pagination join this store in later slices.
interface EquipmentListState {
  view: ViewMode
  setView: (view: ViewMode) => void
}

export const useEquipmentListStore = create<EquipmentListState>((set) => ({
  view: DEFAULT_VIEW,
  setView: (view) => set({ view }),
}))
