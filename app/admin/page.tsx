import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { FileText, FolderKanban, ShoppingBag, Eye } from "lucide-react"
import Link from "next/link"

async function getStats() {
  const supabase = await createClient()

  const [blogsRes, projectsRes, productsRes] = await Promise.all([
    supabase.from("blogs").select("id, published, views", { count: "exact" }),
    supabase.from("projects").select("id", { count: "exact" }),
    supabase.from("products").select("id, active", { count: "exact" }),
  ])

  const blogs = blogsRes.data || []
  const totalViews = blogs.reduce((acc, blog) => acc + (blog.views || 0), 0)
  const publishedBlogs = blogs.filter((b) => b.published).length

  return {
    blogs: blogsRes.count || 0,
    publishedBlogs,
    projects: projectsRes.count || 0,
    products: productsRes.count || 0,
    activeProducts: (productsRes.data || []).filter((p) => p.active).length,
    totalViews,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const cards = [
    {
      title: "Blog Posts",
      value: stats.blogs,
      description: `${stats.publishedBlogs} published`,
      icon: FileText,
      href: "/admin/blogs",
    },
    {
      title: "Projects",
      value: stats.projects,
      description: "Total projects",
      icon: FolderKanban,
      href: "/admin/projects",
    },
    {
      title: "Products",
      value: stats.products,
      description: `${stats.activeProducts} active`,
      icon: ShoppingBag,
      href: "/admin/products",
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      description: "Across all blogs",
      icon: Eye,
      href: "/admin/blogs",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground">Welcome back! Here&apos;s a summary of your content.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.title} href={card.href}>
              <Card className="transition-all hover:border-primary/50 hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link
              href="/admin/blogs/new"
              className="flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:bg-accent"
            >
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Create New Blog Post</p>
                <p className="text-sm text-muted-foreground">Write and publish a new article</p>
              </div>
            </Link>
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:bg-accent"
            >
              <FolderKanban className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Add New Project</p>
                <p className="text-sm text-muted-foreground">Showcase your latest work</p>
              </div>
            </Link>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:bg-accent"
            >
              <ShoppingBag className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Add New Product</p>
                <p className="text-sm text-muted-foreground">List a new digital product</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest content updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Activity tracking coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
