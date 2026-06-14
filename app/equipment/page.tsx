import Link from "next/link"
import { Plus } from "lucide-react"

import { AppShell } from "@/core/components/layout"
import { buttonVariants } from "@/core/components/ui"

import { EquipmentInventory } from "./components/EquipmentInventory"
import { EQUIPMENT_NEW_PATH } from "./constants"

export default function EquipmentPage() {
  return (
    <AppShell
      actions={
        <Link
          className={buttonVariants({ variant: "secondary" })}
          href={EQUIPMENT_NEW_PATH}
        >
          <Plus aria-hidden className="size-4" />
          Nuevo Equipo
        </Link>
      }
      title="Inventario de Equipos"
    >
      <EquipmentInventory />
    </AppShell>
  )
}
