import * as React from "react"

import { cn } from "@/lib/utils"
import { FieldError } from "./field-error"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Field error: drives the red styling and renders the message below. */
  error?: string;
  /** Accepted so `{...getFieldProps(name)}` spreads directly; keystroke-style, validates on blur. */
  onValueChange?: (value: string) => void;
}

/**
 * Multi-line text input. Keystroke-style: validates on blur. Pass `error` to
 * paint it red and render the message.
 *
 * @example
 * <Textarea placeholder="Notes" {...getFieldProps("notes")} />
 */
export function Textarea({
  className,
  error,
  onValueChange: _onValueChange,
  ...props
}: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        aria-invalid={error ? true : undefined}
        className={cn(
          "min-h-24 w-full rounded border border-outline-variant bg-surface-container-lowest px-3 py-2 text-body-md text-on-surface",
          "placeholder:text-on-surface-variant/50 transition-[color,border-color,box-shadow] outline-none",
          "focus:border-brand-navy focus:ring-1 focus:ring-inset focus:ring-brand-navy",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error &&
            "border-status-error bg-error-container/30 focus:border-status-error focus:ring-status-error",
          className,
        )}
        {...props}
      />
      <FieldError>{error}</FieldError>
    </div>
  )
}
