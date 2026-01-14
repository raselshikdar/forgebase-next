"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface BlogFiltersProps {
  categories: string[]
  initialSearch: string
  initialCategory: string
}

export function BlogFilters({ categories, initialSearch, initialCategory }: BlogFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (value) {
        params.set("search", value)
      } else {
        params.delete("search")
      }
      router.push(`/blog?${params.toString()}`)
    })
  }

  const handleCategoryChange = (newCategory: string) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams)
      if (newCategory && newCategory !== "all") {
        params.set("category", newCategory)
      } else {
        params.delete("category")
      }
      router.push(`/blog?${params.toString()}`)
    })
  }

  const handleClearFilters = () => {
    startTransition(() => {
      router.push("/blog")
    })
  }

  const hasFilters = initialSearch || (initialCategory && initialCategory !== "all")

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder="Search articles..."
          defaultValue={initialSearch}
          onChange={(e) => handleSearch(e.target.value)}
          disabled={isPending}
          className="pl-10 bg-card"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Button
          variant={initialCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange("all")}
          disabled={isPending}
          className={initialCategory === "all" ? "" : "bg-transparent"}
        >
          All Posts
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={initialCategory === cat ? "default" : "ghost"}
            size="sm"
            onClick={() => handleCategoryChange(cat)}
            disabled={isPending}
            className={initialCategory === cat ? "" : "text-muted-foreground"}
          >
            {cat}
          </Button>
        ))}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            disabled={isPending}
            className="ml-auto text-xs gap-1"
          >
            <X className="h-3 w-3" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
