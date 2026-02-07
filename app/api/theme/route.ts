import { NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { defaultThemeTokens } from "@/lib/theme-tokens"

export async function GET(request: Request) {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ tokens: defaultThemeTokens })
  }

  const url = new URL(request.url)
  const tenantId = url.searchParams.get("tenantId") ?? "default"

  const { data } = await supabase.from("theme_configs").select("tokens").eq("tenant_id", tenantId).single()
  return NextResponse.json({ tokens: data?.tokens ?? defaultThemeTokens })
}
