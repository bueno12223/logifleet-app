export type AppErrorKind = "supabase" | "http" | "network" | "abort" | "unknown";

interface AppErrorParams {
  kind: AppErrorKind;
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

/**
 * Normalized error for the whole app. `message` is the raw/developer message and
 * must never be rendered in the UI — user-facing copy comes from `getUserMessage`.
 */
export class AppError extends Error {
  readonly kind: AppErrorKind
  readonly status: number
  readonly code?: string
  readonly details?: unknown

  constructor({ kind, message, status, code, details }: AppErrorParams) {
    super(message)
    this.name = "AppError"
    this.kind = kind
    this.status = status ?? 0
    this.code = code
    this.details = details
  }
}

export function isAbortError(error: unknown): boolean {
  if (error instanceof AppError) return error.kind === "abort"
  return error instanceof Error && error.name === "AbortError"
}

interface PostgrestErrorShape {
  message: string;
  code: string;
  details: string | null;
  hint: string | null;
}

function isPostgrestError(error: unknown): error is PostgrestErrorShape {
  if (typeof error !== "object" || error === null) return false
  return "message" in error && "code" in error && "details" in error && "hint" in error
}

function hasNumericStatus(error: unknown): error is { status: number; code?: string; message?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    typeof (error as { status: unknown }).status === "number"
  )
}

/** Collapses any thrown or returned error shape into a single `AppError`. */
export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error

  if (isAbortError(error)) {
    return new AppError({ kind: "abort", message: "The request was aborted." })
  }

  if (isPostgrestError(error)) {
    return new AppError({
      kind: "supabase",
      code: error.code,
      details: error.details,
      message: error.message,
    })
  }

  // supabase-js auth/storage errors and fetch-layer errors carry a numeric status.
  if (hasNumericStatus(error)) {
    return new AppError({
      kind: error.status === 0 ? "network" : "http",
      status: error.status,
      code: error.code,
      message: error.message ?? `Request failed (${error.status}).`,
    })
  }

  if (error instanceof Error) {
    return new AppError({ kind: "unknown", message: error.message })
  }

  if (typeof error === "string") {
    return new AppError({ kind: "unknown", message: error })
  }

  return new AppError({ kind: "unknown", message: "An unknown error occurred." })
}
