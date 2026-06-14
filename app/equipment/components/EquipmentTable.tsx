"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react"

import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui"
import { formatDate, isPast } from "@/core/dates"
import { cn } from "@/lib/utils"

import {
  EQUIPMENT_FIELD_LABELS,
  EQUIPMENT_STATUS_TONE,
  UNASSIGNED_OPERATOR,
  equipmentDetailPath,
  equipmentStatusLabels,
} from "../constants"
import { formatHours } from "../format"
import type { EquipmentListItem } from "../queries"
import { useEquipmentListStore } from "../store"
import type { SortColumn } from "../types"

interface EquipmentTableProps {
  equipment: EquipmentListItem[]
}

const NO_DATE = "—"

function SortableHeader({
  column,
  label,
  className,
}: {
  column: SortColumn
  label: string
  className?: string
}) {
  const sort = useEquipmentListStore((state) => state.sort)
  const toggleSort = useEquipmentListStore((state) => state.toggleSort)
  const active = sort?.column === column

  const Indicator = active
    ? sort.direction === "asc"
      ? ChevronUp
      : ChevronDown
    : ChevronsUpDown

  return (
    <TableHead className={className}>
      <button
        className={cn(
          "inline-flex items-center gap-1 font-mono text-label-sm uppercase outline-none hover:text-brand-navy focus-visible:text-brand-navy",
          active ? "text-brand-navy" : "text-on-surface-variant",
        )}
        type="button"
        onClick={() => toggleSort(column)}
      >
        {label}
        <Indicator
          aria-hidden
          className={cn("size-3.5", active ? "opacity-100" : "opacity-40")}
        />
      </button>
    </TableHead>
  )
}

/**
 * Dense data table for the inventory list view (DESIGN.md "Lists"). The whole row
 * navigates to the equipment detail; the name is also a real link for keyboard and
 * assistive-tech users. Name / hours / next-maintenance headers sort server-side;
 * overdue maintenance dates are flagged in red.
 */
export function EquipmentTable({ equipment }: EquipmentTableProps) {
  const router = useRouter()

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <SortableHeader column="name" label={EQUIPMENT_FIELD_LABELS.name} />
          <TableHead>{EQUIPMENT_FIELD_LABELS.type}</TableHead>
          <TableHead>{EQUIPMENT_FIELD_LABELS.status}</TableHead>
          <TableHead>{EQUIPMENT_FIELD_LABELS.operator}</TableHead>
          <TableHead>{EQUIPMENT_FIELD_LABELS.serialNumber}</TableHead>
          <SortableHeader
            className="text-right"
            column="total_hours"
            label={EQUIPMENT_FIELD_LABELS.totalHours}
          />
          <SortableHeader
            column="next_maintenance_date"
            label={EQUIPMENT_FIELD_LABELS.nextMaintenance}
          />
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
            <TableCell className="font-mono">
              {item.next_maintenance_date ? (
                <span
                  className={cn(
                    isPast(item.next_maintenance_date)
                      ? "font-semibold text-status-error"
                      : "text-on-surface-variant",
                  )}
                >
                  {formatDate(item.next_maintenance_date)}
                </span>
              ) : (
                <span className="text-on-surface-variant">{NO_DATE}</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
