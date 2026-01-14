import { BlogForm } from "@/components/admin/blog-form"

export default function NewBlogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create New Post</h2>
        <p className="text-muted-foreground">Write and publish a new blog article</p>
      </div>

      <BlogForm />
    </div>
  )
}
