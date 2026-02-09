import { NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { requirePermission } from "@/lib/admin-auth"

const resolveMediaBucket = () => process.env.SUPABASE_MEDIA_BUCKET ?? "media"
const resolveBackupLimit = (value: string | null) => {
  const fallback = 500
  const max = 2000
  if (!value) {
    return fallback
  }
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }
  return Math.min(Math.floor(parsed), max)
}

const fetchLimited = async (query: any, limit: number) => {
  const result = await query.limit(limit)
  const count = result.count ?? 0
  return {
    data: result.data ?? [],
    error: result.error,
    count,
    truncated: result.data ? result.data.length < count : count > 0,
  }
}

export async function GET(request: Request) {
  const guard = await requirePermission("backups:read")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }

  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const url = new URL(request.url)
  const limit = resolveBackupLimit(url.searchParams.get("limit"))

  const [services, destinations, banners, sections, requests, auditLogs] = await Promise.all([
    fetchLimited(
      supabase.from("content_services").select("*", { count: "exact" }).order("position", { ascending: true }),
      limit
    ),
    fetchLimited(
      supabase
        .from("content_destinations")
        .select("*", { count: "exact" })
        .order("position", { ascending: true }),
      limit
    ),
    fetchLimited(
      supabase.from("content_banners").select("*", { count: "exact" }).order("position", { ascending: true }),
      limit
    ),
    fetchLimited(
      supabase.from("content_sections").select("*", { count: "exact" }).order("position", { ascending: true }),
      limit
    ),
    fetchLimited(
      supabase
        .from("concierge_requests")
        .select("*", { count: "exact" })
        .order("submitted_at", { ascending: false }),
      limit
    ),
    fetchLimited(
      supabase.from("audit_logs").select("*", { count: "exact" }).order("created_at", { ascending: false }),
      limit
    ),
  ])

  const bucket = resolveMediaBucket()
  const media = await supabase.storage.from(bucket).list("", { limit: 1000, sortBy: { column: "name", order: "asc" } })

  const backup = {
    generatedAt: new Date().toISOString(),
    limit,
    tables: {
      content_services: services.data,
      content_destinations: destinations.data,
      content_banners: banners.data,
      content_sections: sections.data,
      concierge_requests: requests.data,
      audit_logs: auditLogs.data,
    },
    counts: {
      content_services: services.count,
      content_destinations: destinations.count,
      content_banners: banners.count,
      content_sections: sections.count,
      concierge_requests: requests.count,
      audit_logs: auditLogs.count,
    },
    truncated: {
      content_services: services.truncated,
      content_destinations: destinations.truncated,
      content_banners: banners.truncated,
      content_sections: sections.truncated,
      concierge_requests: requests.truncated,
      audit_logs: auditLogs.truncated,
    },
    media: {
      bucket,
      files: media.data ?? [],
    },
    errors: {
      content_services: services.error?.message ?? null,
      content_destinations: destinations.error?.message ?? null,
      content_banners: banners.error?.message ?? null,
      content_sections: sections.error?.message ?? null,
      concierge_requests: requests.error?.message ?? null,
      audit_logs: auditLogs.error?.message ?? null,
      media: media.error?.message ?? null,
    },
  }

  const body = JSON.stringify(backup, null, 2)
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename=\"sewa-backup-${timestamp}.json\"`,
    },
  })
}
