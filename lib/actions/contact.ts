"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

interface ContactMessageInput {
  name: string
  email: string
  subject: string
  message: string
}

interface ContactMessageResult {
  success: boolean
  message?: string
  error?: string
}

export async function submitContactMessage(input: ContactMessageInput): Promise<ContactMessageResult> {
  try {
    const supabase = await createClient()

    const { error: dbError } = await supabase.from("contact_messages").insert({
      name: input.name,
      email: input.email,
      subject: input.subject,
      message: input.message,
      status: "unread",
    })

    if (dbError) {
      console.error("Database error:", dbError)
      return {
        success: false,
        error: "Failed to save message. Please try again.",
      }
    }

    try {
      const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "default_service",
          template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "default_template",
          user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "default_key",
          template_params: {
            to_email: "raselshikdar597@gmail.com",
            from_name: input.name,
            from_email: input.email,
            subject: input.subject,
            message: input.message,
            reply_to_email: input.email,
          },
        }),
      })

      if (!emailResponse.ok) {
        console.warn("EmailJS service warning:", emailResponse.statusText)
        // Don't fail if email service has issues - message is saved in database
      }
    } catch (emailError) {
      console.warn("Email sending warning:", emailError)
      // Don't fail completely - message is already saved in database
    }

    revalidatePath("/contact")
    return {
      success: true,
      message: "Message sent successfully!",
    }
  } catch (error) {
    console.error("Contact submission error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}

export async function getContactMessages() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Failed to fetch contact messages:", error)
    return []
  }
}

export async function updateMessageStatus(messageId: string, status: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("contact_messages")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", messageId)

    if (error) throw error
    revalidatePath("/admin/contact")
    return { success: true }
  } catch (error) {
    console.error("Failed to update message status:", error)
    return { success: false, error: String(error) }
  }
}

export async function replyToMessage(messageId: string, replyMessage: string) {
  try {
    const supabase = await createClient()

    // Get the original message to reply to
    const { data: message, error: fetchError } = await supabase
      .from("contact_messages")
      .select("email, name")
      .eq("id", messageId)
      .single()

    if (fetchError || !message) throw fetchError || new Error("Message not found")

    // Send reply email
    try {
      const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "default_service",
          template_id: process.env.NEXT_PUBLIC_EMAILJS_REPLY_TEMPLATE_ID || "default_template",
          user_id: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "default_key",
          template_params: {
            to_email: message.email,
            from_name: "Rasel Shikdar",
            subject: "Re: Your Message",
            message: replyMessage,
            reply_to_email: "raselshikdar597@gmail.com",
          },
        }),
      })

      if (!emailResponse.ok) {
        console.warn("Reply email service warning:", emailResponse.statusText)
      }
    } catch (emailError) {
      console.warn("Reply email sending warning:", emailError)
    }

    // Update message to mark as replied
    const { error: updateError } = await supabase
      .from("contact_messages")
      .update({
        replied: true,
        reply_message: replyMessage,
        status: "replied",
        updated_at: new Date().toISOString(),
      })
      .eq("id", messageId)

    if (updateError) throw updateError

    revalidatePath("/admin/contact")
    return { success: true }
  } catch (error) {
    console.error("Failed to send reply:", error)
    return { success: false, error: String(error) }
  }
}
