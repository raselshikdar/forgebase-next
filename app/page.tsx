import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import type { Blog, Project, Product } from "@/lib/types"
import { HeroSection } from "@/components/home/hero-section"
import { AboutSection } from "@/components/home/about-section"
import { SkillsSection } from "@/components/home/skills-section"
import { ProjectsSection } from "@/components/home/projects-section"
import { BlogPreview } from "@/components/home/blog-preview"
import { StorePreview } from "@/components/home/store-preview"
import { ContactSection } from "@/components/home/contact-section"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
// import { BackToTop } from "@/components/ui/back-to-top"

export const revalidate = 60 // Revalidate every 60 seconds

async function getData() {
  const supabase = await createClient()

  try {
    const [projectsRes, blogsRes, productsRes] = await Promise.all([
      supabase.from("projects").select("*").eq("featured", true).order("display_order").limit(6),
      supabase.from("blogs").select("*").eq("published", true).order("created_at", { ascending: false }).limit(4),
      supabase.from("products").select("*").eq("featured", true).eq("active", true).limit(4),
    ])

    // Check for table not found errors (PGRST205)
    const errors = [projectsRes.error, blogsRes.error, productsRes.error].filter(Boolean)

    if (errors.some((err) => err?.code === "PGRST205")) {
      // Tables don't exist - return empty data with flag
      return {
        projects: [] as Project[],
        blogs: [] as Blog[],
        products: [] as Product[],
        needsSetup: true,
      }
    }

    return {
      projects: (projectsRes.data || []) as Project[],
      blogs: (blogsRes.data || []) as Blog[],
      products: (productsRes.data || []) as Product[],
      needsSetup: false,
    }
  } catch (error) {
    console.error("Data fetch error:", error)
    return {
      projects: [] as Project[],
      blogs: [] as Blog[],
      products: [] as Product[],
      needsSetup: false,
    }
  }
}

function SectionSkeleton({ height = "h-96" }: { height?: string }) {
  return (
    <div className={`${height} animate-pulse rounded-lg mx-6`}>
      <div className="h-full bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20 rounded-lg" />
    </div>
  )
}

export default async function HomePage() {
  const { projects, blogs, products, needsSetup } = await getData()

  if (needsSetup) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="pt-32 px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-8">
              <h1 className="text-3xl font-bold mb-2 text-amber-900 dark:text-amber-100">Database Setup Required</h1>
              <p className="text-amber-800 dark:text-amber-200 mb-6">
                The database tables haven't been initialized yet. Please run the SQL setup scripts to get started.
              </p>
              <a
                href="/setup"
                className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Go to Setup
              </a>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <HeroSection />

        <Suspense fallback={<SectionSkeleton height="h-64" />}>
          <AboutSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton height="h-48" />}>
          <SkillsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ProjectsSection projects={projects} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <BlogPreview blogs={blogs} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <StorePreview products={products} />
        </Suspense>

        <ContactSection />
      </main>

      <SiteFooter />

            {/* <BackToTop /> */}
    </div>
  )
}
