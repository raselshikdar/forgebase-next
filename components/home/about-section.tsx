import Image from "next/image"
import { Code2, Palette, Zap, Users, GraduationCap, MapPin } from "lucide-react"

const highlights = [
  { icon: Code2, label: "Clean Code", desc: "Maintainable & scalable" },
  { icon: Palette, label: "UI/UX Focus", desc: "Beautiful interfaces" },
  { icon: Zap, label: "Performance", desc: "Fast & optimized" },
  { icon: Users, label: "Collaboration", desc: "Team player" },
]

export function AboutSection() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          {/* Image - more compact */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/5] max-w-sm mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl -rotate-3" />
              <div className="relative rounded-2xl overflow-hidden border border-border/40 shadow-xl">
                <Image
                  src="/developer-laptop.png"
                  alt="Rasel Shikdar"
                  width={400}
                  height={500}
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -right-4 p-4 bg-card rounded-xl border border-border/40 shadow-lg">
                <p className="text-2xl font-bold text-primary">5+</p>
                <p className="text-xs text-muted-foreground">Years of Experience</p>
              </div>
            </div>
          </div>

          {/* Content - more compact */}
          <div className="order-1 lg:order-2">
            <p className="text-primary font-medium mb-2 flex items-center gap-2">
              <span className="w-6 h-px bg-primary" />
              About Me
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-5">
              Passionate about creating digital excellence
            </h2>

            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Hello! I'm Rasel, a full-stack developer based in Bangladesh with a passion for building exceptional
                digital experiences. My journey in web development began in 2018, and since then, I've worked with
                startups and established companies.
              </p>
              <p>
                I specialize in React, Next.js, and Node.js, focusing on clean code and optimal user experiences. I
                believe in continuous learning and staying current with the latest technologies.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-3 py-2 rounded-lg border border-border/40">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span>
                  <span className="font-medium text-foreground">BSS & MSS</span> in Political Science
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-card/50 px-3 py-2 rounded-lg border border-border/40">
                <MapPin className="h-4 w-4 text-primary" />
                <span>
                  <span className="font-medium text-foreground">Dhaka</span>, Bangladesh
                </span>
              </div>
            </div>

            {/* Highlights grid */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              {highlights.map((item) => (
                <div key={item.label} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border/40">
                  <div className="p-2 rounded-md bg-primary/10">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
