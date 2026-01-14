"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, X } from "lucide-react"

export function ReadingModeToggle() {
  const [isReadingMode, setIsReadingMode] = useState(false)

  useEffect(() => {
    if (isReadingMode) {
      document.body.classList.add("reading-mode")
    } else {
      document.body.classList.remove("reading-mode")
    }
    return () => document.body.classList.remove("reading-mode")
  }, [isReadingMode])

  return (
    <Button variant="outline" size="sm" onClick={() => setIsReadingMode(!isReadingMode)} className="gap-2">
      {isReadingMode ? (
        <>
          <X className="h-4 w-4" />
          Exit Focus
        </>
      ) : (
        <>
          <BookOpen className="h-4 w-4" />
          Focus Mode
        </>
      )}
    </Button>
  )
}
