"use client"

import React from "react"
import { useFormik, FormikProvider } from "formik"
import type { FormikConfig, FormikContextType, FormikValues } from "formik"
import type { AnyObjectSchema } from "yup"

import { toKebabCase } from "@/core/utils"

const withFormikDevtools: ((formik: unknown) => void) | null =
  process.env.NODE_ENV === "development"
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("formik-devtools-extension").withFormikDevtools
    : null

const formikDefaults = {
  validateOnBlur: true,
  validateOnChange: false,
}

export interface EnhancedFieldProps {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  onBlur: React.FocusEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;
  /** Commit-style setter for controls without a meaningful blur (selects, pickers). Validates the form immediately. */
  onValueChange: (val: string) => void;
  "data-testid"?: string;
  error?: string;
}

interface UseFormOptions<T extends FormikValues> {
  onSubmit: FormikConfig<T>["onSubmit"];
  initialValues: T;
  schema: AnyObjectSchema;
  enableReinitialize?: boolean;
}

interface FormProps {
  children: React.ReactNode;
  className?: string;
}

export type FormState<T extends FormikValues> = Omit<FormikContextType<T>, "getFieldProps" | "setFieldValue" | "setValues"> & {
  getFieldProps: (name: string) => EnhancedFieldProps;
  /**
   * Validates by default (`shouldValidate` defaults to `true` — unlike stock
   * formik), so commit-style writes (selects, pickers, checkboxes, list ops)
   * just work. From a keystroke setter (text/numeric per-keypress) pass `false`
   * and forward the field's `name` + `onBlur` so blur validates instead — never
   * validate per keystroke. See docs/forms.md.
   */
  setFieldValue: FormikContextType<T>["setFieldValue"];
  /** Validates by default (`shouldValidate` defaults to `true`), same contract as `setFieldValue`. */
  setValues: FormikContextType<T>["setValues"];
};

/**
 * Formik wrapper that standardizes validation timing and field wiring.
 *
 * Text inputs validate on blur, never per keystroke. Commit-style changes
 * validate immediately: `getFieldProps().onValueChange` (selects, date pickers)
 * and direct `setFieldValue`/`setValues` calls all validate by default — a
 * keystroke setter must opt out with `shouldValidate: false`. Returns the
 * formik bag plus a stable `<Form>` component and an enhanced `getFieldProps`
 * that adds `onValueChange`, `error`, and a `data-testid`.
 *
 * @example
 * const { Form, getFieldProps } = useForm({ initialValues, schema, onSubmit });
 * return (
 *   <Form>
 *     <Input {...getFieldProps("vin")} />
 *     <OptionSelect options={statusOptions} {...getFieldProps("status")} />
 *   </Form>
 * );
 */
export function useForm<T extends FormikValues>({ onSubmit, initialValues, schema, enableReinitialize }: UseFormOptions<T>) {
  const formik = useFormik<T>({
    ...formikDefaults,
    initialValues,
    validationSchema: schema,
    onSubmit,
    enableReinitialize,
  })

  withFormikDevtools?.(formik)
  function getFieldProps(name: string): EnhancedFieldProps {
    const { error } = formik.getFieldMeta(name)
    const { value, ...fieldProps } = formik.getFieldProps(name)
    return {
      ...fieldProps,
      value: value ?? "",
      "data-testid": toKebabCase(name),
      onValueChange: (val: string) => formik.setFieldValue(name, val || null, true),
      error: error ?? undefined,
    }
  }

  const setFieldValue: FormState<T>["setFieldValue"] = (field, value, shouldValidate = true) =>
    formik.setFieldValue(field, value, shouldValidate)

  const setValues: FormState<T>["setValues"] = (nextValues, shouldValidate = true) => formik.setValues(nextValues, shouldValidate)

  const enhancedFormik: FormState<T> = { ...formik, getFieldProps, setFieldValue, setValues }

  const formikRef = React.useRef(enhancedFormik)
  // eslint-disable-next-line react-hooks/refs -- latest-ref pattern: safe because children read it in the same render pass
  formikRef.current = enhancedFormik

  const Form = React.useMemo(
    () =>
      function StableForm({ children, className }: FormProps) {
        return (
          <FormikProvider value={formikRef.current as FormikContextType<T>}>
            <form className={className} onSubmit={(e) => formikRef.current.handleSubmit(e)}>
              {children}
            </form>
          </FormikProvider>
        )
      },
    [],
  )

  return { ...enhancedFormik, Form }
}

// Encapsulated formik exports - components should not import formik directly.
export { FieldArray, getIn, setIn, useFormikContext as useFormContext } from "formik"
