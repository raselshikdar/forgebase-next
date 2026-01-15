import Link from "next/link"
import { Mail, Github, Facebook, Twitter, Linkedin, Send, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const socialLinks = [
  { name: "GitHub", href: "https://github.com/raselshikdar", icon: Github },
  { name: "Facebook", href: "https://facebook.com/raselverse", icon: Facebook },
  { name: "X", href: "https://x.com/raselshikdar_", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com/in/raselshikdar", icon: Linkedin },
  { name: "Telegram", href: "https://t.me/rasel597", icon: Send },
]

export function ContactSection() {
  return (
    <section id="contact" className="py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-primary font-medium mb-2 flex items-center justify-center gap-2 text-sm">
            <span className="w-6 h-px bg-primary" />
            Get in Touch
            <span className="w-6 h-px bg-primary" />
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Let's Work Together</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Open to new opportunities and interesting projects. Have a question or just want to say hi? I'd love to hear
            from you!
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button className="gap-2" asChild>
              <a href="mailto:raselshikdar597@gmail.com">
                <Mail className="h-4 w-4" />
                Send an Email
              </a>
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent" asChild>
              <Link href="/contact">
                Contact Form
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Social Links - more compact */}
          <div className="mt-8 flex items-center justify-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-card border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all"
                  aria-label={link.name}
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
