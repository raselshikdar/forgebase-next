import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, Github, Home } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/server"
import type { Project } from "@/lib/types"

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string) {
  const supabase = await createClient()
  const { data } = await supabase.from("projects").select("*").eq("slug", slug).single()
  return data as Project | null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    return { title: "Project Not Found" }
  }

  return {
    title: project.title,
    description: project.description || `View the ${project.title} project`,
    openGraph: {
      title: project.title,
      description: project.description || undefined,
      images: project.cover_image ? [project.cover_image] : undefined,
    },
  }
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params
  const project = await getProject(slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <Home className="h-5 w-5" />
            </Link>
            <span className="text-border">/</span>
            <Link
              href="/portfolio"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Portfolio
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-16">
        {/* Project Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {project.featured && <Badge variant="default">Featured</Badge>}
            <span className="text-sm font-mono text-muted-foreground">
              {new Date(project.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{project.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{project.description}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tech_stack?.map((tech) => (
              <Badge key={tech} variant="secondary">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-4">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary font-mono text-sm rounded hover:bg-primary/10 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                View Live
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground font-mono text-sm rounded hover:bg-card transition-colors"
              >
                <Github className="h-4 w-4" />
                Source Code
              </a>
            )}
          </div>
        </header>

        {/* Project Image */}
        <div className="mb-12 -mx-6 sm:mx-0">
          <Image
            src={project.cover_image || "/placeholder.svg?height=600&width=1200&query=project screenshot"}
            alt={project.title}
            width={1200}
            height={600}
            className="w-full rounded-none sm:rounded-lg object-cover border border-border"
            priority
          />
        </div>

        {/* Project Content */}
        {project.content && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: project.content }} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Back to Portfolio
          </Link>
        </div>
      </footer>
    </div>
  )
}
