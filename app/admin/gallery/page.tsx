import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getGalleryPhotos,
  getGalleryVideos,
  getGalleryAudios,
  getGalleryNotes,
  getGalleryQuotes,
  getAboutDetails,
} from "@/lib/actions/gallery"
import { GalleryPhotosManager } from "@/components/admin/gallery-photos-manager"
import { GalleryVideosManager } from "@/components/admin/gallery-videos-manager"
import { GalleryAudiosManager } from "@/components/admin/gallery-audios-manager"
import { GalleryNotesManager } from "@/components/admin/gallery-notes-manager"
import { GalleryQuotesManager } from "@/components/admin/gallery-quotes-manager"
import { AboutDetailsManager } from "@/components/admin/about-details-manager"

export default async function GalleryAdminPage() {
  const [photos, videos, audios, notes, quotes, aboutDetails] = await Promise.all([
    getGalleryPhotos(),
    getGalleryVideos(),
    getGalleryAudios(),
    getGalleryNotes(),
    getGalleryQuotes(),
    getAboutDetails(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Gallery Management</h2>
        <p className="text-muted-foreground">Manage your gallery content - photos, videos, audio, notes, and quotes.</p>
      </div>

      <Tabs defaultValue="photos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="photos">Photos ({photos.length})</TabsTrigger>
          <TabsTrigger value="videos">Videos ({videos.length})</TabsTrigger>
          <TabsTrigger value="audios">Audio ({audios.length})</TabsTrigger>
          <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="quotes">Quotes ({quotes.length})</TabsTrigger>
          <TabsTrigger value="about">About ({aboutDetails.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>Upload and manage gallery photos</CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryPhotosManager photos={photos} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle>Videos</CardTitle>
              <CardDescription>Add YouTube videos to your gallery</CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryVideosManager videos={videos} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audios">
          <Card>
            <CardHeader>
              <CardTitle>Audio</CardTitle>
              <CardDescription>Upload audio files to your gallery</CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryAudiosManager audios={audios} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Add personal notes and thoughts</CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryNotesManager notes={notes} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotes">
          <Card>
            <CardHeader>
              <CardTitle>Quotes</CardTitle>
              <CardDescription>Add your favorite quotes</CardDescription>
            </CardHeader>
            <CardContent>
              <GalleryQuotesManager quotes={quotes} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Details</CardTitle>
              <CardDescription>Add additional information about yourself</CardDescription>
            </CardHeader>
            <CardContent>
              <AboutDetailsManager details={aboutDetails} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
