import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Eye, Home, Heart, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/server"
import type { Blog, BlogTag } from "@/lib/types"
import { ViewCounter } from "@/components/blog/view-counter"
import { ReadingProgress } from "@/components/blog/reading-progress"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { BlogComments } from "@/components/blog/blog-comments"
import { ReadingModeToggle } from "@/components/blog/reading-mode-toggle"
import { BlogInteractions } from "@/components/blog/blog-interactions"

export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getBlog(slug: string) {
  const supabase = await createClient()
  const { data: blog } = await supabase.from("blogs").select("*").eq("slug", slug).eq("published", true).single()

  if (!blog) return null

  const { data: tags } = await supabase.from("blog_tags").select("*").eq("blog_id", blog.id)

  return { ...blog, tags: tags || [] } as Blog & { tags: BlogTag[] }
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function addHeadingIds(content: string): string {
  let index = 0
  return content.replace(/<(h[23])([^>]*)>([^<]*)<\/h[23]>/gi, (match, tag, attrs, text) => {
    const id = attrs.includes("id=") ? attrs : ` id="heading-${index++}"`
    return `<${tag}${id}${attrs}>${text}</${tag}>`
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    return { title: "Post Not Found" }
  }

  return {
    title: blog.title,
    description: blog.excerpt || `Read ${blog.title}`,
    openGraph: {
      title: blog.title,
      description: blog.excerpt || undefined,
      type: "article",
      publishedTime: blog.created_at,
      modifiedTime: blog.updated_at,
      images: blog.cover_image ? [blog.cover_image] : undefined,
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  const readTime = calculateReadTime(blog.content)
  const contentWithIds = addHeadingIds(blog.content)

  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <ViewCounter slug={slug} />

      {/* Refined Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Home className="h-4 w-4" />
            </Link>
            <span className="text-border/60">/</span>
            <Link
              href="/blog"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Blog
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <ReadingModeToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section with Cover Image */}
      {blog.cover_image && (
        <div className="relative h-[40vh] min-h-[300px] max-h-[500px] w-full overflow-hidden">
          <Image src={blog.cover_image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6">
        <div className="lg:grid lg:grid-cols-[1fr_200px] lg:gap-12">
          {/* Main Content */}
          <article className={`max-w-3xl ${blog.cover_image ? "-mt-32 relative z-10" : "pt-16"}`}>
            {/* Article Header */}
            <header className="mb-10">
              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="bg-primary/10 text-primary border-0 hover:bg-primary/20"
                    >
                      {tag.tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance leading-tight">
                {blog.title}
              </h1>

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="mt-5 text-lg sm:text-xl text-muted-foreground text-pretty leading-relaxed">
                  {blog.excerpt}
                </p>
              )}

              {/* Meta Info Bar */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground border-y border-border/40 py-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-xs">RS</span>
                  </div>
                  <span className="font-medium text-foreground">Rasel Shikdar</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <time>
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>{readTime} min read</span>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-4 w-4" />
                    {blog.views}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4" />
                    {blog.likes_count || 0}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="h-4 w-4" />
                    {blog.comments_count || 0}
                  </span>
                </div>
              </div>
            </header>

            {/* Article Content - Enhanced Prose */}
            <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: contentWithIds }} />

            {/* Interaction Bar */}
            <div className="mt-12 pt-8 border-t border-border/40">
              <BlogInteractions blogId={blog.id} initialLikes={blog.likes_count || 0} />
            </div>

            {/* Author Card */}
            <div className="mt-12 p-6 bg-card/50 rounded-2xl border border-border/40">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">RS</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Written by Rasel Shikdar</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Full-Stack Developer & Creator based in Dhaka, Bangladesh. Passionate about building accessible,
                    performant, and beautiful web applications.
                  </p>
                  <Link href="/gallery" className="text-sm text-primary hover:underline mt-2 inline-block">
                    Learn more about me
                  </Link>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <section className="mt-16 pt-12 border-t border-border/40">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <MessageCircle className="h-6 w-6 text-primary" />
                Discussion
              </h2>
              <BlogComments blogId={blog.id} />
            </section>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block pt-16">
            <div className="sticky top-24">
              <TableOfContents content={contentWithIds} />
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 mt-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all articles
          </Link>
        </div>
      </footer>
    </div>
  )
}
