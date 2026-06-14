// Role-based route protection. Today this is inert scaffolding: ROUTE_ROLES is
// empty, so no route is restricted by Role (the proxy still enforces that a
// caller is authenticated). To lock a route to a Role later, add one entry —
// e.g. "/admin": ["super_admin"] — and the proxy guard picks it up.

export const APP_ROLES = ["super_admin", "manager", "viewer"] as const

export type AppRole = (typeof APP_ROLES)[number]

// Human labels for the closed Role set (see CONTEXT.md). Used wherever a Role is
// shown to a User (the Sidebar footer, future user-management views).
export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super admin",
  manager: "Manager",
  viewer: "Viewer",
}

// Path prefix -> Roles allowed to enter it. Longest matching prefix wins. Empty
// today; a route absent from this map is open to any authenticated User.
export const ROUTE_ROLES: Record<string, readonly AppRole[]> = {
  // "/admin": ["super_admin"],
}

function matchedRoles(pathname: string): readonly AppRole[] | null {
  const prefixes = Object.keys(ROUTE_ROLES)
    .filter((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
    .sort((a, b) => b.length - a.length)

  const longest = prefixes[0]
  return longest ? ROUTE_ROLES[longest] : null
}

function isAppRole(value: unknown): value is AppRole {
  return typeof value === "string" && (APP_ROLES as readonly string[]).includes(value)
}

/**
 * Decides whether a caller holding `role` may enter `pathname`. Fails closed: a
 * guarded route with a missing or unknown Role (e.g. before the access-token
 * hook is enabled) is denied. An unguarded route is always allowed.
 */
export function isRouteAllowed(pathname: string, role: unknown): boolean {
  const allowed = matchedRoles(pathname)
  if (!allowed) return true
  return isAppRole(role) && allowed.includes(role)
}
