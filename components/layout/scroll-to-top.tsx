"use client"

import { useEffect, useState } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300)
    }
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full",
        "bg-primary text-primary-foreground shadow-lg backdrop-blur",
        "transition-all duration-300 hover:scale-110 hover:shadow-xl",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-16 opacity-0",
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}
