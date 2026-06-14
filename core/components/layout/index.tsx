import type { ReactNode } from "react"

import { Sidebar } from "./components/Sidebar"
import { TopBar } from "./components/TopBar"

export interface AppShellProps {
  /** Page title shown in the top bar. */
  title: string
  /** Optional view label/tab shown beside the title (e.g. "Mes"). */
  subtitle?: ReactNode
  /** Optional page-specific controls rendered at the right of the top bar. */
  actions?: ReactNode
  children: ReactNode
}

/**
 * Application chrome: a collapsible left navigation rail plus a fixed top bar,
 * wrapping page content in the main work area. The shell owns navigation and
 * global controls; pages provide a `title`, optional `actions`, and content.
 *
 * @example
 * <AppShell title="Disponibilidad de Flota" actions={<Button variant="secondary">Nueva reserva</Button>}>
 *   <FleetGantt />
 * </AppShell>
 */
export function AppShell({ title, subtitle, actions, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <div className="ml-20 flex min-h-screen flex-col">
        <TopBar actions={actions} subtitle={subtitle} title={title} />
        <main className="mt-16 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
