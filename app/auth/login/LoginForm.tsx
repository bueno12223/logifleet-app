"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useForm } from "@/core/hooks"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FormField,
  Input,
} from "@/core/components/ui"
import { AUTH_USER_QUERY_KEY } from "@/core/auth"
import { AppError, getUserMessage, normalizeError } from "@/core/errors"
import { createClient } from "@/lib/supabase/client"

import {
  loginInitialValues,
  loginSchema,
  type LoginFormValues,
} from "./validations"

const INVALID_CREDENTIALS_STATUS = 400
const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password"

export function LoginForm() {
  const supabase = useMemo(() => createClient(), [])
  const queryClient = useQueryClient()
  const router = useRouter()

  const signIn = useMutation({
    mutationFn: async (values: LoginFormValues) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if (error) throw normalizeError(error)
    },
    meta: { skipGlobalErrorToast: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_USER_QUERY_KEY })
      router.replace("/")
      router.refresh()
    },
  })

  const { Form, getFieldProps, isSubmitting } = useForm<LoginFormValues>({
    initialValues: loginInitialValues,
    schema: loginSchema,
    onSubmit: async (values) => {
      try {
        await signIn.mutateAsync(values)
      } catch {
        // Surfaced inline via `signIn.error` below.
      }
    },
  })

  const errorMessage = signIn.error
    ? signIn.error instanceof AppError &&
      signIn.error.status === INVALID_CREDENTIALS_STATUS
      ? INVALID_CREDENTIALS_MESSAGE
      : getUserMessage(signIn.error).title
    : undefined

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center gap-4 pt-8 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- brand wordmark SVG, no optimization needed */}
          <img alt="logiFleet" className="h-7 w-auto" src="/logo.svg" />
          <div className="flex flex-col gap-1">
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Access your fleet management workspace.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Form className="flex flex-col gap-5">
            <FormField required label="Email">
              <Input
                autoComplete="email"
                placeholder="you@company.com"
                type="email"
                {...getFieldProps("email")}
              />
            </FormField>

            <FormField required label="Password">
              <Input
                autoComplete="current-password"
                placeholder="Your password"
                type="password"
                {...getFieldProps("password")}
              />
            </FormField>

            {errorMessage && (
              <p
                className="rounded border border-status-error/40 bg-error-container/30 px-3 py-2 text-body-sm text-status-error"
                role="alert"
              >
                {errorMessage}
              </p>
            )}

            <Button
              className="w-full"
              disabled={isSubmitting || signIn.isPending}
              type="submit"
            >
              Sign in
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
