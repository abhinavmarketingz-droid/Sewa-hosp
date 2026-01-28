import { createAdminClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AdminChatPanel } from "@/components/admin/admin-chat-panel"

async function getAdminUser() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("admin_session")?.value
  if (!sessionToken) return null

  const supabase = await createAdminClient()
  const { data: session } = await supabase
    .from("admin_sessions")
    .select("*, admin_users(*)")
    .eq("token", sessionToken)
    .gt("expires_at", new Date().toISOString())
    .single()

  return session?.admin_users || null
}

async function getChatSessions() {
  const supabase = await createAdminClient()

  const { data: sessions } = await supabase
    .from("chat_sessions")
    .select("*, chat_messages(count)")
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })

  return sessions || []
}

export default async function AdminChatPage() {
  const admin = await getAdminUser()
  if (!admin) redirect("/admin/login")

  const sessions = await getChatSessions()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Live Chat</h1>
        <p className="text-muted-foreground">Manage and respond to visitor chat sessions</p>
      </div>

      <AdminChatPanel sessions={sessions} adminName={admin.name} />
    </div>
  )
}
