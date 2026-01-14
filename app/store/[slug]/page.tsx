import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Check, Home, ShoppingCart, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase.from("products").select("*").eq("slug", slug).eq("active", true).single()
  return data as Product | null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return { title: "Product Not Found" }
  }

  return {
    title: product.title,
    description: product.description || `Get ${product.title}`,
    openGraph: {
      title: product.title,
      description: product.description || undefined,
      images: product.cover_image ? [product.cover_image] : undefined,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  const features = ["Instant digital download", "Lifetime access", "Free updates", "Premium support"]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-5 w-5" />
            </Link>
            <span className="text-border">/</span>
            <Link
              href="/store"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Store
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Product Image */}
          <div className="overflow-hidden rounded-lg border border-border">
            <Image
              src={product.cover_image || "/placeholder.svg?height=600&width=600&query=digital product"}
              alt={product.title}
              width={600}
              height={600}
              className="w-full object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.featured && (
              <Badge variant="default" className="mb-4 w-fit">
                Featured Product
              </Badge>
            )}
            <Badge variant="outline" className="mb-4 w-fit text-xs">
              {product.category}
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{product.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{product.description}</p>

            <div className="mt-8">
              <span className="text-4xl font-bold text-primary font-mono">${product.price.toFixed(2)}</span>
            </div>

            <div className="mt-10">
              <h3 className="mb-4 font-semibold">What's included:</h3>
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-muted-foreground">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10">
              {product.external_link ? (
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <a href={product.external_link} target="_blank" rel="noopener noreferrer">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Buy Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : (
                <Button size="lg" className="w-full sm:w-auto">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Purchase Now
                </Button>
              )}
              <p className="mt-3 text-sm text-muted-foreground">
                {product.external_link
                  ? "You'll be redirected to our secure checkout."
                  : "Secure checkout. 30-day money-back guarantee."}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Link href="/store" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Back to Store
          </Link>
        </div>
      </footer>
    </div>
  )
}
