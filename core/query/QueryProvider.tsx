"use client"

import { useState, type ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

import { makeQueryClient } from "./queryClient"

// Toast appearance mapped to DESIGN.md "Industrial Precision" tokens. Per-tone
// classes own bg/border/text; the base sets only shape + font so tone colors win.
const TOAST_CLASS_NAMES = {
  toast: "rounded-lg! border! font-sans! shadow-[0_4px_12px_rgba(18,32,56,0.18)]!",
  title: "text-body-sm! font-semibold!",
  description: "text-body-sm!",
  closeButton: "border-outline-variant! bg-surface-container-lowest! text-on-surface-variant!",
  default: "bg-surface-container-lowest! border-card-border! text-on-surface!",
  error: "bg-error-container! border-status-error/40! text-on-error-container!",
  success: "bg-surface-container-lowest! border-status-success/40! text-status-success!",
  warning: "bg-mustard-light/40! border-brand-mustard! text-on-secondary-container!",
  info: "bg-surface-container! border-outline-variant! text-on-surface!",
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster closeButton position="top-right" toastOptions={{ classNames: TOAST_CLASS_NAMES }} />
    </QueryClientProvider>
  )
}
