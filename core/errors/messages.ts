import { normalizeError, type AppErrorKind } from "./AppError"

export interface UserMessage {
  title: string;
  description?: string;
}

const GENERIC_ERROR: UserMessage = {
  title: "Something went wrong",
  description: "Please try again.",
}

const SERVER_ERROR: UserMessage = {
  title: "Server error",
  description: "Something went wrong on our end. Please try again shortly.",
}

// Tailored copy for the PostgREST / Postgres error codes worth distinguishing.
const MESSAGE_BY_CODE: Record<string, UserMessage> = {
  "23505": { title: "Already exists", description: "A record with these details already exists." },
  "23503": { title: "Still in use", description: "This item is linked to other records and can't be changed." },
  "42501": { title: "No access", description: "You don't have permission to do this." },
  PGRST116: { title: "Not found", description: "We couldn't find what you were looking for." },
}

const MESSAGE_BY_STATUS: Record<number, UserMessage> = {
  401: { title: "Sign in required", description: "Please sign in and try again." },
  403: { title: "No access", description: "You don't have permission to do this." },
  404: { title: "Not found", description: "We couldn't find what you were looking for." },
  408: { title: "Timed out", description: "That took too long. Please try again." },
  429: { title: "Too many requests", description: "Please wait a moment and try again." },
}

const MESSAGE_BY_KIND: Partial<Record<AppErrorKind, UserMessage>> = {
  network: {
    title: "Connection problem",
    description: "We couldn't reach the server. Check your connection and try again.",
  },
}

/**
 * The single source of user-facing error copy. Returns friendly, explicit text
 * for any error — never the raw `error.message`. Use it for the global toast and
 * for inline error states; override with component-specific copy when a case has
 * a more helpful, context-aware message.
 */
export function getUserMessage(error: unknown): UserMessage {
  const normalized = normalizeError(error)

  if (normalized.code && MESSAGE_BY_CODE[normalized.code]) {
    return MESSAGE_BY_CODE[normalized.code]
  }
  if (MESSAGE_BY_STATUS[normalized.status]) {
    return MESSAGE_BY_STATUS[normalized.status]
  }
  if (MESSAGE_BY_KIND[normalized.kind]) {
    return MESSAGE_BY_KIND[normalized.kind]!
  }
  if (normalized.status >= 500) {
    return SERVER_ERROR
  }
  return GENERIC_ERROR
}
