import type React from "react"
import { cookies } from "next/headers"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { createAdminClient } from "@/lib/supabase/server"

async function getAdminUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("admin_session")?.value

  if (!sessionToken) return null

  const supabase = await createAdminClient()

  // Verify session
  const { data: session } = await supabase
    .from("admin_sessions")
    .select("*, admin_users(*)")
    .eq("token", sessionToken)
    .gt("expires_at", new Date().toISOString())
    .single()

  if (!session) return null

  return session.admin_users
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminUser()

  // Allow login page without auth
  // Middleware handles redirect for other admin pages

  return (
    <div className="min-h-screen bg-background">
      {admin ? (
        <div className="flex">
          <AdminSidebar admin={admin} />
          <main className="flex-1 ml-64 p-8">{children}</main>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
