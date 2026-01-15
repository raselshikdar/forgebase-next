import Link from "next/link"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"

const socialLinks = [
  { name: "GitHub", href: "https://github.com/raselverse", icon: Github },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "Email", href: "mailto:raselshikdar597@gmail.com", icon: Mail },
]

const quickLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Store", href: "/store" },
  { name: "Gallery", href: "/gallery" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/contact" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-muted/30 backdrop-blur">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Rasel<span className="text-primary">.</span>
            </Link>
            <p className="text-xs text-muted-foreground text-center md:text-left max-w-xs">
              Full-stack developer crafting accessible, pixel-perfect digital experiences.
            </p>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={link.name}
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Rasel. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Built with Next.js & Supabase</p>
        </div>
      </div>
    </footer>
  )
}
