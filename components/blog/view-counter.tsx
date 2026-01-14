"use client"

import { useEffect } from "react"
import { incrementBlogViews } from "@/lib/actions/blog"

interface ViewCounterProps {
  slug: string
}

export function ViewCounter({ slug }: ViewCounterProps) {
  useEffect(() => {
    incrementBlogViews(slug)
  }, [slug])

  return null
}
