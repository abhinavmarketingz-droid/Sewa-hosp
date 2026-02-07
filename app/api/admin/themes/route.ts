import { NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { requirePermission } from "@/lib/admin-auth"
import { logAudit } from "@/lib/audit"
import { defaultThemeTokens, themeTokensSchema } from "@/lib/theme-tokens"

const themeSchema = z.object({
  tenantId: z.string().trim().min(1),
  tokens: themeTokensSchema,
})

export async function GET(request: Request) {
  const guard = await requirePermission("theme:read")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }

  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ tokens: defaultThemeTokens })
  }

  const url = new URL(request.url)
  const tenantId = url.searchParams.get("tenantId") ?? "default"

  const { data, error } = await supabase.from("theme_configs").select("tokens").eq("tenant_id", tenantId).single()
  if (error || !data?.tokens) {
    return NextResponse.json({ tokens: defaultThemeTokens })
  }

  return NextResponse.json({ tokens: data.tokens })
}

export async function PUT(request: Request) {
  const guard = await requirePermission("theme:write")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }

  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const payload = await request.json()
  const parsed = themeSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid request" }, { status: 400 })
  }

  const { error } = await supabase
    .from("theme_configs")
    .upsert(
      {
        tenant_id: parsed.data.tenantId,
        tokens: parsed.data.tokens,
      },
      { onConflict: "tenant_id" },
    )
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actorId: guard.context.userId,
    actorEmail: guard.context.email,
    action: "theme.update",
    resource: "theme_configs",
    metadata: { tenantId: parsed.data.tenantId },
  })

  return NextResponse.json({ success: true })
}
