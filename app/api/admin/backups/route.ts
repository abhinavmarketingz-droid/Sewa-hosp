import { NextResponse } from "next/server"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { requirePermission } from "@/lib/admin-auth"

const resolveMediaBucket = () => process.env.SUPABASE_MEDIA_BUCKET ?? "media"

export async function GET() {
  const guard = await requirePermission("backups:read")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }

  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 })
  }

  const [services, destinations, banners, sections, requests, auditLogs] = await Promise.all([
    supabase.from("content_services").select("*").order("position", { ascending: true }),
    supabase.from("content_destinations").select("*").order("position", { ascending: true }),
    supabase.from("content_banners").select("*").order("position", { ascending: true }),
    supabase.from("content_sections").select("*").order("position", { ascending: true }),
    supabase.from("concierge_requests").select("*").order("submitted_at", { ascending: false }),
    supabase.from("audit_logs").select("*").order("created_at", { ascending: false }),
  ])

  const bucket = resolveMediaBucket()
  const media = await supabase.storage.from(bucket).list("", { limit: 1000, sortBy: { column: "name", order: "asc" } })

  const backup = {
    generatedAt: new Date().toISOString(),
    tables: {
      content_services: services.data ?? [],
      content_destinations: destinations.data ?? [],
      content_banners: banners.data ?? [],
      content_sections: sections.data ?? [],
      concierge_requests: requests.data ?? [],
      audit_logs: auditLogs.data ?? [],
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
