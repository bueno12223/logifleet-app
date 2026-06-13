import * as LabelPrimitive from "@radix-ui/react-label"
import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Standalone field label built on {@link LabelPrimitive} from `@radix-ui/react-label`.
 * `FormField` renders its own label, so reach for this only when labelling a
 * control outside a `FormField`.
 *
 * @example
 * <Label htmlFor="search">Search fleet</Label>
 */
export function Label({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        "text-body-sm font-medium text-on-surface select-none",
        className,
      )}
      {...props}
    />
  )
}
