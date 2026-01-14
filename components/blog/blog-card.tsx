"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, ArrowRight, Heart, MessageCircle, Eye, Share2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Blog, BlogTag } from "@/lib/types"
import { toggleBlogLike, trackBlogShare, checkBlogLiked } from "@/lib/actions/blog"
import { cn } from "@/lib/utils"

interface BlogCardProps {
  blog: Blog & { tags: BlogTag[] }
  featured?: boolean
}

function getSessionId() {
  if (typeof window === "undefined") return ""
  let sessionId = localStorage.getItem("blog_session_id")
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem("blog_session_id", sessionId)
  }
  return sessionId
}

export function BlogCard({ blog, featured = false }: BlogCardProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(blog.likes_count || 0)
  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    const sessionId = getSessionId()
    if (sessionId) {
      checkBlogLiked(blog.id, sessionId).then(setLiked)
    }
  }, [blog.id])

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLiking) return

    setIsLiking(true)
    const sessionId = getSessionId()

    try {
      const result = await toggleBlogLike(blog.id, sessionId)
      setLiked(result.liked)
      setLikesCount((prev) => (result.liked ? prev + 1 : prev - 1))
    } catch (error) {
      console.error("Failed to toggle like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = async (platform: string) => {
    const url = `${window.location.origin}/blog/${blog.slug}`
    const title = blog.title

    await trackBlogShare(blog.id, platform)

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          "_blank",
        )
        break
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        break
    }
  }

  return (
    <article
      className={cn(
        "group bg-card rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300",
        featured
          ? "border-2 border-amber-500/30 hover:border-amber-500/60"
          : "border border-border/40 hover:border-primary/50",
      )}
    >
      <Link href={`/blog/${blog.slug}`} className="block">
        <div className="aspect-[16/10] overflow-hidden">
          <Image
            src={blog.cover_image || "/placeholder.svg?height=250&width=400&query=blog article cover"}
            alt={blog.title}
            width={400}
            height={250}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>
      <div className="p-5">
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 2).map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.tag}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(blog.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Badge variant="outline" className="text-xs">
            {blog.category}
          </Badge>
        </div>
        <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
        </h2>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">{blog.excerpt}</p>

        {/* Interaction Row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Read Article
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <div className="flex items-center gap-1">
            {/* Views */}
            <span className="flex items-center gap-1 text-sm text-muted-foreground px-2">
              <Eye className="h-4 w-4" />
              {blog.views || 0}
            </span>

            {/* Like Button */}
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-8 px-2 gap-1 text-sm", liked && "text-red-500")}
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className={cn("h-4 w-4", liked && "fill-current")} />
              {likesCount}
            </Button>

            {/* Comments */}
            <Link href={`/blog/${blog.slug}#comments`}>
              <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-sm">
                <MessageCircle className="h-4 w-4" />
                {blog.comments_count || 0}
              </Button>
            </Link>

            {/* Share */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleShare("twitter")}>Share on Twitter</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("facebook")}>Share on Facebook</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("linkedin")}>Share on LinkedIn</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleShare("copy")}>Copy Link</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </article>
  )
}
