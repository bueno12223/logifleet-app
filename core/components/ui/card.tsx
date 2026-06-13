import * as React from "react"

import { cn } from "@/lib/utils"

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Active/selected cards get a 2px mustard accent bar on the left edge (DESIGN.md). */
  selected?: boolean;
}

/**
 * Primary container for entity data. 1px border, no shadow (DESIGN.md Level 1).
 * `selected` adds a 2px mustard accent bar on the left edge. Compose with
 * `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
 *
 * @example
 * <Card selected>
 *   <CardHeader><CardTitle>Truck 04</CardTitle></CardHeader>
 *   <CardContent>VIN 1FUJGLDR9CLBP8834</CardContent>
 * </Card>
 */
export function Card({ className, selected, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-card-border bg-surface-container-lowest",
        selected && "border-l-2 border-l-brand-mustard",
        className,
      )}
      data-selected={selected ? "" : undefined}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1 p-5 pb-0", className)} {...props} />
  )
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-headline-md text-on-surface", className)}
      {...props}
    />
  )
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-body-sm text-on-surface-variant", className)}
      {...props}
    />
  )
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5", className)} {...props} />
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-3 p-5 pt-0", className)}
      {...props}
    />
  )
}
