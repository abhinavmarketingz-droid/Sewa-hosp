import { NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { requirePermission } from "@/lib/admin-auth"

const resolveMediaBucket = () => process.env.SUPABASE_MEDIA_BUCKET ?? "media"

const buildPublicUrl = (supabaseUrl: string, bucket: string, path: string) =>
  `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodeURIComponent(path)}`

export async function GET() {
  const guard = await requirePermission("content:read")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }

  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const bucket = resolveMediaBucket()
  const { data, error } = await supabase.storage
    .from(bucket)
    .list("", { limit: 1000, sortBy: { column: "name", order: "asc" } })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  const files = (data ?? []).map((item) => ({
    name: item.name,
    id: item.id ?? item.name,
    updatedAt: item.updated_at,
    createdAt: item.created_at,
    size: item.metadata?.size ?? null,
    publicUrl: supabaseUrl ? buildPublicUrl(supabaseUrl, bucket, item.name) : null,
  }))

  return NextResponse.json({ bucket, files })
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

  const formData = await request.formData()
  const file = formData.get("file")
  const path = formData.get("path")
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 })
  }

  const safePath = typeof path === "string" && path.trim() ? path.trim() : file.name
  if (!safePath) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 })
  }

  const bucket = resolveMediaBucket()
  const { error } = await supabase.storage.from(bucket).upload(safePath, file, {
    upsert: true,
    contentType: file.type || "application/octet-stream",
  })
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const guard = await requirePermission("content:write")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }

  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const url = new URL(request.url)
  const path = url.searchParams.get("path")
  if (!path) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 })
  }

  const bucket = resolveMediaBucket()
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
