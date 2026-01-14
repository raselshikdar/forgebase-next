import type { Metadata } from "next"
import { Mail, MapPin, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ContactForm } from "@/components/contact/contact-form"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me for collaborations, questions, or just to say hello.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="border-b border-border/40 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4">
                Contact
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">Let&apos;s Connect</h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Have a project in mind or just want to chat? I&apos;d love to hear from you. Fill out the form below or
                reach out through any of the channels listed.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-12 lg:grid-cols-5">
              {/* Contact Info */}
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold">Contact Information</h2>
                <p className="mt-2 text-muted-foreground">Feel free to reach out through any of these channels.</p>

                <div className="mt-8 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <a
                        href="mailto:hello@rasel.dev"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        hello@rasel.dev
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-muted-foreground">Dhaka, Bangladesh</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Response Time</h3>
                      <p className="text-muted-foreground">Usually within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="font-medium">Availability</h3>
                  <p className="mt-2 text-muted-foreground">
                    I&apos;m currently available for freelance work and interesting project collaborations. Let&apos;s
                    discuss how we can work together.
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="rounded-lg border border-border bg-card p-6 md:p-8">
                  <h2 className="text-xl font-semibold text-card-foreground">Send a Message</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Fill out the form below and I&apos;ll get back to you as soon as possible.
                  </p>
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
