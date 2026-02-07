import { NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { mapDbDestinationToContent } from "@/lib/content"
import { requirePermission } from "@/lib/admin-auth"
import { logAudit } from "@/lib/audit"

const destinationSchema = z.object({
  slug: z.string().trim().min(2).max(120),
  name: z.string().trim().min(2).max(200),
  headline: z.string().trim().min(2).max(200),
  description: z.string().trim().min(10).max(800),
  services: z.array(z.string().trim().min(1).max(200)).min(1).max(30),
  highlights: z.array(z.string().trim().min(1).max(200)).min(1).max(30),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
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
  const parsed = destinationSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid request" }, { status: 400 })
  }

  const updatePayload = {
    ...parsed.data,
    image_url: parsed.data.imageUrl || null,
    position: parsed.data.position ?? null,
  }

  const { error } = await supabase.from("content_destinations").update(updatePayload).eq("id", params.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actorId: guard.context.userId,
    actorEmail: guard.context.email,
    action: "content.update",
    resource: "content_destinations",
    metadata: { id: params.id },
  })

  const { data } = await supabase.from("content_destinations").select("*").order("position", { ascending: true })
  const destinations = (data ?? []).map((item) => mapDbDestinationToContent(item))
  return NextResponse.json({ destinations })
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

  const { error } = await supabase.from("content_destinations").delete().eq("id", params.id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    actorId: guard.context.userId,
    actorEmail: guard.context.email,
    action: "content.delete",
    resource: "content_destinations",
    metadata: { id: params.id },
  })

  const { data } = await supabase.from("content_destinations").select("*").order("position", { ascending: true })
  const destinations = (data ?? []).map((item) => mapDbDestinationToContent(item))
  return NextResponse.json({ destinations })
}
