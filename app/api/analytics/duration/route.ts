import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { sessionId, pagePath, duration } = data

    if (!sessionId || !pagePath || typeof duration !== "number") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    const supabase = await createClient()

    // Update the most recent analytics record for this session and page
    await supabase
      .from("visitor_analytics")
      .update({ duration_seconds: duration })
      .eq("session_id", sessionId)
      .eq("page_path", pagePath)
      .order("created_at", { ascending: false })
      .limit(1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Duration tracking error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
