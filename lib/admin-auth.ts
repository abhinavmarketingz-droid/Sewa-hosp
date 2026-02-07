import { createSupabaseServerClient } from "@/lib/supabase-auth"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { hasPermission, type Permission, type Role } from "@/lib/rbac"

type AdminContext = {
  userId: string
  email: string | null
  role: Role
}

const resolveRole = (value: string | null): Role => {
  if (value === "admin" || value === "editor" || value === "viewer") {
    return value
  }
  return "viewer"
}

export const getAdminContext = async (): Promise<AdminContext | null> => {
  const supabase = createSupabaseServerClient()
  if (!supabase) {
    return null
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const adminClient = getSupabaseAdminClient()
  if (!adminClient) {
    return null
  }

  const { data: profile, error } = await adminClient
    .from("profiles")
    .select("role,email")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    return null
  }

  return {
    userId: user.id,
    email: profile.email ?? user.email ?? null,
    role: resolveRole(profile.role ?? "viewer"),
  }
}

export const requirePermission = async (permission: Permission) => {
  const context = await getAdminContext()
  if (!context) {
    return { ok: false as const, error: "Unauthorized" }
  }

  if (!hasPermission(context.role, permission)) {
    return { ok: false as const, error: "Forbidden" }
  }

  return { ok: true as const, context }
}
