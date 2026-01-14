"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { submitBlogComment, getBlogComments, submitCommentReply, getCommentReplies } from "@/lib/actions/blog"
import { MessageCircle, Send, CheckCircle, User, Reply, AlertCircle } from "lucide-react"

interface BlogCommentsProps {
  blogId: string
}

interface CommentReply {
  id: string
  author_name: string
  content: string
  created_at: string
}

interface Comment {
  id: string
  author_name: string
  content: string
  created_at: string
  replies: CommentReply[]
}

export function BlogComments({ blogId }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [content, setContent] = useState("")

  const fetchComments = async () => {
    try {
      const data = await getBlogComments(blogId)
      const commentsWithReplies = await Promise.all(
        data.map(async (comment) => {
          try {
            const replies = await getCommentReplies(comment.id)
            return {
              ...comment,
              replies: replies || [],
            }
          } catch (err) {
            console.error("Error fetching replies for comment:", comment.id, err)
            return {
              ...comment,
              replies: [],
            }
          }
        }),
      )
      setComments(commentsWithReplies)
    } catch (err) {
      console.error("Error fetching comments:", err)
      setComments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [blogId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !content.trim()) return

    setSubmitting(true)
    setError(null)

    try {
      if (replyingTo) {
        await submitCommentReply(replyingTo, name, content, email)
      } else {
        // Submit main comment
        await submitBlogComment(blogId, name, content, email)
      }
      setSubmitted(true)
      setName("")
      setEmail("")
      setContent("")
      setReplyingTo(null)
      setTimeout(() => {
        fetchComments()
        setSubmitted(false)
      }, 1500)
    } catch (err) {
      console.error("Failed to submit:", err)
      setError(replyingTo ? "Failed to post reply. Please try again." : "Failed to post comment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div id="comments" className="space-y-8">
      {/* Comment Form */}
      <div className="bg-card/50 rounded-xl border border-border/40 p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          {replyingTo ? "Reply to Comment" : "Leave a Comment"}
        </h3>

        {submitted ? (
          <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 py-4">
            <CheckCircle className="h-5 w-5" />
            <p>{replyingTo ? "Your reply has been posted!" : "Your comment has been posted!"}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                placeholder="Your name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-background"
              />
              <Input
                type="email"
                placeholder="Your email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
              />
            </div>
            <Textarea
              placeholder={replyingTo ? "Write your reply..." : "Write your comment..."}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="bg-background resize-none"
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting} className="gap-2">
                <Send className="h-4 w-4" />
                {submitting
                  ? replyingTo
                    ? "Posting Reply..."
                    : "Posting..."
                  : replyingTo
                    ? "Post Reply"
                    : "Post Comment"}
              </Button>
              {replyingTo && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setReplyingTo(null)
                    setContent("")
                    setError(null)
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">
          {comments.length} {comments.length === 1 ? "Comment" : "Comments"}
        </h4>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-card/30 rounded-xl p-5 animate-pulse border border-border/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-muted rounded-full" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
                <div className="h-3 w-full bg-muted rounded mb-2" />
                <div className="h-3 w-3/4 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id}>
                {/* Main Comment */}
                <div className="bg-card/30 rounded-xl p-5 border border-border/20 hover:border-border/40 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{comment.author_name}</span>
                        <time className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{comment.content}</p>
                      <button
                        onClick={() => {
                          setReplyingTo(comment.id)
                          setError(null)
                        }}
                        className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <Reply className="h-3 w-3" />
                        Reply
                      </button>
                    </div>
                  </div>
                </div>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-8 mt-3 space-y-3 border-l-2 border-border/40 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-card/20 rounded-lg p-4 border border-border/20">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-foreground">{reply.author_name}</span>
                              <time className="text-xs text-muted-foreground">
                                {new Date(reply.created_at).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </time>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-card/20 rounded-xl border border-dashed border-border/40">
            <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  )
}
