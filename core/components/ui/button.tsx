import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// DESIGN.md > Components > Buttons.
const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-navy focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary: solid mustard, navy text, bold all-caps for high urgency.
        primary:
          "bg-brand-mustard text-brand-navy uppercase tracking-wide hover:bg-mustard-light active:bg-secondary-fixed-dim",
        // Secondary: solid navy, white text.
        secondary:
          "bg-brand-navy text-white hover:bg-navy-muted active:bg-navy-deep",
        // Tertiary: transparent with a 2px navy border.
        tertiary:
          "border-2 border-brand-navy bg-transparent text-brand-navy hover:bg-brand-navy/5 active:bg-brand-navy/10",
        // Ghost: borderless, transparent until hovered. For low-emphasis icon
        // controls (top-bar notifications, help) that should recede until used.
        ghost:
          "bg-transparent text-on-surface-variant hover:bg-brand-navy/5 hover:text-brand-navy active:bg-brand-navy/10",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        // Icon: square, padless target for a single glyph.
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/**
 * Primary action button. `primary` is mustard (high-urgency CTA), `secondary`
 * is navy, `tertiary` is an outline, `ghost` is borderless for low-emphasis
 * icon controls. Sizes: sm/md/lg, plus `icon` for a square single-glyph target.
 *
 * @example
 * <Button variant="primary" onClick={dispatch}>Dispatch</Button>
 */
export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { buttonVariants }
