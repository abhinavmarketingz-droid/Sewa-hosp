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

const matchMagicBytes = (bytes: Uint8Array, signature: number[]) =>
  signature.every((value, index) => bytes[index] === value)

const detectFileType = (bytes: Uint8Array) => {
  if (bytes.length < 12) {
    return "unknown"
  }
  if (matchMagicBytes(bytes, [0x89, 0x50, 0x4e, 0x47])) {
    return "image/png"
  }
  if (matchMagicBytes(bytes, [0xff, 0xd8, 0xff])) {
    return "image/jpeg"
  }
  if (
    matchMagicBytes(bytes, [0x47, 0x49, 0x46, 0x38, 0x37, 0x61]) ||
    matchMagicBytes(bytes, [0x47, 0x49, 0x46, 0x38, 0x39, 0x61])
  ) {
    return "image/gif"
  }
  if (matchMagicBytes(bytes, [0x25, 0x50, 0x44, 0x46])) {
    return "application/pdf"
  }
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp"
  }
  if (
    bytes[0] === 0x00 &&
    bytes[1] === 0x00 &&
    bytes[2] === 0x00 &&
    bytes[3] === 0x18 &&
    bytes[4] === 0x66 &&
    bytes[5] === 0x74 &&
    bytes[6] === 0x79 &&
    bytes[7] === 0x70
  ) {
    return "video/mp4"
  }
  if (matchMagicBytes(bytes, [0x1a, 0x45, 0xdf, 0xa3])) {
    return "video/webm"
  }
  return "unknown"
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

  const buffer = new Uint8Array(await file.arrayBuffer())
  const detectedType = detectFileType(buffer)
  if (!allowedMimeTypes.has(detectedType)) {
    return NextResponse.json({ error: "Unsupported file content" }, { status: 400 })
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
