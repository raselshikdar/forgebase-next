import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { ContactMessagesList } from "@/components/admin/contact-messages-list"

async function getContactMessages() {
  const supabase = await createClient()
  const { data } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false })

  return data || []
}

export default async function AdminContactPage() {
  const messages = await getContactMessages()
  const unreadCount = messages.filter((m) => m.status === "unread").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contact Messages</h2>
          <p className="text-muted-foreground">View and respond to contact form submissions</p>
        </div>
        <Badge variant="default" className="text-base px-3 py-1">
          {unreadCount} Unread
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>{messages.length} total messages</CardDescription>
        </CardHeader>
        <CardContent>
          <ContactMessagesList messages={messages} />
        </CardContent>
      </Card>
    </div>
  )
}
