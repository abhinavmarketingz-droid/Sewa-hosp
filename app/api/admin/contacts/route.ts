import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

async function verifyAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get("admin_session")?.value
  if (!token) return null

  const supabase = await createAdminClient()
  const { data: session } = await supabase
    .from("admin_sessions")
    .select("*, admin_users(*)")
    .eq("token", token)
    .gt("expires_at", new Date().toISOString())
    .single()

  return session?.admin_users || null
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await verifyAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, status, admin_notes } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Contact ID required" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    const updateData: Record<string, string> = { updated_at: new Date().toISOString() }
    if (status) updateData.status = status
    if (admin_notes !== undefined) updateData.admin_notes = admin_notes
    if (status === "contacted") updateData.replied_at = new Date().toISOString()

    const { error } = await supabase.from("contact_submissions").update(updateData).eq("id", id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update contact error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Contact ID required" }, { status: 400 })
    }

    const supabase = await createAdminClient()
    const { error } = await supabase.from("contact_submissions").delete().eq("id", id)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete contact error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
