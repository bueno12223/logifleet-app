import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Pulsing placeholder for content that is loading. Size and shape it with utility
 * classes (e.g. `className="h-4 w-32"`) so skeletons match the real layout.
 */
export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded bg-surface-container", className)}
      {...props}
    />
  )
}
