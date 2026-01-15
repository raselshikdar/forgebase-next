"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "w-12 h-12 flex items-center justify-center",
        "bg-muted/70 backdrop-blur-md border border-border/40 shadow-xl",
        "text-foreground",
        "transition-all duration-300",
        "hover:bg-primary/20 hover:text-primary hover:rotate-6",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-16 pointer-events-none",
        // 🔺 triangle shape
        "clip-triangle",
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  )
}
