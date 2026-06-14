"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, User } from "lucide-react"

import { NAV_ITEMS } from "@/core/constants"
import { ROLE_LABELS, useSignOut, useUser } from "@/core/auth"
import { Button } from "@/core/components/ui"
import { cn } from "@/lib/utils"

const RAIL_WIDTH = "w-20"
const EXPANDED_WIDTH = "hover:w-64 focus-within:w-64"
const LABEL_REVEAL =
  "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

/**
 * Left navigation rail for the app shell. Collapsed to an icon rail by default,
 * it expands to reveal labels on hover or keyboard focus. White surface with
 * navy accents per DESIGN.md; the active route carries a 2px navy left border.
 *
 * Rendered by {@link AppShell}; not intended for standalone use.
 */
export function Sidebar() {
  const pathname = usePathname()
  const { user, role } = useUser()
  const signOut = useSignOut()

  const displayName = user?.email ?? "Not signed in"
  const displayRole = role ? ROLE_LABELS[role] : "No role"

  return (
    <nav
      aria-label="Primary"
      className={cn(
        "group fixed left-0 top-0 z-50 flex h-screen flex-col overflow-hidden border-r border-card-border bg-surface-container-lowest py-2 shadow-xl transition-[width] duration-300",
        RAIL_WIDTH,
        EXPANDED_WIDTH,
      )}
    >
      <div className="mb-8 flex h-16 shrink-0 items-center px-5">
        {/* eslint-disable-next-line @next/next/no-img-element -- brand wordmark SVG, no optimization needed */}
        <img
          alt="logiFleet"
          className="h-6 w-auto max-w-none origin-left transition-all duration-300 group-hover:h-9 group-focus-within:h-9"
          src="/logo.svg"
        />
      </div>

      <ul className="flex flex-1 flex-col gap-2 px-3">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <li key={href}>
              <Link
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-12 items-center gap-4 overflow-hidden rounded border-l-4 px-3 transition-colors",
                  active
                    ? "border-brand-navy bg-brand-navy/5 text-brand-navy"
                    : "border-transparent text-on-surface-variant hover:bg-brand-navy/5 hover:text-brand-navy",
                )}
                href={href}
                title={label}
              >
                <Icon aria-hidden className="size-5 shrink-0" />
                <span
                  className={cn(
                    "whitespace-nowrap font-mono text-label-md uppercase transition-opacity duration-300",
                    LABEL_REVEAL,
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto flex flex-col gap-1 px-3 py-4">
        <div className="flex items-center gap-3 px-2">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-card-border bg-brand-navy/5 text-brand-navy">
            <User aria-hidden className="size-5" />
          </span>
          <div
            className={cn(
              "overflow-hidden transition-opacity duration-300",
              LABEL_REVEAL,
            )}
          >
            <p className="truncate font-mono text-label-sm text-brand-navy">
              {displayName}
            </p>
            <p className="whitespace-nowrap font-mono text-label-sm uppercase text-on-surface-variant">
              {displayRole}
            </p>
          </div>
        </div>

        <Button
          aria-label="Sign out"
          className="h-12 justify-start gap-4 px-3 text-on-surface-variant"
          disabled={signOut.isPending}
          title="Sign out"
          variant="ghost"
          onClick={() => signOut.mutate()}
        >
          <LogOut aria-hidden className="size-5 shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap font-mono text-label-md uppercase transition-opacity duration-300",
              LABEL_REVEAL,
            )}
          >
            Sign out
          </span>
        </Button>
      </div>
    </nav>
  )
}
