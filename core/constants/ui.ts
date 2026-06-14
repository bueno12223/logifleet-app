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

// Delay before a search input commits its value to a query, so typing doesn't
// fire a request per keystroke.
export const SEARCH_DEBOUNCE_MS = 300

// ! Calendario is the home/availability view ("/"); the rest 404 until built.
export const NAV_ITEMS: readonly NavItem[] = [
  { label: "Calendario", href: "/", icon: CalendarDays },
  { label: "Equipos", href: "/equipment", icon: Truck },
  { label: "Mantenimiento", href: "/mantenimiento", icon: Wrench },
  { label: "Clientes", href: "/clientes", icon: Users },
  { label: "Reportes", href: "/reportes", icon: BarChart3 },
  { label: "Configuración", href: "/configuracion", icon: Settings },
] as const
