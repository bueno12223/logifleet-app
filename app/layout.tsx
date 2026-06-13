import type { Metadata } from "next"
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"

import { QueryProvider } from "@/core/query"

// Hanken Grotesk — primary typeface (display, headlines, body).
const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
})

// JetBrains Mono — secondary label font for telemetry, VINs, timestamps.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "logiFleet",
  description: "Fleet management, engineered for precision.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${hankenGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
      lang="en"
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
