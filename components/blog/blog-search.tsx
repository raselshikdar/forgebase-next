"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"

export function BlogSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState(searchParams.get("q") || "")

  const handleSearch = (value: string) => {
    setQuery(value)
    startTransition(() => {
      if (value) {
        router.push(`/blog?q=${encodeURIComponent(value)}`)
      } else {
        router.push("/blog")
      }
    })
  }

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search articles..."
        className="pl-11 h-11 bg-card border-border font-mono text-sm"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {isPending && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}
