"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGalleryAudio, deleteGalleryAudio } from "@/lib/actions/gallery"
import { Trash2, Plus, Music } from "lucide-react"
import type { GalleryAudio } from "@/lib/types"

export function GalleryAudiosManager({ audios: initialAudios }: { audios: GalleryAudio[] }) {
  const [audios, setAudios] = useState(initialAudios)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", audio_url: "", duration: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.audio_url) return

    setLoading(true)
    try {
      await createGalleryAudio(form)
      setAudios([
        ...audios,
        {
          ...form,
          id: Date.now().toString(),
          cover_image: null,
          display_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      setForm({ title: "", description: "", audio_url: "", duration: "" })
      setIsAdding(false)
    } catch (error) {
      console.error("Failed to create audio:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this audio?")) return
    try {
      await deleteGalleryAudio(id)
      setAudios(audios.filter((a) => a.id !== id))
    } catch (error) {
      console.error("Failed to delete audio:", error)
    }
  }

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Audio
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
          <div>
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>Audio URL *</Label>
            <Input
              value={form.audio_url}
              onChange={(e) => setForm({ ...form, audio_url: e.target.value })}
              placeholder="https://..."
              required
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Duration (optional)</Label>
              <Input
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="3:45"
              />
            </div>
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Audio"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {audios.map((audio) => (
          <div key={audio.id} className="flex items-center gap-4 p-3 border rounded-lg">
            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Music className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{audio.title}</p>
              <p className="text-xs text-muted-foreground">{audio.duration || "Unknown duration"}</p>
            </div>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(audio.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
