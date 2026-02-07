import { NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseAdminClient } from "@/lib/supabase-server"

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

export async function GET() {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const { data, error } = await supabase
    .from("content_destinations")
    .select("*")
    .order("position", { ascending: true })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const destinations = (data ?? []).map((item) => ({
    ...item,
    imageUrl: (item as { image_url?: string | null }).image_url ?? null,
  }))

  return NextResponse.json({ destinations })
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const payload = await request.json()
  const parsed = destinationSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid request" }, { status: 400 })
  }

  const insertPayload = {
    ...parsed.data,
    image_url: parsed.data.imageUrl || null,
    position: parsed.data.position ?? null,
  }

  const { error } = await supabase.from("content_destinations").insert([insertPayload])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data } = await supabase.from("content_destinations").select("*").order("position", { ascending: true })
  const destinations = (data ?? []).map((item) => ({
    ...item,
    imageUrl: (item as { image_url?: string | null }).image_url ?? null,
  }))
  return NextResponse.json({ destinations })
}
