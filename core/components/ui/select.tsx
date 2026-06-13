import * as Select from "@radix-ui/react-select"
import * as React from "react"

import { cn } from "@/lib/utils"
import { FieldError } from "./field-error"

export interface SelectOption {
  label: string
  value: string
}

type FormControlElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement

export interface OptionSelectProps {
  options: readonly SelectOption[]
  value?: string
  placeholder?: string
  name?: string
  disabled?: boolean
  required?: boolean
  className?: string
  "data-testid"?: string
  /** Field error: drives the red styling and renders the message below. */
  error?: string
  /**
   * Commit-style change. Spread `{...getFieldProps(name)}` and this fires on every
   * selection — `useForm` validates immediately, so the error clears on commit.
   */
  onValueChange?: (value: string) => void
  /** Accepted so `{...getFieldProps(name)}` spreads directly; selects commit via onValueChange. */
  onChange?: React.ChangeEventHandler<FormControlElement>
  onBlur?: React.FocusEventHandler<FormControlElement>
}

/**
 * Declarative select built on top of {@link Select} from `@radix-ui/react-select`.
 *
 * Renders a complete Radix select from a flat `options` array. Commit-style: validates
 * immediately on change via `onValueChange` (see docs/forms.md). Spread
 * `getFieldProps()` directly for form integration.
 *
 * @example
 * <OptionSelect options={statusOptions} {...getFieldProps("status")} />
 */
export function OptionSelect({
  className,
  options,
  placeholder,
  value,
  error,
  name,
  disabled,
  required,
  onValueChange,
  onBlur,
  "data-testid": testId,
}: OptionSelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Select.Root
        disabled={disabled}
        name={name}
        required={required}
        value={value ?? ""}
        onValueChange={onValueChange}
      >
        <Select.Trigger
          aria-invalid={error ? true : undefined}
          className={cn(
            "flex h-10 w-full items-center justify-between gap-2 rounded border border-outline-variant bg-surface-container-lowest pl-3 pr-3 text-body-md text-on-surface",
            "transition-[color,border-color,box-shadow] outline-none",
            "focus:border-brand-navy focus:ring-1 focus:ring-inset focus:ring-brand-navy",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-placeholder:text-on-surface-variant/60",
            error &&
              "border-status-error bg-error-container/30 focus:border-status-error focus:ring-status-error",
            className,
          )}
          data-testid={testId}
          onBlur={
            onBlur
              ? (event) =>
                  onBlur(
                    event as unknown as React.FocusEvent<FormControlElement>,
                  )
              : undefined
          }
        >
          <Select.Value placeholder={placeholder} />
          <Select.Icon className="text-on-surface-variant">
            <svg aria-hidden className="size-4" fill="none" viewBox="0 0 20 20">
              <path
                d="m5 7.5 5 5 5-5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </svg>
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Content
            className="z-50 overflow-hidden rounded border border-outline-variant bg-surface-container-lowest shadow-lg"
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className="p-1">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  className={cn(
                    "relative flex h-9 cursor-pointer select-none items-center rounded pl-8 pr-3 text-body-md text-on-surface outline-none",
                    "data-highlighted:bg-surface-container data-highlighted:outline-none",
                    "data-disabled:cursor-not-allowed data-disabled:opacity-50",
                  )}
                  value={option.value}
                >
                  <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <svg
                      aria-hidden
                      className="size-4 text-brand-navy"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="m4 10.5 4 4 8-9"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </Select.ItemIndicator>
                  <Select.ItemText>{option.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      <FieldError>{error}</FieldError>
    </div>
  )
}
