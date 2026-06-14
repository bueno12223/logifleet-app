"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui"

import {
  EQUIPMENT_FIELD_LABELS,
  EQUIPMENT_STATUS_TONE,
  UNASSIGNED_OPERATOR,
  equipmentDetailPath,
  equipmentStatusLabels,
} from "../constants"
import { formatHours } from "../format"
import type { EquipmentListItem } from "../queries"

interface EquipmentTableProps {
  equipment: EquipmentListItem[]
}

const NO_DATE = "—"

/**
 * Dense data table for the inventory list view (DESIGN.md "Lists"). The whole row
 * navigates to the equipment detail; the name is also a real link for keyboard and
 * assistive-tech users. Date formatting and sortable headers arrive in issue 05.
 */
export function EquipmentTable({ equipment }: EquipmentTableProps) {
  const router = useRouter()

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead>{EQUIPMENT_FIELD_LABELS.name}</TableHead>
          <TableHead>{EQUIPMENT_FIELD_LABELS.type}</TableHead>
          <TableHead>{EQUIPMENT_FIELD_LABELS.status}</TableHead>
          <TableHead>{EQUIPMENT_FIELD_LABELS.operator}</TableHead>
          <TableHead>{EQUIPMENT_FIELD_LABELS.serialNumber}</TableHead>
          <TableHead className="text-right">
            {EQUIPMENT_FIELD_LABELS.totalHours}
          </TableHead>
          <TableHead>{EQUIPMENT_FIELD_LABELS.nextMaintenance}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {equipment.map((item) => (
          <TableRow
            key={item.id}
            className="cursor-pointer"
            onClick={() => router.push(equipmentDetailPath(item.id))}
          >
            <TableCell className="font-semibold text-brand-navy">
              <Link
                href={equipmentDetailPath(item.id)}
                onClick={(event) => event.stopPropagation()}
              >
                {item.name}
              </Link>
            </TableCell>
            <TableCell className="text-on-surface-variant">
              {item.equipment_type?.name ?? NO_DATE}
            </TableCell>
            <TableCell>
              <Badge variant={EQUIPMENT_STATUS_TONE[item.status]}>
                {equipmentStatusLabels[item.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-on-surface-variant">
              {item.current_operator?.full_name ?? UNASSIGNED_OPERATOR}
            </TableCell>
            <TableCell className="font-mono text-on-surface-variant">
              {item.serial_number}
            </TableCell>
            <TableCell className="text-right font-mono font-semibold text-brand-navy">
              {formatHours(item.total_hours)}
            </TableCell>
            <TableCell className="font-mono text-on-surface-variant">
              {item.next_maintenance_date ?? NO_DATE}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
