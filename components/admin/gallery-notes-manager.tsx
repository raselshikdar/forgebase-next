"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGalleryNote, deleteGalleryNote } from "@/lib/actions/gallery"
import { Trash2, Plus, StickyNote } from "lucide-react"
import type { GalleryNote } from "@/lib/types"

export function GalleryNotesManager({ notes: initialNotes }: { notes: GalleryNote[] }) {
  const [notes, setNotes] = useState(initialNotes)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: "", content: "", category: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.content) return

    setLoading(true)
    try {
      await createGalleryNote(form)
      setNotes([
        ...notes,
        {
          ...form,
          id: Date.now().toString(),
          display_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      setForm({ title: "", content: "", category: "" })
      setIsAdding(false)
    } catch (error) {
      console.error("Failed to create note:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this note?")) return
    try {
      await deleteGalleryNote(id)
      setNotes(notes.filter((n) => n.id !== id))
    } catch (error) {
      console.error("Failed to delete note:", error)
    }
  }

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
              <Label>Category (optional)</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g., Personal, Tech"
              />
            </div>
          </div>
          <div>
            <Label>Content *</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Note"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="flex items-start gap-4 p-3 border rounded-lg">
            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
              <StickyNote className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{note.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
            </div>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(note.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
