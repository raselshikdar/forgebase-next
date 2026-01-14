"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Photos
export async function getGalleryPhotos() {
  const supabase = await createClient()
  const { data } = await supabase.from("gallery_photos").select("*").order("display_order", { ascending: true })
  return data || []
}

export async function createGalleryPhoto(data: {
  title?: string
  description?: string
  image_url: string
  category?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("gallery_photos").insert(data)
  if (error) throw error
  revalidatePath("/gallery")
  revalidatePath("/admin/gallery")
  return { success: true }
}

export async function deleteGalleryPhoto(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("gallery_photos").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/gallery")
  revalidatePath("/admin/gallery")
  return { success: true }
}

// Videos
export async function getGalleryVideos() {
  const supabase = await createClient()
  const { data } = await supabase.from("gallery_videos").select("*").order("display_order", { ascending: true })
  return data || []
}

export async function createGalleryVideo(data: {
  title: string
  description?: string
  youtube_url: string
}) {
  const supabase = await createClient()
  // Extract video ID and create thumbnail
  const videoId = extractYouTubeId(data.youtube_url)
  const thumbnail_url = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null

  const { error } = await supabase.from("gallery_videos").insert({
    ...data,
    thumbnail_url,
  })
  if (error) throw error
  revalidatePath("/gallery")
  revalidatePath("/admin/gallery")
  return { success: true }
}

export async function deleteGalleryVideo(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("gallery_videos").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/gallery")
  revalidatePath("/admin/gallery")
  return { success: true }
}

// Audios
export async function getGalleryAudios() {
  const supabase = await createClient()
  const { data } = await supabase.from("gallery_audios").select("*").order("display_order", { ascending: true })
  return data || []
}

export async function createGalleryAudio(data: {
  title: string
  description?: string
  audio_url: string
  cover_image?: string
  duration?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("gallery_audios").insert(data)
  if (error) throw error
  revalidatePath("/gallery")
  revalidatePath("/admin/gallery")
  return { success: true }
}

export async function deleteGalleryAudio(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("gallery_audios").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/gallery")
  revalidatePath("/admin/gallery")
  return { success: true }
}

// Notes
export async function getGalleryNotes() {
  const supabase = await createClient()
  const { data } = await supabase.from("gallery_notes").select("*").order("display_order", { ascending: true })
  return data || []
}

export async function createGalleryNote(data: {
  title: string
  content: string
  category?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("gallery_notes").insert(data)
  if (error) throw error
  revalidatePath("/gallery")
  revalidatePath("/admin/gallery")
  return { success: true }
}

export async function deleteGalleryNote(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("gallery_notes").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/gallery")
  revalidatePath("/admin/gallery")
  return { success: true }
}

// Quotes
export async function getGalleryQuotes() {
  const supabase = await createClient()
  const { data } = await supabase.from("gallery_quotes").select("*").order("display_order", { ascending: true })
  return data || []
}

export async function createGalleryQuote(data: {
  quote: string
  author?: string
  source?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("gallery_quotes").insert(data)
  if (error) throw error
  revalidatePath("/gallery")
  revalidatePath("/admin/gallery")
  return { success: true }
}

export async function deleteGalleryQuote(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("gallery_quotes").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/gallery")
  revalidatePath("/admin/gallery")
  return { success: true }
}

// About Details
export async function getAboutDetails() {
  const supabase = await createClient()
  const { data } = await supabase.from("about_details").select("*").order("display_order", { ascending: true })
  return data || []
}

export async function createAboutDetail(data: {
  section_title: string
  content: string
  icon?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from("about_details").insert(data)
  if (error) throw error
  revalidatePath("/gallery")
  revalidatePath("/admin/gallery")
  return { success: true }
}

export async function deleteAboutDetail(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("about_details").delete().eq("id", id)
  if (error) throw error
  revalidatePath("/gallery")
  revalidatePath("/admin/gallery")
  return { success: true }
}

// Helper function to extract YouTube video ID
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}
