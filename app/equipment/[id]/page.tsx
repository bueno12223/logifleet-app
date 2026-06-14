import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { AppShell } from "@/core/components/layout"
import { buttonVariants } from "@/core/components/ui"

import { EQUIPMENT_LIST_PATH } from "../constants"

// ! Placeholder: the equipment detail view is a separate issue. This stub gives
// each card/row a real destination so the list navigation works end-to-end.
export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <AppShell title="Detalle de Equipo">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-4 rounded-lg border border-card-border bg-surface-container-lowest p-8">
        <h2 className="text-headline-md text-brand-navy">Próximamente</h2>
        <p className="text-body-md text-on-surface-variant">
          El detalle del equipo estará disponible pronto.
        </p>
        <p className="font-mono text-label-sm uppercase text-on-surface-variant">
          ID: {id}
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
