import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { AppShell } from "@/core/components/layout"
import { buttonVariants } from "@/core/components/ui"

import { EQUIPMENT_LIST_PATH } from "../constants"

// ! Placeholder: the create flow is a separate issue. This stub gives the
// "Nuevo Equipo" button a real destination until then.
export default function NewEquipmentPage() {
  return (
    <AppShell title="Nuevo Equipo">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 rounded-lg border border-card-border bg-surface-container-lowest p-8">
        <h2 className="text-headline-md text-brand-navy">Próximamente</h2>
        <p className="text-body-md text-on-surface-variant">
          El alta de equipos estará disponible pronto.
        </p>
        <Link
          className={buttonVariants({ variant: "tertiary" })}
          href={EQUIPMENT_LIST_PATH}
        >
          <ArrowLeft aria-hidden className="size-4" />
          Volver al inventario
        </Link>
      </div>
    </AppShell>
  )
}
