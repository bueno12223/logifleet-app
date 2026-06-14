import * as React from "react"

import { cn } from "@/lib/utils"

// DESIGN.md > Components > Lists. High-density data table with subtle horizontal
// dividers and a light navy hover tint. Radix has no table primitive, so the kit
// wraps native table elements (the documented allowance in AGENTS.md).

/** Scrollable table container + the `<table>` element. */
export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-card-border bg-surface-container-lowest">
      <table
        className={cn("w-full border-collapse text-body-sm", className)}
        {...props}
      />
    </div>
  )
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-surface-container-low", className)} {...props} />
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-card-border transition-colors last:border-b-0 hover:bg-brand-navy/5",
        className,
      )}
      {...props}
    />
  )
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left font-mono text-label-sm uppercase font-medium text-on-surface-variant",
        className,
      )}
      {...props}
    />
  )
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn("px-4 py-3 text-on-surface", className)} {...props} />
  )
}
