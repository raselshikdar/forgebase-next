import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Get all published blogs
  const { data: blogs } = await supabase.from("blogs").select("slug, updated_at").eq("published", true)

  // Get all projects
  const { data: projects } = await supabase.from("projects").select("slug, updated_at")

  // Get all active products
  const { data: products } = await supabase.from("products").select("slug, updated_at").eq("active", true)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://raselsh.vercel.app"

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${baseUrl}/store`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
  ]

  const blogPages =
    blogs?.map((blog) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })) || []

  const projectPages =
    projects?.map((project) => ({
      url: `${baseUrl}/portfolio/${project.slug}`,
      lastModified: new Date(project.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })) || []

  const productPages =
    products?.map((product) => ({
      url: `${baseUrl}/store/${product.slug}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })) || []

  return [...staticPages, ...blogPages, ...projectPages, ...productPages]
}
