import { AppError, isAbortError, normalizeError } from "@/core/errors"

export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  /** JSON body; serialized automatically. */
  body?: unknown;
  /** Query params appended to the URL. */
  params?: Record<string, string>;
}

const JSON_CONTENT_TYPE = "application/json"

function buildUrl(url: string, params?: Record<string, string>): string {
  if (!params || Object.keys(params).length === 0) return url
  const query = new URLSearchParams(params).toString()
  return url.includes("?") ? `${url}&${query}` : `${url}?${query}`
}

/**
 * Thin fetch for non-Supabase REST APIs (external services, internal route
 * handlers). Returns parsed JSON on success and throws a normalized `AppError`
 * on failure. Retries, caching and abort are owned by TanStack Query — pass its
 * `signal` through `options` and let `useQuery`/`useMutation` drive the lifecycle.
 */
export async function apiFetch<TResponse>(url: string, options: ApiFetchOptions = {}): Promise<TResponse> {
  const { body, params, headers, ...rest } = options

  let response: Response
  try {
    response = await fetch(buildUrl(url, params), {
      ...rest,
      headers: {
        Accept: JSON_CONTENT_TYPE,
        ...(body !== undefined ? { "Content-Type": JSON_CONTENT_TYPE } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (error) {
    if (isAbortError(error)) throw normalizeError(error)
    throw new AppError({
      kind: "network",
      status: 0,
      message: error instanceof Error ? error.message : "Network request failed.",
    })
  }

  const contentType = response.headers.get("content-type") ?? ""
  const payload = contentType.includes("json") ? await response.json() : await response.text()

  if (!response.ok) {
    const envelope = (payload as { error?: { code?: string; details?: unknown; message?: string } })?.error
    throw new AppError({
      kind: "http",
      status: response.status,
      code: envelope?.code,
      details: envelope?.details,
      message: envelope?.message ?? `Request failed (${response.status}).`,
    })
  }

  return payload as TResponse
}
