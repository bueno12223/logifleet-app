import type { ReactNode } from "react"
import { Bell, HelpCircle, Search } from "lucide-react"

import { Button, Input } from "@/core/components/ui"

export interface TopBarProps {
  title: string
  /** Optional view label/tab shown beside the title (e.g. "Mes"). */
  subtitle?: ReactNode
  actions?: ReactNode
}

/**
 * Fixed application top bar. The page supplies its `title`, an optional
 * `subtitle` (a view tab beside the title), and an optional `actions` slot
 * (e.g. a primary CTA); the shell owns the global controls (search,
 * notifications, help) so they appear identically on every page.
 *
 * Rendered by {@link AppShell}; not intended for standalone use.
 */
export function TopBar({ title, subtitle, actions }: TopBarProps) {
  return (
    <header className="fixed inset-x-0 left-20 top-0 z-40 flex h-16 items-center justify-between border-b border-card-border bg-surface-container-lowest px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-6">
        <h1 className="text-headline-md text-brand-navy">{title}</h1>
        {subtitle}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="relative hidden lg:block">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant/50"
          />
          <Input
            aria-label="Buscar máquina o cliente"
            className="w-64 pl-9 font-mono text-body-sm"
            placeholder="Buscar máquina o cliente..."
            type="search"
          />
        </div>

        <Button aria-label="Notificaciones" size="icon" variant="ghost">
          <Bell aria-hidden className="size-5" />
        </Button>
        <Button aria-label="Ayuda" size="icon" variant="ghost">
          <HelpCircle aria-hidden className="size-5" />
        </Button>

        {actions}
      </div>
    </header>
  )
}
