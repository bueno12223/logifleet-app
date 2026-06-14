import * as yup from "yup"

// Single-surface form (the default per docs/forms.md): schema, types, and the
// empty-values factory live next to the component that owns them.

export interface LoginFormValues {
  email: string
  password: string
}

export const loginInitialValues: LoginFormValues = {
  email: "",
  password: "",
}

// Messages are written inline — the schema is their home (docs/forms.md).
export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
})
