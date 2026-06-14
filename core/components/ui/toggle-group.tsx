"use client"

import * as React from "react"
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"

import { cn } from "@/lib/utils"

/**
 * Segmented control built on `@radix-ui/react-toggle-group`. Used for mutually
 * exclusive view switches (e.g. card grid vs table). Compose with
 * {@link ToggleGroupItem}.
 *
 * @example
 * <ToggleGroup type="single" value={view} onValueChange={setView}>
 *   <ToggleGroupItem value="grid"><LayoutGrid /></ToggleGroupItem>
 *   <ToggleGroupItem value="table"><List /></ToggleGroupItem>
 * </ToggleGroup>
 */
export function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        "inline-flex items-center overflow-hidden rounded border border-outline-variant",
        className,
      )}
      {...props}
    />
  )
}

export function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        "flex h-9 items-center justify-center px-3 text-on-surface-variant outline-none transition-colors",
        "hover:bg-surface-container not-first:border-l not-first:border-outline-variant",
        "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-navy",
        "data-[state=on]:bg-brand-navy/10 data-[state=on]:text-brand-navy",
        className,
      )}
      {...props}
    />
  )
}
