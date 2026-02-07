import { NextResponse } from "next/server"
import { z } from "zod"
import { mapDbServiceToContent } from "@/lib/content"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { requirePermission } from "@/lib/admin-auth"
import { logAudit } from "@/lib/audit"

const serviceSchema = z.object({
  slug: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(200),
  titleKey: z.string().trim().min(2).max(200).optional().or(z.literal("")),
  description: z.string().trim().min(10).max(600),
  items: z.array(z.string().trim().min(1).max(200)).min(1).max(20),
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

  const { data, error } = await supabase.from("content_services").select("*").order("position", { ascending: true })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const services = (data ?? []).map((item) => mapDbServiceToContent(item))
  return NextResponse.json({ services })
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
  const parsed = serviceSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid request" }, { status: 400 })
  }

  const insertPayload = {
    ...parsed.data,
    title_key: parsed.data.titleKey || null,
    position: parsed.data.position ?? null,
  }

  const { error } = await supabase.from("content_services").insert([insertPayload])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actorId: guard.context.userId,
    actorEmail: guard.context.email,
    action: "content.create",
    resource: "content_services",
    metadata: { slug: parsed.data.slug },
  })

  const { data } = await supabase.from("content_services").select("*").order("position", { ascending: true })
  const services = (data ?? []).map((item) => mapDbServiceToContent(item))
  return NextResponse.json({ services })
}
