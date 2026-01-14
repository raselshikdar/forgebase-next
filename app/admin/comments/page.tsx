import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { CommentsList } from "@/components/admin/comments-list"

async function getComments() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("blog_comments")
    .select("*, blogs(title, slug)")
    .order("created_at", { ascending: false })

  return data || []
}

export default async function CommentsPage() {
  const comments = await getComments()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Comments</h2>
        <p className="text-muted-foreground">Manage blog comments - approve, hide, or delete.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Comments</CardTitle>
          <CardDescription>{comments.length} total comments</CardDescription>
        </CardHeader>
        <CardContent>
          <CommentsList comments={comments} />
        </CardContent>
      </Card>
    </div>
  )
}
