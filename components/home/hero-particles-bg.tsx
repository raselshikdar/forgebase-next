"use client"

import { useEffect, useState } from "react"
import Particles from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"
import type { Engine } from "@tsparticles/engine"
import { useTheme } from "next-themes"

export function HeroParticlesBg() {
  const { theme } = useTheme()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    loadSlim({} as Engine).then(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <Particles
      className="absolute inset-0 -z-10"
      options={{
        fullScreen: false,
        background: {
          color: {
            value: theme === "dark" ? "#0b0b0b" : "#ffffff",
          },
        },
        particles: {
          number: { value: 45 },
          color: { value: theme === "dark" ? "#6366f1" : "#4f46e5" },
          links: {
            enable: true,
            color: theme === "dark" ? "#6366f1" : "#4f46e5",
            distance: 120,
            opacity: 0.4,
          },
          move: { enable: true, speed: 1 },
          size: { value: 2 },
        },
      }}
    />
  )
}
