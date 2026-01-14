"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createGalleryVideo, deleteGalleryVideo } from "@/lib/actions/gallery"
import { Trash2, Plus, Video } from "lucide-react"
import type { GalleryVideo } from "@/lib/types"

export function GalleryVideosManager({ videos: initialVideos }: { videos: GalleryVideo[] }) {
  const [videos, setVideos] = useState(initialVideos)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", youtube_url: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.youtube_url) return

    setLoading(true)
    try {
      await createGalleryVideo(form)
      setVideos([
        ...videos,
        {
          ...form,
          id: Date.now().toString(),
          thumbnail_url: null,
          display_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      setForm({ title: "", description: "", youtube_url: "" })
      setIsAdding(false)
    } catch (error) {
      console.error("Failed to create video:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return
    try {
      await deleteGalleryVideo(id)
      setVideos(videos.filter((v) => v.id !== id))
    } catch (error) {
      console.error("Failed to delete video:", error)
    }
  }

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Video
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
          <div>
            <Label>Title *</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <Label>YouTube URL *</Label>
            <Input
              value={form.youtube_url}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
              placeholder="https://youtube.com/watch?v=..."
              required
            />
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Video"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {videos.map((video) => (
          <div key={video.id} className="flex items-center gap-4 p-3 border rounded-lg">
            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Video className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{video.title}</p>
              <p className="text-xs text-muted-foreground truncate">{video.youtube_url}</p>
            </div>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(video.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
