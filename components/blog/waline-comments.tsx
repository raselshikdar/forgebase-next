"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function WalineComments() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const loadWaline = async () => {
      if (!containerRef.current) return

      // Clear previous instance
      containerRef.current.innerHTML = ""

      // Dynamically import Waline
      const { init } = await import("@waline/client")
      await import("@waline/client/style")

      init({
        el: containerRef.current,
        serverURL: "https://raselverse-waline.vercel.app/",
        dark: resolvedTheme === "dark",
        meta: ["nick", "mail"],
        requiredMeta: ["nick"],
        login: "disable",
        pageSize: 10,
        wordLimit: 500,
        emoji: ["//unpkg.com/@waline/emojis@1.2.0/weibo", "//unpkg.com/@waline/emojis@1.2.0/bilibili"],
        locale: {
          placeholder: "Leave a comment...",
        },
      })
    }

    loadWaline()
  }, [resolvedTheme])

  return <div ref={containerRef} className="waline-container" />
}
