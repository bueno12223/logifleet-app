import Link from "next/link"
import { Container } from "lucide-react"

import { Badge, Card } from "@/core/components/ui"

import {
  EQUIPMENT_FIELD_LABELS,
  EQUIPMENT_STATUS_TONE,
  equipmentDetailPath,
  equipmentStatusLabels,
} from "../constants"
import { formatHours } from "../format"
import type { EquipmentListItem } from "../queries"

interface EquipmentCardProps {
  equipment: EquipmentListItem
}

/**
 * A single equipment as an image card for the grid view. The whole card links to
 * the equipment detail. Falls back to a generic equipment glyph when the unit has
 * no photo. Subtitle is `type • serial` per the inventory design.
 */
export function EquipmentCard({ equipment }: EquipmentCardProps) {
  const typeName = equipment.equipment_type?.name ?? EQUIPMENT_FIELD_LABELS.type

  return (
    <Link className="group block" href={equipmentDetailPath(equipment.id)}>
      <Card className="h-full overflow-hidden transition-shadow group-hover:shadow-md">
        <div className="relative flex h-44 items-center justify-center bg-surface-container">
          {equipment.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- dynamic external/storage photo, not a build-time asset
            <img
              alt={equipment.name}
              className="size-full object-cover"
              src={equipment.image_url}
            />
          ) : (
            <Container aria-hidden className="size-12 text-on-surface-variant/40" />
          )}
          <Badge
            className="absolute right-3 top-3 shadow-sm"
            variant={EQUIPMENT_STATUS_TONE[equipment.status]}
          >
            {equipmentStatusLabels[equipment.status]}
          </Badge>
        </div>

        <div className="flex flex-col gap-3 p-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-body-lg font-bold leading-tight text-brand-navy">
              {equipment.name}
            </h3>
            <p className="truncate font-mono text-label-sm uppercase text-on-surface-variant">
              {typeName} • {equipment.serial_number}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-card-border pt-3 text-body-sm">
            <span className="text-on-surface-variant">
              {EQUIPMENT_FIELD_LABELS.totalHours}
            </span>
            <span className="font-mono font-semibold text-brand-navy">
              {formatHours(equipment.total_hours)} hrs
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
