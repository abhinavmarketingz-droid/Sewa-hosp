import { NextResponse } from "next/server"
import { z } from "zod"
import { getSupabaseAdminClient } from "@/lib/supabase-server"

const serviceSchema = z.object({
  slug: z.string().trim().min(2).max(120),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().min(10).max(600),
  items: z.array(z.string().trim().min(1).max(200)).min(1).max(20),
  position: z.number().int().min(0).max(999).nullable().optional(),
})

export async function GET() {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const { data, error } = await supabase.from("content_services").select("*").order("position", { ascending: true })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ services: data ?? [] })
}

export async function POST(request: Request) {
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
    position: parsed.data.position ?? null,
  }

  const { error } = await supabase.from("content_services").insert([insertPayload])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data } = await supabase.from("content_services").select("*").order("position", { ascending: true })
  return NextResponse.json({ services: data ?? [] })
}
