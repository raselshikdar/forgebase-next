export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image: string | null
  published: boolean
  views: number
  likes_count: number
  comments_count: number
  shares_count: number
  category: string
  featured: boolean
  created_at: string
  updated_at: string
  tags?: BlogTag[]
}

export interface BlogTag {
  id: string
  blog_id: string
  tag: string
  created_at: string
}

export interface BlogLike {
  id: string
  blog_id: string
  user_id: string | null
  session_id: string | null
  created_at: string
}

export interface BlogComment {
  id: string
  blog_id: string
  user_id: string | null
  author_name: string
  author_email: string | null
  content: string
  approved: boolean
  created_at: string
  updated_at: string
}

export interface CommentReply {
  id: string
  comment_id: string
  user_id: string | null
  author_name: string
  author_email: string | null
  content: string
  approved: boolean
  created_at: string
  updated_at: string
}

export interface BlogShare {
  id: string
  blog_id: string
  platform: string
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  cover_image: string | null
  tech_stack: string[]
  live_url: string | null
  github_url: string | null
  featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string | null
  price: number
  cover_image: string | null
  featured: boolean
  active: boolean
  category: string
  external_link: string | null
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  replied: boolean
  reply_message: string | null
  created_at: string
  updated_at: string
}

export interface GalleryPhoto {
  id: string
  title: string | null
  description: string | null
  image_url: string
  category: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface GalleryVideo {
  id: string
  title: string
  description: string | null
  youtube_url: string
  thumbnail_url: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface GalleryAudio {
  id: string
  title: string
  description: string | null
  audio_url: string
  cover_image: string | null
  duration: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface GalleryNote {
  id: string
  title: string
  content: string
  category: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface GalleryQuote {
  id: string
  quote: string
  author: string | null
  source: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface AboutDetail {
  id: string
  section_title: string
  content: string
  icon: string | null
  display_order: number
  created_at: string
  updated_at: string
}
