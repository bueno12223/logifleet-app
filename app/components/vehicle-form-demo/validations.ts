import * as yup from "yup"

// Single-surface form (the default per docs/forms.md): schema, types, and the
// empty-values factory live next to the component that owns them.

export const VEHICLE_STATUSES = [
  "in_transit",
  "idle",
  "maintenance",
  "out_of_service",
] as const

export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export interface VehicleFormValues {
  vin: string;
  plate: string;
  status: VehicleStatus | "";
  notes: string;
}

export const vehicleInitialValues: VehicleFormValues = {
  vin: "",
  plate: "",
  status: "",
  notes: "",
}

// Messages are written inline — the schema is their home (docs/forms.md).
export const vehicleSchema = yup.object({
  vin: yup
    .string()
    .trim()
    .length(17, "A VIN is exactly 17 characters")
    .required("VIN is required"),
  plate: yup
    .string()
    .trim()
    .max(10, "Plate must be 10 characters or fewer")
    .required("Plate is required"),
  status: yup
    .string()
    .oneOf(VEHICLE_STATUSES, "Select a status")
    .required("Status is required"),
  notes: yup.string().trim().max(280, "Keep notes under 280 characters"),
})
