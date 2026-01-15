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
    <Button
  size="icon"
  onClick={scrollToTop}
  aria-label="Scroll to top"
  className={cn(
    "fixed bottom-6 right-6 z-50 rounded-full",
    "bg-foreground text-background",
    "shadow-lg hover:shadow-xl",
    "transition-all duration-300",
    "hover:scale-110 active:scale-95",
    isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0",
  )}
>
  <ArrowUp className="h-4 w-4" />
</Button>
  )
}
