import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BlogForm } from "@/components/admin/blog-form"
import type { Blog, BlogTag } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getBlog(id: string) {
  const supabase = await createClient()
  const { data: blog } = await supabase.from("blogs").select("*").eq("id", id).single()

  if (!blog) return null

  const { data: tags } = await supabase.from("blog_tags").select("*").eq("blog_id", id)

  return { ...blog, tags: tags || [] } as Blog & { tags: BlogTag[] }
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params
  const blog = await getBlog(id)

  if (!blog) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Post</h2>
        <p className="text-muted-foreground">Update your blog article</p>
      </div>

      <BlogForm blog={blog} />
    </div>
  )
}
