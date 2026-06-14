"use client"

import * as Popover from "@radix-ui/react-popover"
import { Check, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import type { SelectOption } from "./select"

export interface MultiSelectProps {
  options: readonly SelectOption[]
  /** Currently selected values. */
  value: string[]
  onValueChange: (value: string[]) => void
  /** Shown in the trigger; gets a "(N)" suffix while something is selected. */
  label: string
  className?: string
}

/**
 * Multi-select dropdown built on `@radix-ui/react-popover`. The trigger shows the
 * label plus a selected count; the panel is a checkbox-style list with a clear
 * action. Use for filtering by a closed or dynamic set of values.
 *
 * @example
 * <MultiSelect label="Estado" options={statusOptions} value={statuses} onValueChange={setStatuses} />
 */
export function MultiSelect({
  options,
  value,
  onValueChange,
  label,
  className,
}: MultiSelectProps) {
  const toggle = (optionValue: string) => {
    onValueChange(
      value.includes(optionValue)
        ? value.filter((current) => current !== optionValue)
        : [...value, optionValue],
    )
  }

  const count = value.length

  return (
    <Popover.Root>
      <Popover.Trigger
        className={cn(
          "flex h-10 items-center justify-between gap-2 rounded border border-outline-variant bg-surface-container-lowest px-3 text-body-md text-on-surface outline-none",
          "transition-colors hover:bg-surface-container-low",
          "focus-visible:border-brand-navy focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-brand-navy",
          "data-[state=open]:border-brand-navy",
          className,
        )}
      >
        <span className={cn(count === 0 && "text-on-surface-variant")}>
          {label}
          {count > 0 ? ` (${count})` : ""}
        </span>
        <ChevronDown aria-hidden className="size-4 text-on-surface-variant" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          className="z-50 min-w-[var(--radix-popover-trigger-width)] overflow-hidden rounded border border-outline-variant bg-surface-container-lowest shadow-lg"
          sideOffset={4}
        >
          <ul className="max-h-72 overflow-y-auto p-1">
            {options.map((option) => {
              const selected = value.includes(option.value)
              return (
                <li key={option.value}>
                  <button
                    className="flex w-full items-center gap-2 rounded px-2 py-2 text-left text-body-sm text-on-surface outline-none hover:bg-surface-container focus-visible:bg-surface-container"
                    type="button"
                    onClick={() => toggle(option.value)}
                  >
                    <span
                      className={cn(
                        "flex size-4 shrink-0 items-center justify-center rounded-sm border",
                        selected
                          ? "border-brand-navy bg-brand-navy text-white"
                          : "border-outline-variant",
                      )}
                    >
                      {selected ? (
                        <Check aria-hidden className="size-3" strokeWidth={3} />
                      ) : null}
                    </span>
                    {option.label}
                  </button>
                </li>
              )
            })}
          </ul>
          {count > 0 ? (
            <div className="border-t border-card-border p-1">
              <button
                className="w-full rounded px-2 py-1.5 text-left font-mono text-label-sm uppercase text-on-surface-variant outline-none hover:bg-surface-container focus-visible:bg-surface-container"
                type="button"
                onClick={() => onValueChange([])}
              >
                Limpiar
              </button>
            </div>
          ) : null}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
