"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function HeroWebBg() {
  const ref = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!ref.current) return
    if (!theme) return

    let effect: any

    const init = async () => {
      const THREE = await import("three")
      const NET = (await import("vanta/dist/vanta.net")).default

      const isMobile = window.innerWidth < 768

      effect = NET({
        el: ref.current!,
        THREE,
        color: theme === "dark" ? 0x6366f1 : 0x4f46e5,
        backgroundColor: theme === "dark" ? 0x0b0b0b : 0xffffff,

        // 🔽 Mobile-friendly settings
        points: isMobile ? 5 : 8,
        spacing: isMobile ? 30 : 24,
        maxDistance: isMobile ? 18 : 22,
      })
    }

    init()

    return () => {
      if (effect) effect.destroy()
    }
  }, [theme])

  return <div ref={ref} className="absolute inset-0 -z-10" />
}
