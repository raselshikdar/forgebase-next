import { Skeleton } from "@/components/ui/skeleton"

export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <div className="h-16 border-b border-border/40" />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <Skeleton className="h-4 w-32 mx-auto mb-6" />
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          {/* About Section */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          </section>

          {/* Photos Section */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
