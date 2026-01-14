"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { List } from "lucide-react"

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [items, setItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Parse headings from content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, "text/html")
    const headings = doc.querySelectorAll("h2, h3")

    const tocItems: TOCItem[] = Array.from(headings).map((heading, index) => {
      const id = heading.id || `heading-${index}`
      return {
        id,
        text: heading.textContent || "",
        level: Number.parseInt(heading.tagName.charAt(1)),
      }
    })

    setItems(tocItems)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-80px 0px -80% 0px" },
    )

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg"
        aria-label="Table of Contents"
      >
        <List className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* TOC Panel */}
      <nav
        className={cn(
          "fixed z-50 bg-card border border-border/40 rounded-lg p-4 shadow-lg transition-all duration-300",
          "lg:sticky lg:top-24 lg:z-10 lg:bg-transparent lg:border-0 lg:p-0 lg:shadow-none lg:block",
          isOpen ? "bottom-20 right-6 left-6 max-h-[60vh] overflow-auto" : "hidden lg:block",
        )}
      >
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">On This Page</p>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToHeading(item.id)}
                className={cn(
                  "text-sm text-left w-full hover:text-primary transition-colors",
                  item.level === 3 && "pl-4",
                  activeId === item.id ? "text-primary font-medium" : "text-muted-foreground",
                )}
              >
                {item.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
