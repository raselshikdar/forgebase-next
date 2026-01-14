"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createAboutDetail, deleteAboutDetail } from "@/lib/actions/gallery"
import { Trash2, Plus, Info } from "lucide-react"
import type { AboutDetail } from "@/lib/types"

export function AboutDetailsManager({ details: initialDetails }: { details: AboutDetail[] }) {
  const [details, setDetails] = useState(initialDetails)
  const [isAdding, setIsAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ section_title: "", content: "", icon: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.section_title || !form.content) return

    setLoading(true)
    try {
      await createAboutDetail(form)
      setDetails([
        ...details,
        {
          ...form,
          id: Date.now().toString(),
          display_order: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      setForm({ section_title: "", content: "", icon: "" })
      setIsAdding(false)
    } catch (error) {
      console.error("Failed to create detail:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this detail?")) return
    try {
      await deleteAboutDetail(id)
      setDetails(details.filter((d) => d.id !== id))
    } catch (error) {
      console.error("Failed to delete detail:", error)
    }
  }

  return (
    <div className="space-y-6">
      {!isAdding ? (
        <Button onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Detail
        </Button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
          <div>
            <Label>Section Title *</Label>
            <Input
              value={form.section_title}
              onChange={(e) => setForm({ ...form, section_title: e.target.value })}
              placeholder="e.g., Hobbies, Languages"
              required
            />
          </div>
          <div>
            <Label>Content *</Label>
            <Textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={3}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Detail"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {details.map((detail) => (
          <div key={detail.id} className="flex items-start gap-4 p-3 border rounded-lg">
            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Info className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">{detail.section_title}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">{detail.content}</p>
            </div>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(detail.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
