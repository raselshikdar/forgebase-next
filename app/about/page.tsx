import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Briefcase, GraduationCap, Heart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about my journey, skills, and experience as a developer.",
}

const skills = [
  { category: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { category: "Backend", items: ["Node.js", "Python", "PostgreSQL", "Redis", "GraphQL"] },
  { category: "Tools & Platforms", items: ["Git", "Docker", "AWS", "Vercel", "Supabase"] },
  { category: "Soft Skills", items: ["Problem Solving", "Communication", "Team Leadership", "Agile/Scrum"] },
]

const experience = [
  {
    title: "Senior Full-Stack Developer",
    company: "Tech Innovations Inc.",
    period: "2023 - Present",
    description:
      "Leading development of enterprise applications, mentoring junior developers, and architecting scalable solutions.",
  },
  {
    title: "Full-Stack Developer",
    company: "Digital Solutions Co.",
    period: "2021 - 2023",
    description: "Built and maintained multiple client projects using React and Node.js, improving performance by 40%.",
  },
  {
    title: "Frontend Developer",
    company: "Creative Agency",
    period: "2019 - 2021",
    description:
      "Developed responsive web applications and collaborated with designers to implement pixel-perfect interfaces.",
  },
]

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="border-b border-border/40 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <Badge variant="secondary" className="mb-4">
                About Me
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Hi, I&apos;m <span className="text-primary">Rasel</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                A passionate full-stack developer with over 5 years of experience building web applications that solve
                real-world problems.
              </p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>Based in Dhaka, Bangladesh</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  <span>Open to opportunities</span>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/contact">
                    Get in Touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/resume.pdf" download>
                    Download Resume
                  </a>
                </Button>
              </div>
            </div>
            <div className="order-1 flex justify-center md:order-2">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-2xl" />
                <Image
                  src="/professional-developer-portrait.png"
                  alt="Profile"
                  width={400}
                  height={400}
                  className="relative rounded-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="border-b border-border/40 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">My Story</h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              My journey into programming began when I was 15, tinkering with HTML and CSS to customize my blog. What
              started as curiosity quickly became a passion that has driven my career ever since.
            </p>
            <p>
              After completing my Computer Science degree, I dove headfirst into the world of web development. I&apos;ve
              had the privilege of working with startups, agencies, and enterprise companies, each experience teaching
              me something new about building great software.
            </p>
            <p>
              Today, I focus on creating full-stack applications using modern technologies like Next.js, TypeScript, and
              Supabase. I believe in writing clean, maintainable code and building products that genuinely help people.
            </p>
            <p>
              When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing to open-source
              projects, or sharing my knowledge through blog posts and mentoring.
            </p>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="border-b border-border/40 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Skills & Technologies</h2>
          <p className="mt-2 text-muted-foreground">Technologies I work with on a daily basis</p>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {skills.map((skill) => (
              <div key={skill.category}>
                <h3 className="mb-4 font-semibold">{skill.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="border-b border-border/40 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Experience</h2>
          <p className="mt-2 text-muted-foreground">My professional journey</p>
          <div className="mt-10 space-y-8">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="relative pl-8 before:absolute before:left-0 before:top-2 before:h-2 before:w-2 before:rounded-full before:bg-primary"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">{exp.title}</h3>
                  <span className="text-muted-foreground">at</span>
                  <span className="font-medium text-primary">{exp.company}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{exp.period}</p>
                <p className="mt-2 text-muted-foreground">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">What I Value</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-card-foreground">Quality Over Quantity</h3>
              <p className="text-sm text-muted-foreground">
                I believe in doing fewer things exceptionally well rather than many things poorly.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-card-foreground">Continuous Learning</h3>
              <p className="text-sm text-muted-foreground">
                Technology evolves rapidly. I stay curious and embrace new challenges every day.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="mb-4 rounded-lg bg-primary/10 p-3 w-fit">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-card-foreground">User-Centric Approach</h3>
              <p className="text-sm text-muted-foreground">
                Great software solves real problems. I always keep the end user in mind.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
