"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function HeroWebBg() {
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!ref.current) return
    if (window.innerWidth < 768) return // mobile skip

    let effect: any

    const loadVanta = async () => {
      const THREE = await import("three")
      const NET = (await import("vanta/dist/vanta.net.min")).default

      effect = NET({
        el: ref.current!,
        THREE,
        color: theme === "dark" ? 0x6366f1 : 0x4f46e5,
        backgroundColor: theme === "dark" ? 0x0b0b0b : 0xffffff,
        points: 8,
        spacing: 24,
        maxDistance: 22,
      })
    }

    loadVanta()

    return () => {
      if (effect) effect.destroy()
    }
  }, [theme])

  return <div ref={ref} className="absolute inset-0 -z-10" />
}
