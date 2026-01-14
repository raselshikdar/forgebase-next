"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGalleryQuote, deleteGalleryQuote } from "@/lib/actions/gallery"
import { Trash2, Plus, Quote } from "lucide-react"
import type { GalleryQuote } from "@/lib/types"

export function GalleryQuotesManager({ quotes: initialQuotes }: { quotes: GalleryQuote[] }) {
  const [quotes, setQuotes] = useState(initialQuotes)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ quote: "", author: "", source: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.quote) return

    setLoading(true)
    try {
      await createGalleryQuote(form)
      setQuotes([
        ...quotes,
        {
          ...form,
          id: Date.now().toString(),
          display_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      setForm({ quote: "", author: "", source: "" })
      setIsAdding(false)
    } catch (error) {
      console.error("Failed to create quote:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this quote?")) return
    try {
      await deleteGalleryQuote(id)
      setQuotes(quotes.filter((q) => q.id !== id))
    } catch (error) {
      console.error("Failed to delete quote:", error)
    }
  }

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Quote
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
          <div>
            <Label>Quote *</Label>
            <Textarea
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
              rows={3}
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Author (optional)</Label>
              <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
            </div>
            <div>
              <Label>Source (optional)</Label>
              <Input
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                placeholder="Book, Speech, etc."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Quote"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {quotes.map((quote) => (
          <div key={quote.id} className="flex items-start gap-4 p-3 border rounded-lg">
            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Quote className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm italic line-clamp-2">"{quote.quote}"</p>
              {quote.author && <p className="text-xs text-muted-foreground mt-1">— {quote.author}</p>}
            </div>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(quote.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
