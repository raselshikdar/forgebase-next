import { Code2, Server, Database, Cloud, Wrench } from "lucide-react"

const skillDomains = [
  {
    title: "Frontend",
    icon: Code2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    strength: "Advanced",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js"],
  },
  {
    title: "Backend",
    icon: Server,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
    strength: "Advanced",
    technologies: ["Node.js", "Python", "REST APIs", "GraphQL", "Express"],
  },
  {
    title: "Database",
    icon: Database,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
    strength: "Advanced",
    technologies: ["PostgreSQL", "MongoDB", "Supabase", "Redis", "Prisma"],
  },
  {
    title: "DevOps",
    icon: Cloud,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    strength: "Intermediate",
    technologies: ["Docker", "AWS", "Vercel", "CI/CD", "GitHub Actions"],
  },
]

const dailyTools = ["Git", "GitHub", "VS Code", "Vite", "Figma", "Jest", "Postman", "React Native", "Linux", "npm"]

function getStrengthColor(strength: string): string {
  switch (strength) {
    case "Advanced":
      return "text-emerald-600 dark:text-emerald-400"
    case "Intermediate":
      return "text-amber-600 dark:text-amber-400"
    case "Beginner":
      return "text-blue-600 dark:text-blue-400"
    default:
      return "text-muted-foreground"
  }
}

export function SkillsSection() {
  return (
    <section className="py-16 bg-card/30 border-y border-border/40">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <p className="text-primary font-medium mb-2 flex items-center justify-center gap-2 text-sm">
            <span className="w-6 h-px bg-primary" />
            My Skills
            <span className="w-6 h-px bg-primary" />
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Technologies I Work With</h2>
          <p className="mt-3 text-base text-muted-foreground max-w-lg mx-auto">
            A curated collection of technologies and tools I use to build modern, scalable applications.
          </p>
        </div>

        {/* Skills Domains Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {skillDomains.map((domain) => {
            const Icon = domain.icon
            return (
              <div
                key={domain.title}
                className={`p-5 bg-background rounded-xl border ${domain.borderColor} hover:border-opacity-100 transition-all duration-300 group`}
              >
                {/* Header with icon, title, and strength level */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${domain.bgColor}`}>
                      <Icon className={`h-5 w-5 ${domain.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-foreground">{domain.title}</h3>
                      <p className={`text-xs font-medium ${getStrengthColor(domain.strength)}`}>{domain.strength}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {domain.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={`px-2 py-1 text-xs font-medium rounded-md ${domain.bgColor} ${domain.color} whitespace-nowrap`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-background/50 rounded-xl border border-border/40 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <div className="p-2 rounded-lg bg-muted/50">
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Daily Tools</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {dailyTools.map((tool) => (
                <span
                  key={tool}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
