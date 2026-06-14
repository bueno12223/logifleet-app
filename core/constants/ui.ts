import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  CalendarDays,
  Settings,
  Truck,
  Users,
  Wrench,
} from "lucide-react"

// =============================================================================
// App shell — primary navigation
// =============================================================================

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

// ! Calendario is the home/availability view ("/"); the rest 404 until built.
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Calendario", href: "/", icon: CalendarDays },
  { label: "Máquinas", href: "/maquinas", icon: Truck },
  { label: "Mantenimiento", href: "/mantenimiento", icon: Wrench },
  { label: "Clientes", href: "/clientes", icon: Users },
  { label: "Reportes", href: "/reportes", icon: BarChart3 },
  { label: "Configuración", href: "/configuracion", icon: Settings },
] as const
