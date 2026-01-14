import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import type { Product } from "@/lib/types"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { ProductSearch } from "@/components/store/product-search"

export const metadata: Metadata = {
  title: "Store",
  description: "Digital products and resources to help you level up.",
}

export const revalidate = 60

async function getProducts() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
  return (data || []) as Product[]
}

export default async function StorePage() {
  const products = await getProducts()

  const featuredProducts = products.filter((product) => product.featured)
  const regularProducts = products.filter((product) => !product.featured)

  const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)))

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-24 animate-fade-in">
        {/* Hero Section */}
        <section className="py-16 bg-card/30 border-b border-border/40">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl">
              <p className="text-primary font-medium mb-2 flex items-center gap-2 text-sm">
                <span className="w-6 h-px bg-primary" />
                Digital Store
              </p>
              <h1 className="page-title text-foreground">Premium Resources</h1>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                High-quality templates, courses, and tools to accelerate your development journey.
              </p>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <ProductSearch products={products} categories={categories} />

        {featuredProducts.length > 0 && (
          <section className="py-12 bg-muted/20">
            <div className="container mx-auto px-6">
              <h2 className="section-title mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                Featured Products
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProducts.map((product) => (
                  <article
                    key={product.id}
                    className="group bg-card rounded-xl border-2 border-amber-500/30 overflow-hidden hover:border-amber-500/60 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted/30">
                      <Badge className="absolute top-3 left-3 z-10 gap-1 text-xs">
                        <Star className="h-3 w-3" />
                        Featured
                      </Badge>
                      <Image
                        src={
                          product.cover_image || "/placeholder.svg?height=400&width=400&query=digital product template"
                        }
                        alt={product.title}
                        width={400}
                        height={400}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {product.category}
                      </Badge>
                      <h2 className="card-title text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        <Link href={`/store/${product.slug}`}>{product.title}</Link>
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                        <Button size="sm" className="gap-1 text-sm" asChild>
                          <Link href={`/store/${product.slug}`}>
                            <ShoppingBag className="h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Products Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            {regularProducts.length > 0 ? (
              <>
                <h2 className="section-title mb-6">All Products</h2>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {regularProducts.map((product) => (
                    <article
                      key={product.id}
                      className="group bg-card rounded-xl border border-border/40 overflow-hidden hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="relative aspect-square overflow-hidden bg-muted/30">
                        <Image
                          src={
                            product.cover_image ||
                            "/placeholder.svg?height=400&width=400&query=digital product template" ||
                            "/placeholder.svg"
                          }
                          alt={product.title}
                          width={400}
                          height={400}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <Badge variant="outline" className="mb-2 text-xs">
                          {product.category}
                        </Badge>
                        <h2 className="card-title text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          <Link href={`/store/${product.slug}`}>{product.title}</Link>
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                          <Button size="sm" className="gap-1 text-sm" asChild>
                            <Link href={`/store/${product.slug}`}>
                              <ShoppingBag className="h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : products.length === 0 ? (
              <div className="text-center py-24 bg-card/50 rounded-xl border border-border/40">
                <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Store coming soon</h3>
                <p className="text-sm text-muted-foreground">Premium products will be available here shortly!</p>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
