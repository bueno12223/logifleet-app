"use client"

import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"

import { createClient } from "@/lib/supabase/client"
import { normalizeError } from "@/core/errors"

import { APP_ROLES, type AppRole } from "./route-guards"

export const AUTH_USER_QUERY_KEY = ["auth", "user"] as const

export interface AuthUser {
  id: string
  email: string | null
}

function toRole(value: unknown): AppRole | null {
  return (APP_ROLES as readonly string[]).includes(value as string)
    ? (value as AppRole)
    : null
}

/**
 * The signed-in User and their Role, read from the JWT claims (no DB round
 * trip). `role` is null when there is no session, or when the access-token hook
 * has not been enabled yet (the `user_role` claim is absent). Errors stay silent
 * here — an absent session is a normal state, not a failure to toast.
 */
export function useUser() {
  const supabase = useMemo(() => createClient(), [])

  const { data: claims, isLoading } = useQuery({
    queryKey: AUTH_USER_QUERY_KEY,
    queryFn: async () => {
      const { data, error } = await supabase.auth.getClaims()
      if (error) throw normalizeError(error)
      return data?.claims ?? null
    },
    meta: { skipGlobalErrorToast: true },
  })

  const user: AuthUser | null = claims
    ? { id: String(claims.sub), email: (claims.email as string) ?? null }
    : null

  return {
    user,
    role: toRole(claims?.user_role),
    isLoading,
  }
}
