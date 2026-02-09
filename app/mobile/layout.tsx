import React from "react"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "Trading Terminal - Mobile",
  description: "AI-powered crypto trading terminal mobile app",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0f0d",
}

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="max-w-md mx-auto bg-[#0a0f0d] min-h-screen">
      {children}
    </div>
  )
}
