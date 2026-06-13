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
  vehicleInitialValues,
  vehicleSchema,
  type VehicleFormValues,
  type VehicleStatus,
} from "./validations"

// Option list for a single form — declared at file scope, not inside the component (docs/constants.md).
// `satisfies` keeps the values honest against the status union without a label map.
const STATUS_OPTIONS = [
  { value: "in_transit", label: "In transit" },
  { value: "idle", label: "Idle" },
  { value: "maintenance", label: "Maintenance" },
  { value: "out_of_service", label: "Out of service" },
] as const satisfies readonly { value: VehicleStatus; label: string }[]

export function VehicleFormDemo() {
  const [saved, setSaved] = useState<VehicleFormValues | null>(null)

  const { Form, getFieldProps, isSubmitting, resetForm } =
    useForm<VehicleFormValues>({
      initialValues: vehicleInitialValues,
      schema: vehicleSchema,
      onSubmit: (values) => setSaved(values),
    })

  return (
    <Form className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Keystroke field — validates on blur. */}
        <FormField required label="VIN">
          <Input
            autoComplete="off"
            placeholder="1HGCM82633A004352"
            {...getFieldProps("vin")}
          />
        </FormField>

        <FormField required label="Plate">
          <Input autoComplete="off" placeholder="ABC-1234" {...getFieldProps("plate")} />
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
          Save vehicle
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
