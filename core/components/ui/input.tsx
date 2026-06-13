import * as React from "react"

import { cn } from "@/lib/utils"
import { FieldError } from "./field-error"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Field error: drives the red styling and renders the message below. */
  error?: string;
  /**
   * Accepted so `{...getFieldProps(name)}` spreads directly. Text inputs are
   * keystroke-style and validate on blur via `onChange`/`onBlur`, so this is unused here.
   */
  onValueChange?: (value: string) => void;
}

// DESIGN.md > Components > Input Fields. 1px border; 2px navy on focus (via ring,
// to avoid layout shift); error = red border + pink tint + message.
/**
 * Text input. Keystroke-style: validates on blur. Pass `error` to paint it red
 * and render the message; spread `{...getFieldProps(name)}` for form wiring.
 *
 * @example
 * <Input placeholder="VIN" {...getFieldProps("vin")} />
 */
export function Input({
  className,
  error,
  onValueChange: _onValueChange,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <input
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-10 w-full rounded border border-outline-variant bg-surface-container-lowest px-3 text-body-md text-on-surface",
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
