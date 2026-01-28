import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    if (error) {
      throw error
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { sessionId, message, senderType, senderName } = data

    if (!sessionId || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: newMessage, error } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        message,
        sender_type: senderType || "visitor",
        sender_name: senderName || null,
        is_read: senderType !== "visitor",
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Update last_message_at in session
    await supabase.from("chat_sessions").update({ last_message_at: new Date().toISOString() }).eq("id", sessionId)

    return NextResponse.json({ message: newMessage })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
