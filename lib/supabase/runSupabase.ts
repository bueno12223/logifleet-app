import { normalizeError } from "@/core/errors"

/** Shape every supabase-js query/RPC builder resolves to. */
interface SupabaseResult<T> {
  data: T;
  error: unknown;
}

/**
 * Awaits a supabase-js builder and returns its `data`, throwing a normalized
 * `AppError` when supabase reports an `error`. Lets a TanStack `queryFn` /
 * `mutationFn` be a one-liner instead of hand-checking `{ data, error }` at
 * every call site.
 *
 * @example
 * useQuery({
 *   queryKey: ["equipment"],
 *   queryFn: ({ signal }) =>
 *     runSupabase(supabase.from("equipment").select("*").abortSignal(signal)),
 * });
 */
export async function runSupabase<T>(builder: PromiseLike<SupabaseResult<T>>): Promise<NonNullable<T>> {
  const { data, error } = await builder
  if (error) throw normalizeError(error)
  return data as NonNullable<T>
}
