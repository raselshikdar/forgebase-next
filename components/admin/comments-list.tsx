"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { updateCommentApproval, deleteComment, updateReplyApproval, deleteCommentReply } from "@/lib/actions/blog"
import { Check, X, Trash2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

interface CommentReply {
  id: string
  author_name: string
  content: string
  approved: boolean
  created_at: string
}

interface Comment {
  id: string
  author_name: string
  author_email: string | null
  content: string
  approved: boolean
  created_at: string
  blogs: {
    title: string
    slug: string
  } | null
  replies?: CommentReply[]
}

export function CommentsList({ comments: initialComments }: { comments: Comment[] }) {
  const [comments, setComments] = useState(initialComments)
  const [loading, setLoading] = useState<string | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    const newSet = new Set(expandedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setExpandedIds(newSet)
  }

  const handleApproval = async (id: string, approved: boolean) => {
    setLoading(id)
    try {
      await updateCommentApproval(id, approved)
      setComments(comments.map((c) => (c.id === id ? { ...c, approved } : c)))
    } catch (error) {
      console.error("Failed to update comment:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return

    setLoading(id)
    try {
      await deleteComment(id)
      setComments(comments.filter((c) => c.id !== id))
    } catch (error) {
      console.error("Failed to delete comment:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleReplyApproval = async (commentId: string, replyId: string, approved: boolean) => {
    setLoading(replyId)
    try {
      await updateReplyApproval(replyId, approved)
      setComments(
        comments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                replies: (c.replies || []).map((r) => (r.id === replyId ? { ...r, approved } : r)),
              }
            : c,
        ),
      )
    } catch (error) {
      console.error("Failed to update reply:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (!confirm("Are you sure you want to delete this reply?")) return

    setLoading(replyId)
    try {
      await deleteCommentReply(replyId)
      setComments(
        comments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                replies: (c.replies || []).filter((r) => r.id !== replyId),
              }
            : c,
        ),
      )
    } catch (error) {
      console.error("Failed to delete reply:", error)
    } finally {
      setLoading(null)
    }
  }

  if (comments.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No comments yet.</div>
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id}>
          <div className="flex gap-4 p-4 rounded-lg border border-border/40 hover:border-border transition-colors">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{comment.author_name}</span>
                <Badge variant={comment.approved ? "default" : "secondary"}>
                  {comment.approved ? "Approved" : "Pending"}
                </Badge>
              </div>
              {comment.blogs && (
                <Link
                  href={`/blog/${comment.blogs.slug}`}
                  target="_blank"
                  className="text-xs text-primary hover:underline flex items-center gap-1 mb-2"
                >
                  On: {comment.blogs.title}
                  <ExternalLink className="h-3 w-3" />
                </Link>
              )}
              <p className="text-sm text-muted-foreground line-clamp-2">{comment.content}</p>
              <p className="text-xs text-muted-foreground/70 mt-2">
                {new Date(comment.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              {(comment.replies || []).length > 0 && (
                <button
                  onClick={() => toggleExpanded(comment.id)}
                  className="text-xs text-primary mt-2 flex items-center gap-1 hover:underline"
                >
                  {expandedIds.has(comment.id) ? (
                    <>
                      <ChevronUp className="h-3 w-3" />
                      Hide {(comment.replies || []).length} replies
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" />
                      Show {(comment.replies || []).length} replies
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {comment.approved ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApproval(comment.id, false)}
                  disabled={loading === comment.id}
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleApproval(comment.id, true)}
                  disabled={loading === comment.id}
                >
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(comment.id)}
                disabled={loading === comment.id}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Replies */}
          {expandedIds.has(comment.id) && (comment.replies || []).length > 0 && (
            <div className="ml-6 mt-2 space-y-2 border-l-2 border-border/40 pl-4">
              {(comment.replies || []).map((reply) => (
                <div key={reply.id} className="flex gap-4 p-3 rounded-lg border border-border/20 bg-card/30">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{reply.author_name}</span>
                      <Badge variant={reply.approved ? "default" : "secondary"} className="text-xs">
                        {reply.approved ? "Approved" : "Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{reply.content}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {new Date(reply.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {reply.approved ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReplyApproval(comment.id, reply.id, false)}
                        disabled={loading === reply.id}
                        className="h-7"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReplyApproval(comment.id, reply.id, true)}
                        disabled={loading === reply.id}
                        className="h-7"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteReply(comment.id, reply.id)}
                      disabled={loading === reply.id}
                      className="h-7"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
