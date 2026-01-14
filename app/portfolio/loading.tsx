import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-9 w-9 rounded" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        {/* Page Header Skeleton */}
        <div className="mb-12 space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </div>

        {/* Table Skeleton */}
        <div className="space-y-4">
          <div className="flex gap-4 py-4 border-b border-border/60">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48 hidden md:block" />
            <Skeleton className="h-4 w-16 ml-auto" />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-4 border-b border-border/40">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32 hidden md:block" />
              <Skeleton className="h-4 w-16 ml-auto" />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
