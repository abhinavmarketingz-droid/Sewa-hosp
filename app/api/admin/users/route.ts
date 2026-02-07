import { NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { requirePermission } from "@/lib/admin-auth"

export async function GET() {
  const guard = await requirePermission("users:read")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const { data, error } = await supabase.from("profiles").select("id,email,full_name,role,created_at").order("email")
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ users: data ?? [] })
}
