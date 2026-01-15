"use client"

import { useEffect, useState } from "react"
import Particles from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import { useTheme } from "next-themes"

export function HeroParticlesBg() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !resolvedTheme) return null

  const isDark = resolvedTheme === "dark"

  return (
    <Particles
      className="absolute inset-0 z-0"
      init={async (engine) => {
        await loadSlim(engine)
      }}
      options={{
        fullScreen: { enable: false },
        background: { color: { value: "transparent" } },
        particles: {
          number: { value: 35 },
          color: { value: isDark ? "#6366f1" : "#4f46e5" },
          links: {
            enable: true,
            distance: 140,
            color: isDark ? "#6366f1" : "#4f46e5",
            opacity: 0.4,
          },
          move: { enable: true, speed: 1 },
          size: { value: 2 },
        },
      }}
    />
  )
}
