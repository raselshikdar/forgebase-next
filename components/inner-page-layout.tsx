import type React from "react"
import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface InnerPageLayoutProps {
  children: React.ReactNode
  backHref: string
  backLabel: string
}

export function InnerPageLayout({ children, backHref, backLabel }: InnerPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Home">
              <Home className="h-5 w-5" />
            </Link>
            <span className="text-border">/</span>
            <Link
              href={backHref}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="text-sm text-muted-foreground">{new Date().getFullYear()} Rasel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
