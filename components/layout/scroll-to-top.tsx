"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400)
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Button
      onClick={scrollToTop}
      aria-label="Back to top"
      size="icon"
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full",
        "bg-foreground text-background hover:bg-foreground/90",
        "shadow-lg transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0 pointer-events-none",
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </Button>
  )
}
