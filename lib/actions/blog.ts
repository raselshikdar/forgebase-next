"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function incrementBlogViews(slug: string) {
  const supabase = await createClient()

  const { data: blog } = await supabase.from("blogs").select("id, views").eq("slug", slug).single()

  if (blog) {
    const { error: rpcError } = await supabase.rpc("increment_blog_views", { blog_id: blog.id })

    // Fallback: direct update if RPC fails
    if (rpcError) {
      await supabase
        .from("blogs")
        .update({ views: (blog.views || 0) + 1 })
        .eq("id", blog.id)
    }
  }
}

export async function toggleBlogLike(blogId: string, sessionId: string) {
  const supabase = await createClient()

  // Check if already liked
  const { data: existingLike } = await supabase
    .from("blog_likes")
    .select("id")
    .eq("blog_id", blogId)
    .eq("session_id", sessionId)
    .single()

  if (existingLike) {
    // Unlike
    await supabase.from("blog_likes").delete().eq("id", existingLike.id)
    revalidatePath("/blog")
    return { liked: false }
  } else {
    // Like
    await supabase.from("blog_likes").insert({ blog_id: blogId, session_id: sessionId })
    revalidatePath("/blog")
    return { liked: true }
  }
}

export async function checkBlogLiked(blogId: string, sessionId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("blog_likes")
    .select("id")
    .eq("blog_id", blogId)
    .eq("session_id", sessionId)
    .single()

  return !!data
}

export async function trackBlogShare(blogId: string, platform: string) {
  const supabase = await createClient()
  await supabase.from("blog_shares").insert({ blog_id: blogId, platform })
  revalidatePath("/blog")
}

export async function submitBlogComment(blogId: string, authorName: string, content: string, authorEmail?: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("blog_comments").insert({
    blog_id: blogId,
    author_name: authorName,
    author_email: authorEmail || null,
    content,
    approved: true, // Auto-approve comments
  })

  if (error) throw error
  revalidatePath("/blog")
  return { success: true, message: "Comment posted successfully" }
}

export async function getBlogComments(blogId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("blog_comments")
    .select("*")
    .eq("blog_id", blogId)
    .order("created_at", { ascending: true })

  return data || []
}

export async function updateCommentApproval(commentId: string, approved: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from("blog_comments").update({ approved }).eq("id", commentId)

  if (error) throw error
  revalidatePath("/admin/comments")
  revalidatePath("/blog")
  return { success: true }
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("blog_comments").delete().eq("id", commentId)

  if (error) throw error
  revalidatePath("/admin/comments")
  revalidatePath("/blog")
  return { success: true }
}

export async function getAllComments() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("blog_comments")
    .select("*, blogs(title, slug)")
    .order("created_at", { ascending: false })

  return data || []
}

export async function getBlogCommentCount(blogId: string) {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("blog_comments")
    .select("id", { count: "exact", head: true })
    .eq("blog_id", blogId)
    .eq("approved", true)

  if (error) return 0
  return count || 0
}

export async function getBlogLikesCount(blogId: string) {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("blog_likes")
    .select("id", { count: "exact", head: true })
    .eq("blog_id", blogId)

  if (error) return 0
  return count || 0
}

export async function getBlogSharesCount(blogId: string) {
  const supabase = await createClient()
  const { count, error } = await supabase
    .from("blog_shares")
    .select("id", { count: "exact", head: true })
    .eq("blog_id", blogId)

  if (error) return 0
  return count || 0
}

export async function submitCommentReply(commentId: string, authorName: string, content: string, authorEmail?: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("comment_replies").insert({
    comment_id: commentId,
    author_name: authorName,
    author_email: authorEmail || null,
    content,
    approved: true,
  })

  if (error) throw error
  revalidatePath("/blog")
  return { success: true }
}

export async function getCommentReplies(commentId: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from("comment_replies")
    .select("*")
    .eq("comment_id", commentId)
    .eq("approved", true)
    .order("created_at", { ascending: true })

  return data || []
}

export async function deleteCommentReply(replyId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("comment_replies").delete().eq("id", replyId)

  if (error) throw error
  revalidatePath("/admin/comments")
  revalidatePath("/blog")
  return { success: true }
}

export async function updateReplyApproval(replyId: string, approved: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from("comment_replies").update({ approved }).eq("id", replyId)

  if (error) throw error
  revalidatePath("/admin/comments")
  revalidatePath("/blog")
  return { success: true }
}
