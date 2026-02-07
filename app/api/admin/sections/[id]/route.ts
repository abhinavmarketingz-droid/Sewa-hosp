import { NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { requirePermission } from "@/lib/admin-auth"
import { logAudit } from "@/lib/audit"

const sectionSchema = z.object({
  slug: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(200),
  body: z.string().trim().min(10).max(1200),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  ctaLabel: z.string().trim().max(80).optional().or(z.literal("")),
  ctaUrl: z.string().trim().max(200).optional().or(z.literal("")),
  position: z.number().int().min(0).max(999).nullable().optional(),
  active: z.boolean().optional(),
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
  const parsed = sectionSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid request" }, { status: 400 })
  }

  const updatePayload = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    body: parsed.data.body,
    image_url: parsed.data.imageUrl || null,
    cta_label: parsed.data.ctaLabel || null,
    cta_url: parsed.data.ctaUrl || null,
    position: parsed.data.position ?? null,
    active: parsed.data.active ?? true,
  }

  const { error } = await supabase.from("content_sections").update(updatePayload).eq("id", params.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actorId: guard.context.userId,
    actorEmail: guard.context.email,
    action: "content.update",
    resource: "content_sections",
    metadata: { id: params.id },
  })

  const { data } = await supabase.from("content_sections").select("*").order("position", { ascending: true })
  const sections = (data ?? []).map((item) => ({
    ...item,
    imageUrl: (item as { image_url?: string | null }).image_url ?? undefined,
    ctaLabel: (item as { cta_label?: string | null }).cta_label ?? undefined,
    ctaUrl: (item as { cta_url?: string | null }).cta_url ?? undefined,
  }))
  return NextResponse.json({ sections })
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

  const { error } = await supabase.from("content_sections").delete().eq("id", params.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actorId: guard.context.userId,
    actorEmail: guard.context.email,
    action: "content.delete",
    resource: "content_sections",
    metadata: { id: params.id },
  })

  const { data } = await supabase.from("content_sections").select("*").order("position", { ascending: true })
  const sections = (data ?? []).map((item) => ({
    ...item,
    imageUrl: (item as { image_url?: string | null }).image_url ?? undefined,
    ctaLabel: (item as { cta_label?: string | null }).cta_label ?? undefined,
    ctaUrl: (item as { cta_url?: string | null }).cta_url ?? undefined,
  }))
  return NextResponse.json({ sections })
}
