import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { AppError, getUserMessage, isAbortError } from "@/core/errors"

const QUERY_STALE_TIME_MS = 30_000
const QUERY_MAX_RETRIES = 2
const CLIENT_ERROR_STATUS_MIN = 400
const CLIENT_ERROR_STATUS_MAX = 500

// Type the `meta` bag so `meta: { skipGlobalErrorToast: true }` is checked.
declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: { skipGlobalErrorToast?: boolean };
    mutationMeta: { skipGlobalErrorToast?: boolean };
  }
}

function showErrorToast(error: unknown, skip?: boolean): void {
  if (skip || isAbortError(error)) return
  const { title, description } = getUserMessage(error)
  toast.error(title, { description })
}

/**
 * Builds a QueryClient whose cache surfaces every unhandled query/mutation
 * failure as a user-friendly toast. Opt a call out with
 * `meta: { skipGlobalErrorToast: true }` when it renders the error inline.
 */
export function makeQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => showErrorToast(error, query.meta?.skipGlobalErrorToast),
    }),
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) =>
        showErrorToast(error, mutation.meta?.skipGlobalErrorToast),
    }),
    defaultOptions: {
      queries: {
        staleTime: QUERY_STALE_TIME_MS,
        refetchOnWindowFocus: false,
        retry: (failureCount, error) => {
          if (isAbortError(error)) return false
          const status = error instanceof AppError ? error.status : 0
          const isClientError = status >= CLIENT_ERROR_STATUS_MIN && status < CLIENT_ERROR_STATUS_MAX
          if (isClientError) return false
          return failureCount < QUERY_MAX_RETRIES
        },
      },
      mutations: {
        retry: false,
      },
    },
  })
}
