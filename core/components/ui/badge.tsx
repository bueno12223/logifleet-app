import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// DESIGN.md > Components > Chips & Badges. Pill-shaped, JetBrains Mono labels for a technical feel.
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-label-sm uppercase",
  {
    variants: {
      variant: {
        neutral:
          "border-outline-variant bg-surface-container text-on-surface-variant",
        navy: "border-transparent bg-brand-navy text-white",
        success: "border-status-success/30 bg-status-success/10 text-status-success",
        warning: "border-brand-mustard bg-mustard-light/40 text-on-secondary-container",
        error: "border-status-error/30 bg-error-container text-on-error-container",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Pill-shaped status chip in JetBrains Mono. Use for vehicle/asset state.
 *
 * @example
 * <Badge variant="success">In transit</Badge>
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { badgeVariants }
