import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"

interface ProjectsSectionProps {
  projects: Project[]
}

const mockProjects = [
  {
    id: "1",
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    description: "A modern e-commerce solution with real-time inventory, secure payments, and admin dashboard.",
    cover_image: "/ecommerce-shopping-platform-dashboard.jpg",
    tech_stack: ["Next.js", "Stripe", "Prisma"],
    github_url: "https://github.com",
    live_url: "https://example.com",
    featured: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "AI Chat Application",
    slug: "ai-chat-app",
    description: "Real-time chat application powered by GPT-4 with conversation history and user authentication.",
    cover_image: "/ai-chatbot-application-interface.jpg",
    tech_stack: ["React", "OpenAI", "Socket.io"],
    github_url: "https://github.com",
    live_url: "https://example.com",
    featured: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Analytics Dashboard",
    slug: "analytics-dashboard",
    description: "Beautiful analytics dashboard with real-time data visualization and customizable widgets.",
    cover_image: "/analytics-dashboard-charts-graphs.jpg",
    tech_stack: ["Vue.js", "D3.js", "Node.js"],
    github_url: "https://github.com",
    live_url: "https://example.com",
    featured: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Real-time Dashboard",
    slug: "realtime-dashboard",
    description: "A real-time monitoring dashboard with live data visualization and alerting system.",
    cover_image: "/realtime-monitoring-system-dashboard.jpg",
    tech_stack: ["React", "WebSocket", "Redis"],
    github_url: "https://github.com",
    live_url: "https://example.com",
    featured: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const displayProjects = projects.length > 0 ? projects.slice(0, 4) : mockProjects

  return (
    <section id="projects" className="py-14">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <p className="text-primary font-medium mb-2 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-primary" />
            My Work
            <span className="w-6 h-px bg-primary" />
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Featured Projects</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
            A selection of projects showcasing my skills in full-stack development.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {displayProjects.map((project) => (
            <article
              key={project.id}
              className="group relative bg-card rounded-lg border border-border/40 overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary/60"
            >
              {/* Project Image with proper cover_image */}
              <div className="aspect-[16/9] overflow-hidden">
                <Image
                  src={
                    project.cover_image ||
                    `/placeholder.svg?height=250&width=400&query=${encodeURIComponent(project.title + " project") || "/placeholder.svg"}`
                  }
                  alt={project.title}
                  width={400}
                  height={250}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{project.description}</p>

                {/* Tech Stack */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {project.tech_stack?.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-md font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="mt-3 flex items-center gap-2.5">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="GitHub Repository"
                    >
                      <Github className="h-3.5 w-3.5" />
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
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
            <Link href="/portfolio">
              View All Projects
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
