import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { SkeletonBlogGrid } from "@/components/ui/skeleton-blog-card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-24">
        {/* Hero Section Skeleton */}
        <section className="py-16 bg-card/30 border-b border-border/40">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-80" />
              <Skeleton className="h-6 w-full max-w-lg" />
            </div>
          </div>
        </section>

        {/* Blog Grid Skeleton */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <Skeleton className="h-8 w-32 mb-6" />
            <SkeletonBlogGrid />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
