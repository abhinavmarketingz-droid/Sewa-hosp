import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value

    if (token) {
      const supabase = await createAdminClient()
      await supabase.from("admin_sessions").delete().eq("token", token)
    }

    cookieStore.delete("admin_session")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
