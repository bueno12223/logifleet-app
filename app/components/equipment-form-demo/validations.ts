import * as yup from "yup"

// Single-surface form (the default per docs/forms.md): schema, types, and the
// empty-values factory live next to the component that owns them.

export const EQUIPMENT_STATUSES = [
  "in_use",
  "available",
  "in_transit",
  "maintenance",
  "retired",
] as const

export type EquipmentFormStatus = (typeof EQUIPMENT_STATUSES)[number];

export interface EquipmentFormValues {
  serialNumber: string;
  licensePlate: string;
  status: EquipmentFormStatus | "";
  notes: string;
}

export const equipmentInitialValues: EquipmentFormValues = {
  serialNumber: "",
  licensePlate: "",
  status: "",
  notes: "",
}

// Messages are written inline — the schema is their home (docs/forms.md).
export const equipmentSchema = yup.object({
  serialNumber: yup
    .string()
    .trim()
    .max(64, "Serial number must be 64 characters or fewer")
    .required("Serial number is required"),
  licensePlate: yup
    .string()
    .trim()
    .max(10, "License plate must be 10 characters or fewer"),
  status: yup
    .string()
    .oneOf(EQUIPMENT_STATUSES, "Select a status")
    .required("Status is required"),
  notes: yup.string().trim().max(280, "Keep notes under 280 characters"),
})
