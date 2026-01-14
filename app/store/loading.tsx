import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { Skeleton } from "@/components/ui/skeleton"

function SkeletonProductCard() {
  return (
    <div className="bg-card rounded-xl border border-border/40 overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  )
}

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
              <Skeleton className="h-12 w-64" />
              <Skeleton className="h-6 w-full max-w-lg" />
            </div>
          </div>
        </section>

        {/* Products Grid Skeleton */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
