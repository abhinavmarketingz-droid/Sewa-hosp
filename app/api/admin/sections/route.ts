import { NextResponse } from "next/server"
import { z } from "zod"
import { mapDbSectionToContent } from "@/lib/content"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { requirePermission } from "@/lib/admin-auth"
import { logAudit } from "@/lib/audit"

const safeUrlSchema = z
  .string()
  .trim()
  .url()
  .refine((value) => ["http:", "https:"].includes(new URL(value).protocol), "Invalid URL protocol")

const sectionSchema = z.object({
  slug: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(200),
  body: z.string().trim().min(10).max(1200),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  ctaLabel: z.string().trim().max(80).optional().or(z.literal("")),
  ctaUrl: safeUrlSchema.optional().or(z.literal("")),
  position: z.number().int().min(0).max(999).nullable().optional(),
  active: z.boolean().optional(),
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

  const { data, error } = await supabase.from("content_sections").select("*").order("position", { ascending: true })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const sections = (data ?? []).map((item) => mapDbSectionToContent(item))
  return NextResponse.json({ sections })
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
  const parsed = sectionSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid request" }, { status: 400 })
  }

  const insertPayload = {
    slug: parsed.data.slug,
    title: parsed.data.title,
    body: parsed.data.body,
    image_url: parsed.data.imageUrl || null,
    cta_label: parsed.data.ctaLabel || null,
    cta_url: parsed.data.ctaUrl || null,
    position: parsed.data.position ?? null,
    active: parsed.data.active ?? true,
  }

  const { error } = await supabase.from("content_sections").insert([insertPayload])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actorId: guard.context.userId,
    actorEmail: guard.context.email,
    action: "content.create",
    resource: "content_sections",
    metadata: { slug: parsed.data.slug },
  })

  const { data } = await supabase.from("content_sections").select("*").order("position", { ascending: true })
  const sections = (data ?? []).map((item) => mapDbSectionToContent(item))
  return NextResponse.json({ sections })
}
