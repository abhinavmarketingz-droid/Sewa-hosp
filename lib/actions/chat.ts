"use server"

import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

interface StartChatData {
  visitorId: string
  visitorName?: string
  visitorEmail?: string
  visitorPhone?: string
  pageUrl?: string
}

export async function startChatSession(data: StartChatData) {
  const supabase = await createClient()
  const headersList = await headers()

  const ip = headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "unknown"
  const userAgent = headersList.get("user-agent") || ""

  const { data: session, error } = await supabase
    .from("chat_sessions")
    .insert({
      visitor_id: data.visitorId,
      visitor_name: data.visitorName || null,
      visitor_email: data.visitorEmail || null,
      visitor_phone: data.visitorPhone || null,
      page_url: data.pageUrl || null,
      ip_address: ip,
      user_agent: userAgent,
      status: "active",
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error starting chat session:", error)
    return { success: false, error: "Failed to start chat" }
  }

  return { success: true, session }
}

export async function sendChatMessage(
  sessionId: string,
  message: string,
  senderType: "visitor" | "admin" | "system",
  senderName?: string,
) {
  const supabase = await createClient()

  const { data: msg, error } = await supabase
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      message,
      sender_type: senderType,
      sender_name: senderName || null,
      is_read: senderType !== "visitor",
    })
    .select()
    .single()

  if (error) {
    console.error("Error sending chat message:", error)
    return { success: false, error: "Failed to send message" }
  }

  // Update last_message_at
  await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", sessionId)

  return { success: true, message: msg }
}

export async function getChatMessages(sessionId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching chat messages:", error)
    return []
  }

  return data || []
}

export async function updateChatSessionInfo(
  sessionId: string,
  data: {
    visitorName?: string
    visitorEmail?: string
    visitorPhone?: string
  },
) {
  const supabase = await createClient()

  const updateData: Record<string, string | null> = {}
  if (data.visitorName) updateData.visitor_name = data.visitorName
  if (data.visitorEmail) updateData.visitor_email = data.visitorEmail
  if (data.visitorPhone) updateData.visitor_phone = data.visitorPhone

  const { error } = await supabase.from("chat_sessions").update(updateData).eq("id", sessionId)

  if (error) {
    console.error("Error updating chat session:", error)
    return { success: false }
  }

  return { success: true }
}

export async function endChatSession(sessionId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("chat_sessions")
    .update({
      status: "closed",
      ended_at: new Date().toISOString(),
    })
    .eq("id", sessionId)

  if (error) {
    console.error("Error ending chat session:", error)
    return { success: false }
  }

  return { success: true }
}
