"use client"

import { useState } from "react"

import { useForm } from "@/core/hooks"
import {
  Badge,
  Button,
  FormField,
  Input,
  OptionSelect,
  Textarea,
} from "@/core/components/ui"

import {
  equipmentInitialValues,
  equipmentSchema,
  type EquipmentFormValues,
  type EquipmentFormStatus,
} from "./validations"

// Option list for a single form — declared at file scope, not inside the component (docs/constants.md).
// `satisfies` keeps the values honest against the status union without a label map.
const STATUS_OPTIONS = [
  { value: "in_use", label: "In use" },
  { value: "available", label: "Available" },
  { value: "in_transit", label: "In transit" },
  { value: "maintenance", label: "Maintenance" },
  { value: "retired", label: "Retired" },
] as const satisfies readonly { value: EquipmentFormStatus; label: string }[]

export function EquipmentFormDemo() {
  const [saved, setSaved] = useState<EquipmentFormValues | null>(null)

  const { Form, getFieldProps, isSubmitting, resetForm } =
    useForm<EquipmentFormValues>({
      initialValues: equipmentInitialValues,
      schema: equipmentSchema,
      onSubmit: (values) => setSaved(values),
    })

  return (
    <Form className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Keystroke field — validates on blur. */}
        <FormField required label="Serial number">
          <Input
            autoComplete="off"
            placeholder="SN-0421-XR"
            {...getFieldProps("serialNumber")}
          />
        </FormField>

        <FormField label="License plate">
          <Input autoComplete="off" placeholder="ABC-1234" {...getFieldProps("licensePlate")} />
        </FormField>

        {/* Commit field — validates immediately via onValueChange. */}
        <FormField required label="Status">
          <OptionSelect
            options={STATUS_OPTIONS}
            placeholder="Select status"
            {...getFieldProps("status")}
          />
        </FormField>
      </div>

      <FormField label="Notes">
        <Textarea placeholder="Maintenance history, quirks…" {...getFieldProps("notes")} />
      </FormField>

      <div className="flex items-center gap-3">
        <Button disabled={isSubmitting} type="submit">
          Save equipment
        </Button>
        <Button
          type="button"
          variant="tertiary"
          onClick={() => {
            resetForm()
            setSaved(null)
          }}
        >
          Reset
        </Button>
      </div>

      {saved && (
        <div className="flex flex-col gap-2 rounded border border-status-success/30 bg-status-success/5 p-4">
          <Badge variant="success">Saved</Badge>
          <pre className="overflow-x-auto font-mono text-label-md text-on-surface-variant">
            {JSON.stringify(saved, null, 2)}
          </pre>
        </div>
      )}
    </Form>
  )
}
