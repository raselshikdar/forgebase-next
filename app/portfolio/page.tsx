import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, Github, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { createClient } from "@/lib/supabase/server"
import type { Project } from "@/lib/types"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Explore my projects and see what I've been building.",
}

export const revalidate = 60

async function getProjects() {
  const supabase = await createClient()
  const { data } = await supabase.from("projects").select("*").order("display_order")
  return (data || []) as Project[]
}

export default async function PortfolioPage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-5xl px-6 py-16 animate-fade-in">
        {/* Page Header - Consistent typography */}
        <div className="mb-12">
          <p className="text-primary font-mono text-sm mb-2">All Projects</p>
          <h1 className="page-title">Portfolio</h1>
          <p className="mt-4 text-base text-muted-foreground max-w-xl leading-relaxed">
            A collection of projects I've built over the years. Each one represents a unique challenge and learning
            experience.
          </p>
        </div>

        {/* Projects Table */}
        {projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="py-4 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Year
                  </th>
                  <th className="py-4 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Project
                  </th>
                  <th className="py-4 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                    Built with
                  </th>
                  <th className="py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-border/40 group">
                    <td className="py-4 pr-4 text-sm font-mono text-muted-foreground">
                      {new Date(project.created_at).getFullYear()}
                    </td>
                    <td className="py-4 pr-4">
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="font-medium text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-2"
                      >
                        {project.title}
                        {project.featured && (
                          <Badge variant="default" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </Link>
                    </td>
                    <td className="py-4 pr-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack?.slice(0, 4).map((tech) => (
                          <span key={tech} className="text-xs text-muted-foreground">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="GitHub"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            aria-label="Live Demo"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <Link
                          href={`/portfolio/${project.slug}`}
                          className="text-muted-foreground hover:text-primary transition-colors"
                          aria-label="View Details"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-base text-muted-foreground">No projects yet. Check back soon!</p>
          </div>
        )}
      </main>

      <div className="min-h-screen bg-background">
  <SiteHeader />

  <main className="mx-auto max-w-5xl px-6 py-16 animate-fade-in">
    {/* portfolio content */}
  </main>

  <SiteFooter />
</div>
  )
}
