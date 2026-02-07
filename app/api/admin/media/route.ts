import { NextResponse } from "next/server"
import { getSupabaseAdminClient, getSupabaseUrl } from "@/lib/supabase-server"
import { requirePermission } from "@/lib/admin-auth"

const resolveMediaBucket = () => process.env.SUPABASE_MEDIA_BUCKET ?? "media"
const resolveMaxUploadBytes = () => {
  const raw = process.env.SUPABASE_MEDIA_MAX_BYTES
  if (!raw) {
    return 10 * 1024 * 1024
  }
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10 * 1024 * 1024
}

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
])

const allowedExtensions = new Set(["jpg", "jpeg", "png", "webp", "gif", "mp4", "webm", "pdf"])

const resolveExtension = (value: string) => {
  const segments = value.split(".")
  const extension = segments.length > 1 ? segments.at(-1) : ""
  return extension?.toLowerCase() ?? ""
}

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

  const supabaseUrl = getSupabaseUrl() ?? ""
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

  const extension = resolveExtension(safePath)
  if (!extension || !allowedExtensions.has(extension)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
  }

  if (!file.type || !allowedMimeTypes.has(file.type)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
  }

  const maxBytes = resolveMaxUploadBytes()
  if (file.size > maxBytes) {
    return NextResponse.json({ error: `File exceeds ${Math.round(maxBytes / 1024 / 1024)}MB limit` }, { status: 400 })
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
