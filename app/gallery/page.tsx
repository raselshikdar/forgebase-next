import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Quote, Music, Video, StickyNote, User, MapPin, GraduationCap, Heart, Camera } from "lucide-react"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import {
  getGalleryPhotos,
  getGalleryVideos,
  getGalleryAudios,
  getGalleryNotes,
  getGalleryQuotes,
  getAboutDetails,
} from "@/lib/actions/gallery"

export const metadata: Metadata = {
  title: "Gallery | Rasel Shikdar",
  description: "Photos, videos, audio, notes, quotes and more about Rasel Shikdar",
}

export const revalidate = 60

export default async function GalleryPage() {
  const [photos, videos, audios, notes, quotes, aboutDetails] = await Promise.all([
    getGalleryPhotos(),
    getGalleryVideos(),
    getGalleryAudios(),
    getGalleryNotes(),
    getGalleryQuotes(),
    getAboutDetails(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-[88px] md:pt-[96px] pb-16">
        <div className="container mx-auto px-6">
          {/* Page Header */}
          <div className="max-w-3xl mx-auto text-center mt-8 md:mt-12 mb-16">
            
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">My Gallery</h1>
            <p className="text-lg text-muted-foreground">
              A personal collection of photos, videos, audio, thoughts, and more.
            </p>
          </div>

          {/* About Me Section */}
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">About Me</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Static about cards */}
              <div className="p-6 bg-card rounded-xl border border-border/40 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Location</h3>
                </div>
                <p className="text-muted-foreground">Dhaka, Bangladesh</p>
              </div>

              <div className="p-6 bg-card rounded-xl border border-border/40 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Education</h3>
                </div>
                <p className="text-muted-foreground">BSS & MSS in Political Science</p>
                <p className="text-xs text-muted-foreground/70 mt-1">Bachelor & Master of Social Science</p>
              </div>

              <div className="p-6 bg-card rounded-xl border border-border/40 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Passion</h3>
                </div>
                <p className="text-muted-foreground">Full-Stack Development & Creating Digital Experiences</p>
              </div>

              {/* Dynamic about details */}
              {aboutDetails.map((detail) => (
                <div
                  key={detail.id}
                  className="p-6 bg-card rounded-xl border border-border/40 hover:border-primary/30 transition-colors"
                >
                  <h3 className="font-semibold mb-2">{detail.section_title}</h3>
                  <p className="text-muted-foreground text-sm">{detail.content}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Photos Section */}
          {photos.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Photos</h2>
              </div>

              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {photos.map((photo) => (
                  <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={photo.image_url || "/placeholder.svg"}
                      alt={photo.title || "Gallery photo"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {photo.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white font-medium text-sm">{photo.title}</p>
                          {photo.description && (
                            <p className="text-white/70 text-xs mt-1 line-clamp-2">{photo.description}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Videos Section */}
          {videos.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Video className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Videos</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => {
                  const videoId = extractYouTubeId(video.youtube_url)
                  return (
                    <div key={video.id} className="group">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                      <h3 className="mt-3 font-medium text-foreground group-hover:text-primary transition-colors">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{video.description}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Audio Section */}
          {audios.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Music className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Audio</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {audios.map((audio) => (
                  <div
                    key={audio.id}
                    className="flex gap-4 p-4 bg-card rounded-xl border border-border/40 hover:border-primary/30 transition-colors"
                  >
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {audio.cover_image ? (
                        <Image
                          src={audio.cover_image || "/placeholder.svg"}
                          alt={audio.title}
                          width={64}
                          height={64}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <Music className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground">{audio.title}</h3>
                      {audio.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{audio.description}</p>
                      )}
                      <audio controls className="w-full mt-2 h-8">
                        <source src={audio.audio_url} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Quotes Section */}
          {quotes.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Quote className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Favorite Quotes</h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {quotes.map((quote) => (
                  <blockquote key={quote.id} className="relative p-6 bg-card rounded-xl border border-border/40">
                    <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/20" />
                    <p className="text-foreground italic pl-8 text-lg leading-relaxed">"{quote.quote}"</p>
                    {quote.author && (
                      <footer className="mt-4 pl-8">
                        <cite className="text-sm text-muted-foreground not-italic">
                          — {quote.author}
                          {quote.source && <span className="text-muted-foreground/70">, {quote.source}</span>}
                        </cite>
                      </footer>
                    )}
                  </blockquote>
                ))}
              </div>
            </section>
          )}

          {/* Notes Section */}
          {notes.length > 0 && (
            <section className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <StickyNote className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Notes & Thoughts</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-5 bg-card rounded-xl border border-border/40 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-foreground">{note.title}</h3>
                      {note.category && (
                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                          {note.category}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {photos.length === 0 &&
            videos.length === 0 &&
            audios.length === 0 &&
            quotes.length === 0 &&
            notes.length === 0 &&
            aboutDetails.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">Gallery content coming soon. Check back later!</p>
              </div>
            )}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}
