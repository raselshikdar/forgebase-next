"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, X, Save, ArrowLeft, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import type { Blog, BlogTag } from "@/lib/types"
import { RichTextEditor } from "@/components/admin/rich-text-editor"
import { ImageUpload } from "@/components/admin/image-upload"

interface BlogFormProps {
  blog?: Blog & { tags: BlogTag[] }
}

const BLOG_CATEGORIES = [
  "General",
  "Tutorial",
  "News",
  "Review",
  "Guide",
  "Technology",
  "Programming",
  "Web Development",
  "Mobile Development",
  "DevOps",
  "Design",
  "Career",
  "Personal",
  "Opinion",
  "Case Study",
  "Announcement",
]

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState(blog?.title || "")
  const [slug, setSlug] = useState(blog?.slug || "")
  const [excerpt, setExcerpt] = useState(blog?.excerpt || "")
  const [content, setContent] = useState(blog?.content || "")
  const [coverImage, setCoverImage] = useState(blog?.cover_image || "")
  const [published, setPublished] = useState(blog?.published || false)
  const [featured, setFeatured] = useState(blog?.featured || false)
  const [category, setCategory] = useState(blog?.category || "General")
  const [tags, setTags] = useState<string[]>(blog?.tags?.map((t) => t.tag) || [])
  const [tagInput, setTagInput] = useState("")
  const [error, setError] = useState<string | null>(null)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!blog) {
      setSlug(generateSlug(value))
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validation
    if (!title.trim()) {
      setError("Title is required")
      setIsLoading(false)
      return
    }

    if (!slug.trim()) {
      setError("Slug is required")
      setIsLoading(false)
      return
    }

    if (!content.trim()) {
      setError("Content is required")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      if (blog) {
        // Update existing blog
        const { error: updateError } = await supabase
          .from("blogs")
          .update({
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim() || null,
            content: content.trim(),
            cover_image: coverImage || null,
            published,
            featured,
            category,
            updated_at: new Date().toISOString(),
          })
          .eq("id", blog.id)

        if (updateError) {
          console.error("Update error:", updateError)
          throw new Error(updateError.message || "Failed to update post")
        }

        // Update tags
        await supabase.from("blog_tags").delete().eq("blog_id", blog.id)
        if (tags.length > 0) {
          const { error: tagsError } = await supabase
            .from("blog_tags")
            .insert(tags.map((tag) => ({ blog_id: blog.id, tag })))
          if (tagsError) console.error("Tags update error:", tagsError)
        }
      } else {
        // Create new blog
        const { data: newBlog, error: insertError } = await supabase
          .from("blogs")
          .insert({
            title: title.trim(),
            slug: slug.trim(),
            excerpt: excerpt.trim() || null,
            content: content.trim(),
            cover_image: coverImage || null,
            published,
            featured,
            category,
            views: 0,
            likes_count: 0,
            comments_count: 0,
            shares_count: 0,
          })
          .select()
          .single()

        if (insertError) {
          console.error("Insert error:", insertError)
          // Check for specific error types
          if (insertError.code === "23505") {
            throw new Error("A post with this slug already exists. Please use a different slug.")
          }
          throw new Error(insertError.message || "Failed to create post")
        }

        // Add tags
        if (tags.length > 0 && newBlog) {
          const { error: tagsError } = await supabase
            .from("blog_tags")
            .insert(tags.map((tag) => ({ blog_id: newBlog.id, tag })))
          if (tagsError) console.error("Tags insert error:", tagsError)
        }
      }

      router.push("/admin/blogs")
      router.refresh()
    } catch (err) {
      console.error("Form submission error:", err)
      setError(err instanceof Error ? err.message : "An error occurred while saving the post")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                  required
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-medium">
                  Slug
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url-slug"
                  required
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt" className="text-sm font-medium">
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief description of the post"
                  rows={3}
                  className="text-sm"
                />
              </div>

              <RichTextEditor
                label="Content"
                value={content}
                onChange={setContent}
                placeholder="Write your blog post content here..."
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published" className="text-sm">
                  Published
                </Label>
                <Switch id="published" checked={published} onCheckedChange={setPublished} />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured" className="text-sm">
                  Featured
                </Label>
                <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Cover Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload value={coverImage} onChange={setCoverImage} label="" bucket="blog-images" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  className="text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addTag()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={addTag} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1 text-xs">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {blog ? "Update Post" : "Create Post"}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" asChild className="w-full bg-transparent">
              <Link href="/admin/blogs">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
