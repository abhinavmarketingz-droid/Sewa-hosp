import { headers } from "next/headers"
import { getSupabaseAdminClient } from "@/lib/supabase-server"

type AuditAction =
  | "content.create"
  | "content.update"
  | "content.delete"
  | "user.role.update"
  | "auth.login"
  | "auth.logout"

type AuditPayload = {
  actorId: string
  actorEmail: string | null
  action: AuditAction
  resource: string
  metadata?: Record<string, unknown>
}

export const logAudit = async ({ actorId, actorEmail, action, resource, metadata }: AuditPayload) => {
  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return
  }

  const headerStore = headers()
  const ipAddress = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null
  const userAgent = headerStore.get("user-agent")

  await supabase.from("audit_logs").insert([
    {
      actor_id: actorId,
      actor_email: actorEmail,
      action,
      resource,
      metadata: metadata ?? {},
      ip_address: ipAddress,
      user_agent: userAgent,
    },
  ])
}
