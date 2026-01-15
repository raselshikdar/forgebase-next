import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Github, Linkedin, Twitter, Images, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden">

  {/* HERO BACKGROUND — IMPORTANT FIX HERE */}
  <div
    className="absolute inset-0 z-0"
    style={{
      background:
        "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.35), transparent 40%), radial-gradient(circle at 80% 60%, rgba(14,165,233,0.30), transparent 40%)",
      animation: "pulseBg 18s ease-in-out infinite",
    }}
  />

  {/* CONTENT MUST BE ABOVE BACKGROUND */}
  <div className="relative z-10 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="relative flex-shrink-0 order-1 lg:order-2">
            <div className="relative">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 blur-md scale-105" />
              {/* Profile photo container */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-4 border-background shadow-2xl ring-4 ring-primary/30">
                <Image
                  src="/professional-developer-portrait-photo.jpg"
                  alt="Rasel Shikdar"
                  width={256}
                  height={256}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
              {/* Status badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-full shadow-lg flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Available
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left order-2 lg:order-1">
            <p className="text-primary font-medium mb-3 flex items-center justify-center lg:justify-start gap-2 text-sm">
              <span className="w-6 h-px bg-primary" />
              Hi there, I'm
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-foreground">Rasel Shikdar</h1>

            <h2 className="mt-3 text-xl sm:text-2xl font-medium text-muted-foreground">
              Full-Stack Developer & Creator
            </h2>

            <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              I craft exceptional digital experiences with modern technologies. Passionate about building accessible,
              performant, and beautiful web applications.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center justify-center lg:justify-start gap-3">
              <a
                href="https://github.com/raselverse"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-muted hover:bg-primary/15 hover:text-primary transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-muted hover:bg-primary/15 hover:text-primary transition-all duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-muted hover:bg-primary/15 hover:text-primary transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="#projects">
                  View My Work
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="gap-2 bg-transparent" asChild>
                <Link href="/gallery">
                  <Images className="h-4 w-4" />
                  My Gallery
                </Link>
              </Button>
            </div>

            {/* Stats - consistent typography */}
            <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-8">
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-foreground">5+</p>
                <p className="text-sm text-muted-foreground">Years Exp.</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-foreground">50+</p>
                <p className="text-sm text-muted-foreground">Projects</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl font-bold text-foreground">30+</p>
                <p className="text-sm text-muted-foreground">Clients</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
