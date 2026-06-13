import type React from "react"

import { Label } from "./label"

interface FormFieldProps {
  label: string
  required?: boolean
  action?: React.ReactNode
  children: React.ReactNode
}

/**
 * Wraps a form control with a label row and an optional action slot.
 *
 * The control renders its own error (every input takes an `error` string), so
 * FormField only owns the label, the required marker, and the action slot.
 *
 * @example
 * <FormField label="VIN" required action={<FillAllButton />}>
 *   <Input {...getFieldProps("vin")} />
 * </FormField>
 */
export function FormField({
  label,
  required,
  action,
  children,
}: FormFieldProps) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <Label>
          {label}
          {required && <span className="ml-0.5 text-status-error">*</span>}
        </Label>
        {action}
      </div>
      {children}
    </div>
  )
}
