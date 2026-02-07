import { NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { requirePermission } from "@/lib/admin-auth"
import { logAudit } from "@/lib/audit"

const safeUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => ["http:", "https:"].includes(new URL(value).protocol), "Invalid URL protocol")

const bannerSchema = z.object({
  slug: z.string().trim().min(2).max(120),
  message: z.string().trim().min(4).max(200),
  ctaLabel: z.string().trim().max(80).optional().or(z.literal("")),
  ctaUrl: safeUrlSchema.optional().or(z.literal("")),
  ctaUrl: z.string().trim().max(200).optional().or(z.literal("")),
  variant: z.enum(["primary", "secondary", "neutral"]).optional(),
  active: z.boolean().optional(),
  position: z.number().int().min(0).max(999).nullable().optional(),
})

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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

  const updatePayload = {
    slug: parsed.data.slug,
    message: parsed.data.message,
    cta_label: parsed.data.ctaLabel || null,
    cta_url: parsed.data.ctaUrl || null,
    variant: parsed.data.variant ?? "primary",
    active: parsed.data.active ?? true,
    position: parsed.data.position ?? null,
  }

  const { error } = await supabase.from("content_banners").update(updatePayload).eq("id", params.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actorId: guard.context.userId,
    actorEmail: guard.context.email,
    action: "content.update",
    resource: "content_banners",
    metadata: { id: params.id },
  })

  const { data } = await supabase.from("content_banners").select("*").order("position", { ascending: true })
  const banners = (data ?? []).map((item) => ({
    ...item,
    ctaLabel: (item as { cta_label?: string | null }).cta_label ?? undefined,
    ctaUrl: (item as { cta_url?: string | null }).cta_url ?? undefined,
  }))
  return NextResponse.json({ banners })
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const guard = await requirePermission("content:write")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const { error } = await supabase.from("content_banners").delete().eq("id", params.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actorId: guard.context.userId,
    actorEmail: guard.context.email,
    action: "content.delete",
    resource: "content_banners",
    metadata: { id: params.id },
  })

  const { data } = await supabase.from("content_banners").select("*").order("position", { ascending: true })
  const banners = (data ?? []).map((item) => ({
    ...item,
    ctaLabel: (item as { cta_label?: string | null }).cta_label ?? undefined,
    ctaUrl: (item as { cta_url?: string | null }).cta_url ?? undefined,
  }))
  return NextResponse.json({ banners })
}
