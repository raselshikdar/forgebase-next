import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ShoppingCart, Star, Download, Tag } from "lucide-react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface StorePreviewProps {
  products: Product[]
}

const mockProducts = [
  {
    id: "1",
    title: "Next.js SaaS Starter Kit",
    slug: "nextjs-saas-starter",
    description: "Complete SaaS boilerplate with auth, payments, and dashboard.",
    price: 79,
    originalPrice: 129,
    cover_image: "/saas-dashboard-template-software.jpg",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sales: 234,
    rating: 4.9,
  },
  {
    id: "2",
    title: "UI Component Library",
    slug: "ui-component-library",
    description: "50+ React components with dark mode support.",
    price: 49,
    originalPrice: 79,
    cover_image: "/react-ui-components-library.jpg",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sales: 567,
    rating: 4.8,
  },
  {
    id: "3",
    title: "Developer Portfolio Template",
    slug: "developer-portfolio",
    description: "Modern portfolio for developers with blog & projects.",
    price: 29,
    originalPrice: 49,
    cover_image: "/developer-portfolio-website-template.jpg",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sales: 891,
    rating: 4.9,
  },
  {
    id: "4",
    title: "Admin Dashboard Template",
    slug: "admin-dashboard-template",
    description: "Beautiful admin dashboard with charts and tables.",
    price: 69,
    originalPrice: 99,
    cover_image: "/admin-dashboard-template-charts.jpg",
    featured: true,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    sales: 156,
    rating: 4.7,
  },
]

export function StorePreview({ products }: StorePreviewProps) {
  const displayProducts = products.length > 0 ? products.slice(0, 4) : mockProducts

  return (
    <section id="store" className="py-14">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
          <div>
            <p className="text-primary font-medium mb-1.5 flex items-center gap-2">
              <span className="w-6 h-px bg-primary" />
              Digital Products
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">From the Store</h2>
          </div>
          <Button variant="outline" size="sm" className="gap-2 w-fit bg-transparent" asChild>
            <Link href="/store">
              Browse Store
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
          {displayProducts.map((product, index) => {
            const mockData = mockProducts[index] || mockProducts[0]
            return (
              <article
                key={product.id}
                className="group bg-card rounded-lg border border-border/40 overflow-hidden hover:border-emerald-500/50 hover:shadow-md transition-all duration-300"
              >
                {/* Product Image with proper cover_image */}
                <div className="aspect-[4/3] overflow-hidden bg-muted/30 relative">
                  <Image
                    src={
                      product.cover_image ||
                      `/placeholder.svg?height=180&width=240&query=${encodeURIComponent(product.title + " product") || "/placeholder.svg"}`
                    }
                    alt={product.title}
                    width={240}
                    height={180}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Discount badge */}
                  {mockData.originalPrice && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-emerald-500 text-white rounded text-[10px] font-bold">
                      <Tag className="h-2.5 w-2.5" />
                      {Math.round((1 - product.price / mockData.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3">
                  {/* Rating & Sales */}
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5">
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span className="font-medium text-foreground">{mockData.rating}</span>
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Download className="h-3 w-3" />
                      {mockData.sales} sales
                    </span>
                  </div>

                  <h3 className="font-semibold text-xs text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                    <Link href={`/store/${product.slug}`}>{product.title}</Link>
                  </h3>

                  <p className="mt-1 text-[10px] text-muted-foreground line-clamp-1">{product.description}</p>

                  {/* Price & CTA */}
                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                        ${product.price}
                      </span>
                      {mockData.originalPrice && (
                        <span className="text-[10px] text-muted-foreground line-through">
                          ${mockData.originalPrice}
                        </span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="h-7 px-2 text-[10px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                      asChild
                    >
                      <Link href={`/store/${product.slug}`}>
                        <ShoppingCart className="h-3 w-3" />
                        Buy
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
