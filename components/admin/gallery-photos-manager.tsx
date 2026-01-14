"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/admin/image-upload"
import { createGalleryPhoto, deleteGalleryPhoto } from "@/lib/actions/gallery"
import { Trash2, Plus } from "lucide-react"
import type { GalleryPhoto } from "@/lib/types"

export function GalleryPhotosManager({ photos: initialPhotos }: { photos: GalleryPhoto[] }) {
  const [photos, setPhotos] = useState(initialPhotos)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", image_url: "", category: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.image_url) return

    setLoading(true)
    try {
      await createGalleryPhoto(form)
      setPhotos([
        ...photos,
        {
          ...form,
          id: Date.now().toString(),
          display_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      setForm({ title: "", description: "", image_url: "", category: "" })
      setIsAdding(false)
    } catch (error) {
      console.error("Failed to create photo:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this photo?")) return
    try {
      await deleteGalleryPhoto(id)
      setPhotos(photos.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Failed to delete photo:", error)
    }
  }

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Photo
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
          <div>
            <Label>Image</Label>
            <ImageUpload
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
              bucket="gallery"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Title (optional)</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Category (optional)</Label>
              <Input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g., Travel, Work"
              />
            </div>
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !form.image_url}>
              {loading ? "Saving..." : "Save Photo"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square rounded-lg overflow-hidden bg-muted">
            <Image
              src={photo.image_url || "/placeholder.svg"}
              alt={photo.title || "Photo"}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button size="sm" variant="destructive" onClick={() => handleDelete(photo.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            {photo.title && (
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-xs truncate">{photo.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
