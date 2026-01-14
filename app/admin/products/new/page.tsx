import { ProductForm } from "@/components/admin/product-form"

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Add New Product</h2>
        <p className="text-muted-foreground">Create a new digital product for your store</p>
      </div>

      <ProductForm />
    </div>
  )
}
