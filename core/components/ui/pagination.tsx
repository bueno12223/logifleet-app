"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "./button"
import { OptionSelect } from "./select"

export interface PaginationProps {
  /** 1-based current page. */
  page: number
  pageSize: number
  /** Total matching rows across all pages. */
  total: number
  pageSizeOptions: readonly number[]
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
  className?: string
}

/**
 * Page controls plus a page-size selector for server-paginated lists. Shows the
 * current page of a known total and disables prev/next at the bounds.
 */
export function Pagination({
  page,
  pageSize,
  total,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  className,
}: PaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const isFirstPage = page <= 1
  const isLastPage = page >= pageCount

  const sizeOptions = pageSizeOptions.map((size) => ({
    value: String(size),
    label: String(size),
  }))

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4",
        className,
      )}
    >
      <label className="flex items-center gap-2 text-body-sm text-on-surface-variant">
        Filas por página
        <OptionSelect
          className="h-9 w-20"
          options={sizeOptions}
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        />
      </label>

      <div className="flex items-center gap-3">
        <span className="font-mono text-label-sm uppercase text-on-surface-variant">
          Página {page} de {pageCount}
        </span>
        <Button
          aria-label="Página anterior"
          disabled={isFirstPage}
          size="icon"
          variant="tertiary"
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden className="size-4" />
        </Button>
        <Button
          aria-label="Página siguiente"
          disabled={isLastPage}
          size="icon"
          variant="tertiary"
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight aria-hidden className="size-4" />
        </Button>
      </div>
    </div>
  )
}
