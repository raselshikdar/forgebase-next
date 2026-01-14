"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Share2, Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toggleBlogLike, trackBlogShare, checkBlogLiked } from "@/lib/actions/blog"
import { cn } from "@/lib/utils"

interface BlogInteractionsProps {
  blogId: string
  initialLikes: number
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

export function BlogInteractions({ blogId, initialLikes }: BlogInteractionsProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikes)
  const [isLiking, setIsLiking] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const sessionId = getSessionId()
    if (sessionId) {
      checkBlogLiked(blogId, sessionId).then(setLiked)
    }
  }, [blogId])

  const handleLike = async () => {
    if (isLiking) return
    setIsLiking(true)
    const sessionId = getSessionId()

    try {
      const result = await toggleBlogLike(blogId, sessionId)
      setLiked(result.liked)
      setLikesCount((prev) => (result.liked ? prev + 1 : prev - 1))
    } catch (error) {
      console.error("Failed to toggle like:", error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = async (platform: string) => {
    const url = window.location.href
    const title = document.title

    await trackBlogShare(blogId, platform)

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
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
    }
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant={liked ? "default" : "outline"}
        size="lg"
        onClick={handleLike}
        disabled={isLiking}
        className={cn("gap-2 transition-all", liked && "bg-red-500 hover:bg-red-600 border-red-500")}
      >
        <Heart className={cn("h-5 w-5", liked && "fill-current")} />
        {likesCount} {likesCount === 1 ? "Like" : "Likes"}
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" className="gap-2 bg-transparent">
            <Share2 className="h-5 w-5" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-48">
          <DropdownMenuItem onClick={() => handleShare("twitter")} className="gap-2">
            <Twitter className="h-4 w-4" />
            Share on Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("facebook")} className="gap-2">
            <Facebook className="h-4 w-4" />
            Share on Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("linkedin")} className="gap-2">
            <Linkedin className="h-4 w-4" />
            Share on LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleShare("copy")} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Link"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
