import { NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase-server"

const DEFAULT_LIMIT = 50
const MAX_LIMIT = 200

export async function GET(request: Request) {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const limitParam = Number.parseInt(searchParams.get("limit") ?? "", 10)
  const offsetParam = Number.parseInt(searchParams.get("offset") ?? "", 10)
  const limit = Number.isNaN(limitParam) ? DEFAULT_LIMIT : Math.min(Math.max(limitParam, 1), MAX_LIMIT)
  const offset = Number.isNaN(offsetParam) ? 0 : Math.max(offsetParam, 0)

  const { data, error, count } = await supabase
    .from("concierge_requests")
    .select("*", { count: "exact" })
    .order("submitted_at", { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    data,
    count,
    limit,
    offset,
  })
}
