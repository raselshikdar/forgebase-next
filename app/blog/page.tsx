import type { Metadata } from "next"
import { Star } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import type { Blog, BlogTag } from "@/lib/types"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { BlogCard } from "@/components/blog/blog-card"
import { BlogFilters } from "@/components/blog/blog-filters"

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on development, design, and technology.",
}

export const revalidate = 60

async function getBlogs(searchQuery?: string, category?: string) {
  const supabase = await createClient()

  let query = supabase.from("blogs").select("*").eq("published", true).order("created_at", { ascending: false })

  // Apply search filter
  if (searchQuery && searchQuery.trim()) {
    query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
  }

  // Apply category filter
  if (category && category !== "all") {
    query = query.eq("category", category)
  }

  const { data: blogs } = await query

  const { data: tags } = await supabase.from("blog_tags").select("*")

  const blogsWithTags = (blogs || []).map((blog) => ({
    ...blog,
    tags: (tags || []).filter((tag) => tag.blog_id === blog.id),
  }))

  return blogsWithTags as (Blog & { tags: BlogTag[] })[]
}

interface BlogPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
  }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { search = "", category = "all" } = await searchParams
  const blogs = await getBlogs(search, category)

  const featuredBlogs = blogs.filter((blog) => blog.featured)
  const regularBlogs = blogs.filter((blog) => !blog.featured)

  const categories = Array.from(new Set(blogs.map((blog) => blog.category).filter(Boolean)))

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-14 md:pt-18 animate-fade-in">
        {/* Hero Section */}
        <section className="py-16 bg-card/30 border-b border-border/40">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <p className="text-primary font-medium mb-2 flex items-center gap-2 text-sm">
                <span className="w-6 h-px bg-primary" />
                My Blog
              </p>
              <h1 className="page-title text-foreground">Articles & Insights</h1>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Exploring ideas about web development, design patterns, and building great software products.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Section */}
        {featuredBlogs.length > 0 && (
          <section className="py-12 bg-muted/20">
            <div className="container mx-auto px-6">
              <h2 className="section-title mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                Featured Posts
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {featuredBlogs.slice(0, 2).map((blog) => (
                  <BlogCard key={blog.id} blog={blog} featured />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="py-6 border-b border-border/40">
          <div className="container mx-auto px-6">
            <BlogFilters categories={categories} initialSearch={search} initialCategory={category} />
          </div>
        </section>

        {/* Blog Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {blogs.length > 0 ? (
              <>
                <div className="mb-6">
                  <h2 className="section-title">
                    {search ? `Search Results for "${search}"` : category !== "all" ? `${category}` : "All Articles"}
                  </h2>
                  {(search || category !== "all") && (
                    <p className="text-sm text-muted-foreground mt-2">Found {blogs.length} article(s)</p>
                  )}
                </div>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {(regularBlogs.length > 0 ? regularBlogs : blogs).map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-24 bg-card/50 rounded-xl border border-border/40">
                <h3 className="text-xl font-semibold text-foreground mb-2">No articles found</h3>
                <p className="text-sm text-muted-foreground">
                  {search || category !== "all"
                    ? "Try adjusting your search or filters"
                    : "Check back soon for new content!"}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
