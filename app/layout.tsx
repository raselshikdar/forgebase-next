import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { ScrollToTop } from "@/components/layout/scroll-to-top"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Rasel | Developer & Creator",
    template: "%s | Rasel",
  },
  description:
    "Personal portfolio, blog, and store. Developer, creator, and lifelong learner building products that make a difference.",
  keywords: ["developer", "portfolio", "blog", "web development", "full-stack", "react", "next.js"],
  authors: [{ name: "Rasel" }],
  creator: "Rasel",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://rasel.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Rasel | Developer & Creator",
    description: "Personal portfolio, blog, and store. Developer, creator, and lifelong learner.",
    siteName: "Rasel",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rasel | Developer & Creator",
    description: "Personal portfolio, blog, and store. Developer, creator, and lifelong learner.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  {children}
  <ScrollToTop />
</ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
