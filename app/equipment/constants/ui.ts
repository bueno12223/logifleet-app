import type { BadgeProps } from "@/core/components/ui"
import type { Database } from "@/lib/supabase/database.types"

import type { ViewMode } from "../types"

type EquipmentStatus = Database["public"]["Enums"]["equipment_status"]
type BadgeVariant = NonNullable<BadgeProps["variant"]>

// Status -> Badge tone. Maps a value to a visual token, so it lives in ui.ts
// (not labels.ts). Five enum values across the five available Badge tones.
export const EQUIPMENT_STATUS_TONE: Record<EquipmentStatus, BadgeVariant> = {
  available: "success",
  in_use: "navy",
  in_transit: "warning",
  maintenance: "error",
  retired: "neutral",
}

export const EQUIPMENT_LIST_PATH = "/equipment"
export const EQUIPMENT_NEW_PATH = "/equipment/new"

// Landing view when there's no prior state (issue 03 store seed).
export const DEFAULT_VIEW: ViewMode = "grid"

export const equipmentDetailPath = (id: string) => `/equipment/${id}`

// Server-side pagination (issue 05).
export const LIST_PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const
export const DEFAULT_PAGE_SIZE = 20
