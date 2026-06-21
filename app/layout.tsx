import type { Metadata } from "next"

import "@/app/globals.css"

export const metadata: Metadata = {
  title: "Tattoo-Studio",
  description: "Dark flash tattoo booking demo with authentication.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
