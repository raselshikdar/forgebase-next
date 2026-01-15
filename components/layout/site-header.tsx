"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "About", href: "/#about" },
  { name: "Projects", href: "/portfolio" },
  { name: "Blog", href: "/blog" },
  { name: "Store", href: "/store" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
]

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const isActive = (href: string) => {
    if (href === "/#about" || href === "/#projects") {
      return pathname === "/" && href.includes("#")
    }
    return pathname === href || (href !== "/" && pathname.startsWith(href.split("#")[0]))
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b border-border/40 py-3" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
          Rasel<span className="text-primary">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm transition-colors relative",
                isActive(item.href) ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
          <ThemeToggle />
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
  <>
    {/* Backdrop — scroll করলে নিচের লেখা ঢাকার জন্য */}
    <div
      className="fixed inset-0 top-[57px] md:hidden z-40
                 bg-background/95 backdrop-blur-xl"
      onClick={() => setMobileOpen(false)}
    />

    {/* Menu */}
    <div className="fixed inset-x-0 top-[57px] md:hidden z-50 animate-in slide-in-from-top-2 duration-200">
      <div className="mx-4 mt-2 rounded-2xl border border-border/40
                      bg-background shadow-xl overflow-hidden">
        <div className="p-2">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary/15 text-foreground shadow-sm"
                    : "text-foreground hover:bg-primary/10 active:scale-[0.98]",
                )}
              >
                <span className="flex-1">{item.name}</span>
                {active && <ChevronRight className="h-4 w-4 opacity-60" />}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  </>
)}
    </header>
  )
}
