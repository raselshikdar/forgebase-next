import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"
import type { Product } from "@/lib/types"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getProduct(id: string) {
  const supabase = await createClient()
  const { data } = await supabase.from("products").select("*").eq("id", id).single()
  return data as Product | null
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Edit Product</h2>
        <p className="text-muted-foreground">Update your product details</p>
      </div>

      <ProductForm product={product} />
    </div>
  )
}
