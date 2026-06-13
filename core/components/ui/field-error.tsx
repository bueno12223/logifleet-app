/**
 * Inline validation message. Each form control renders it from its `error` prop;
 * returns nothing when there is no error.
 *
 * @example
 * <FieldError>{error}</FieldError>
 */
export function FieldError({ children }: { children?: string }) {
  if (!children) return null
  return (
    <p className="text-body-sm text-status-error" role="alert">
      {children}
    </p>
  )
}
