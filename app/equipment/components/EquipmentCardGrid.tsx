import { EquipmentCard } from "./EquipmentCard"
import type { EquipmentListItem } from "../queries"

interface EquipmentCardGridProps {
  equipment: EquipmentListItem[]
}

/** Responsive grid of equipment cards (1 → 4 columns) for the inventory grid view. */
export function EquipmentCardGrid({ equipment }: EquipmentCardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {equipment.map((item) => (
        <EquipmentCard key={item.id} equipment={item} />
      ))}
    </div>
  )
}
