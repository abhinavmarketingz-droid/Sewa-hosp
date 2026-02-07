import { NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { mapDbBannerToContent } from "@/lib/content"
import { requirePermission } from "@/lib/admin-auth"
import { logAudit } from "@/lib/audit"

const bannerSchema = z.object({
  slug: z.string().trim().min(2).max(120),
  message: z.string().trim().min(4).max(200),
  ctaLabel: z.string().trim().max(80).optional().or(z.literal("")),
  ctaUrl: z.string().trim().max(200).optional().or(z.literal("")),
  variant: z.enum(["primary", "secondary", "neutral"]).optional(),
  active: z.boolean().optional(),
  position: z.number().int().min(0).max(999).nullable().optional(),
})

export async function GET() {
  const guard = await requirePermission("content:read")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const { data, error } = await supabase.from("content_banners").select("*").order("position", { ascending: true })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const banners = (data ?? []).map((item) => mapDbBannerToContent(item))
  return NextResponse.json({ banners })
}

export async function POST(request: Request) {
  const guard = await requirePermission("content:write")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const payload = await request.json()
  const parsed = bannerSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid request" }, { status: 400 })
  }

  const insertPayload = {
    slug: parsed.data.slug,
    message: parsed.data.message,
    cta_label: parsed.data.ctaLabel || null,
    cta_url: parsed.data.ctaUrl || null,
    variant: parsed.data.variant ?? "primary",
    active: parsed.data.active ?? true,
    position: parsed.data.position ?? null,
  }

  const { error } = await supabase.from("content_banners").insert([insertPayload])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actorId: guard.context.userId,
    actorEmail: guard.context.email,
    action: "content.create",
    resource: "content_banners",
    metadata: { slug: parsed.data.slug },
  })

  const { data } = await supabase.from("content_banners").select("*").order("position", { ascending: true })
  const banners = (data ?? []).map((item) => mapDbBannerToContent(item))
  return NextResponse.json({ banners })
}
