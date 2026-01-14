"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Heart, MessageCircle, Share2, Eye } from "lucide-react"
import type { Blog } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toggleBlogLike, trackBlogShare } from "@/lib/actions/blog"

interface BlogPreviewProps {
  blogs: Blog[]
}

const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 15",
    slug: "getting-started-nextjs-15",
    excerpt: "Learn how to build modern web applications with Next.js 15 and its powerful new features.",
    content: "",
    cover_image: "/nextjs-framework-tutorial.jpg",
    published: true,
    views: 150,
    category: "Development",
    likes_count: 24,
    comments_count: 8,
    shares_count: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Building Scalable APIs with Node.js",
    slug: "building-scalable-apis-nodejs",
    excerpt: "A comprehensive guide to building production-ready REST APIs using Node.js and Express.",
    content: "",
    cover_image: "/nodejs-api-backend.jpg",
    published: true,
    views: 89,
    category: "Backend",
    likes_count: 18,
    comments_count: 5,
    shares_count: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Mastering TypeScript for React",
    slug: "mastering-typescript-react",
    excerpt: "Take your React development to the next level with TypeScript best practices and patterns.",
    content: "",
    cover_image: "/typescript-react-programming.jpg",
    published: true,
    views: 234,
    category: "TypeScript",
    likes_count: 42,
    comments_count: 15,
    shares_count: 23,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Modern CSS Techniques for 2024",
    slug: "modern-css-techniques-2024",
    excerpt: "Explore the latest CSS features including container queries, cascade layers, and :has() selector.",
    content: "",
    cover_image: "/modern-css-styling-design.jpg",
    published: true,
    views: 67,
    category: "CSS",
    likes_count: 15,
    comments_count: 3,
    shares_count: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function BlogPreview({ blogs }: BlogPreviewProps) {
  const displayBlogs = blogs.length > 0 ? blogs.slice(0, 4) : mockBlogs

  if (displayBlogs.length === 0) {
    return (
      <section id="blog" className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-primary font-medium mb-2 flex items-center gap-2 text-sm">
                <span className="w-6 h-px bg-primary" />
                From the Blog
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Latest Articles</h2>
            </div>
            <Button variant="outline" size="sm" className="gap-2 w-fit bg-transparent" asChild>
              <Link href="/blog">
                View All Posts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="text-center py-12 text-muted-foreground">No blog posts yet. Check back soon!</div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-primary font-medium mb-2 flex items-center gap-2 text-sm">
              <span className="w-6 h-px bg-primary" />
              From the Blog
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Latest Articles</h2>
          </div>
          <Button variant="outline" size="sm" className="gap-2 w-fit bg-transparent" asChild>
            <Link href="/blog">
              View All Posts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          {displayBlogs.map((blog) => (
            <BlogPreviewCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </section>
  )
}

function BlogPreviewCard({ blog }: { blog: Blog }) {
  const [likes, setLikes] = useState(blog.likes_count || 0)
  const [isLiked, setIsLiked] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLiking) return

    setIsLiking(true)
    try {
      const sessionId = getOrCreateSessionId()
      const result = await toggleBlogLike(blog.id, sessionId)
      setIsLiked(result.liked)
      setLikes((prev) => (result.liked ? prev + 1 : prev - 1))
    } catch (error) {
      console.error("Failed to toggle like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const url = `${window.location.origin}/blog/${blog.slug}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || undefined,
          url,
        })
        await trackBlogShare(blog.id, "native")
      } catch (error) {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url)
      await trackBlogShare(blog.id, "clipboard")
    }
  }

  return (
    <article className="group flex gap-4 bg-background rounded-lg border border-border/40 overflow-hidden hover:border-primary/50 hover:shadow-md transition-all duration-300 p-4">
      <Link href={`/blog/${blog.slug}`} className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={
            blog.cover_image ||
            `/placeholder.svg?height=128&width=128&query=${encodeURIComponent(blog.title + " blog")}`
          }
          alt={blog.title}
          width={128}
          height={128}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Category & Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded font-medium">
            {blog.category || "Article"}
          </span>
          <span>
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h3>

        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 hidden sm:block leading-relaxed">
          {blog.excerpt}
        </p>

        <div className="mt-auto pt-3 flex items-center gap-4 text-xs text-muted-foreground">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 transition-colors group/like ${
              isLiked ? "text-red-500" : "hover:text-red-500"
            }`}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500" : "group-hover/like:fill-red-500/20"}`} />
            <span>{likes}</span>
          </button>
          <Link
            href={`/blog/${blog.slug}#comments`}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>{blog.comments_count || 0}</span>
          </Link>
          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            <span>{blog.views || 0}</span>
          </span>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-primary transition-colors ml-auto"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  )
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return ""
  let sessionId = localStorage.getItem("blog_session_id")
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    localStorage.setItem("blog_session_id", sessionId)
  }
  return sessionId
}
