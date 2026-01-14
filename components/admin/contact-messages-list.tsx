"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Mail, MessageCircle, CheckCircle } from "lucide-react"
import { updateMessageStatus, replyToMessage } from "@/lib/actions/contact"

interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  replied: boolean
  reply_message: string | null
  created_at: string
}

export function ContactMessagesList({ messages: initialMessages }: { messages: ContactMessage[] }) {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [replyText, setReplyText] = useState("")
  const [isReplying, setIsReplying] = useState(false)

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return

    setIsReplying(true)
    try {
      const result = await replyToMessage(selectedMessage.id, replyText)
      if (result.success) {
        setMessages(
          messages.map((m) =>
            m.id === selectedMessage.id
              ? {
                  ...m,
                  replied: true,
                  reply_message: replyText,
                  status: "replied",
                }
              : m,
          ),
        )
        setSelectedMessage(null)
        setReplyText("")
      }
    } finally {
      setIsReplying(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    await updateMessageStatus(id, "read")
    setMessages(messages.map((m) => (m.id === id ? { ...m, status: "read" } : m)))
  }

  if (messages.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">No messages yet.</div>
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <div
          key={message.id}
          className="flex gap-4 p-4 rounded-lg border border-border/40 hover:border-border/70 transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <Mail className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-medium">{message.name}</span>
              <span className="text-xs text-muted-foreground truncate">{message.email}</span>
              <Badge variant={message.status === "unread" ? "default" : "secondary"} className="text-xs">
                {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
              </Badge>
              {message.replied && (
                <Badge variant="outline" className="text-xs gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Replied
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium text-foreground mb-2">{message.subject}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{message.message}</p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              {new Date(message.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {message.status === "unread" && (
              <Button size="sm" variant="outline" onClick={() => handleMarkAsRead(message.id)}>
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={() => setSelectedMessage(message)}>
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Reply Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {selectedMessage?.name}</DialogTitle>
            <DialogDescription>{selectedMessage?.email}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-card/50 p-4 rounded-lg border border-border/40">
              <p className="text-sm font-medium mb-2 text-muted-foreground">Original Message:</p>
              <p className="text-sm text-foreground">{selectedMessage?.message}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Reply</label>
              <Textarea
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={5}
                disabled={isReplying}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleReply} disabled={isReplying || !replyText.trim()} className="flex-1">
                {isReplying ? "Sending..." : "Send Reply"}
              </Button>
              <Button variant="outline" onClick={() => setSelectedMessage(null)} disabled={isReplying}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
