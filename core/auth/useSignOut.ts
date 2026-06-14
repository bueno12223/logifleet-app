"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { createClient } from "@/lib/supabase/client"
import { normalizeError } from "@/core/errors"

const LOGIN_PATH = "/auth/login"

/**
 * Signs the User out, clears cached server state so no stale data leaks across
 * sessions, and returns them to the login page.
 */
export function useSignOut() {
  const supabase = useMemo(() => createClient(), [])
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw normalizeError(error)
    },
    onSuccess: () => {
      queryClient.clear()
      router.push(LOGIN_PATH)
    },
  })
}
