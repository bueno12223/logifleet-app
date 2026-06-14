import type { Database } from "@/lib/supabase/database.types"

type EquipmentStatus = Database["public"]["Enums"]["equipment_status"]

// Value labels: equipment_status enum member -> Spanish UI text. "Equipo" is
// masculine, so the adjectives agree (Retirado, not Retirada). See CONTEXT.md.
export const equipmentStatusLabels: Record<EquipmentStatus, string> = {
  in_use: "En uso",
  available: "Disponible",
  in_transit: "En tránsito",
  maintenance: "En mantenimiento",
  retired: "Retirado",
}
