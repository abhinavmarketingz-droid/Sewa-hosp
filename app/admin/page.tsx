import { Card } from "@/components/ui/card"
import { createAdminClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { MessageSquare, Mail, BarChart3, TrendingUp, Eye, Clock, Globe } from "lucide-react"

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

async function getDashboardStats() {
  const supabase = await createAdminClient()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayISO = today.toISOString()

  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekAgoISO = weekAgo.toISOString()

  // Get counts
  const [
    { count: totalContacts },
    { count: newContactsToday },
    { count: activeChatSessions },
    { count: totalVisitorsToday },
    { count: totalVisitorsWeek },
  ] = await Promise.all([
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
    supabase.from("chat_sessions").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("visitor_analytics").select("*", { count: "exact", head: true }).gte("created_at", todayISO),
    supabase.from("visitor_analytics").select("*", { count: "exact", head: true }).gte("created_at", weekAgoISO),
  ])

  // Get recent contacts
  const { data: recentContacts } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  // Get recent chat sessions
  const { data: recentChats } = await supabase
    .from("chat_sessions")
    .select("*, chat_messages(count)")
    .order("created_at", { ascending: false })
    .limit(5)

  // Get top pages
  const { data: topPages } = await supabase
    .from("visitor_analytics")
    .select("page_path")
    .gte("created_at", weekAgoISO)
    .limit(100)

  const pageViews = topPages?.reduce(
    (acc, { page_path }) => {
      acc[page_path] = (acc[page_path] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const topPagesArray = Object.entries(pageViews || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return {
    totalContacts: totalContacts || 0,
    newContactsToday: newContactsToday || 0,
    activeChatSessions: activeChatSessions || 0,
    totalVisitorsToday: totalVisitorsToday || 0,
    totalVisitorsWeek: totalVisitorsWeek || 0,
    recentContacts: recentContacts || [],
    recentChats: recentChats || [],
    topPages: topPagesArray,
  }
}

export default async function AdminDashboard() {
  const admin = await getAdminUser()
  if (!admin) redirect("/admin/login")

  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {admin.name}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalContacts}</p>
              <p className="text-sm text-muted-foreground">Total Contacts</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-green-500">{stats.newContactsToday} new today</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.activeChatSessions}</p>
              <p className="text-sm text-muted-foreground">Active Chats</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Live sessions</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalVisitorsToday}</p>
              <p className="text-sm text-muted-foreground">Visitors Today</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4" />
            <span>{stats.totalVisitorsWeek} this week</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Globe className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.topPages.length}</p>
              <p className="text-sm text-muted-foreground">Active Pages</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Contacts */}
        <Card className="p-6">
          <h2 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Recent Contact Submissions
          </h2>
          <div className="space-y-4">
            {stats.recentContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No contact submissions yet</p>
            ) : (
              stats.recentContacts.map(
                (contact: {
                  id: string
                  name: string
                  email: string
                  service_interest: string
                  status: string
                  created_at: string
                }) => (
                  <div
                    key={contact.id}
                    className="flex items-start justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-muted-foreground">{contact.email}</p>
                      <p className="text-xs text-primary mt-1">{contact.service_interest}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          contact.status === "new"
                            ? "bg-green-500/20 text-green-700"
                            : contact.status === "contacted"
                              ? "bg-blue-500/20 text-blue-700"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {contact.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(contact.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </Card>

        {/* Recent Chats */}
        <Card className="p-6">
          <h2 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Recent Chat Sessions
          </h2>
          <div className="space-y-4">
            {stats.recentChats.length === 0 ? (
              <p className="text-sm text-muted-foreground">No chat sessions yet</p>
            ) : (
              stats.recentChats.map(
                (chat: {
                  id: string
                  visitor_name: string | null
                  visitor_email: string | null
                  status: string
                  created_at: string
                  chat_messages: { count: number }[]
                }) => (
                  <div
                    key={chat.id}
                    className="flex items-start justify-between border-b border-border pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{chat.visitor_name || "Anonymous"}</p>
                      <p className="text-sm text-muted-foreground">{chat.visitor_email || "No email"}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {chat.chat_messages?.[0]?.count || 0} messages
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          chat.status === "active"
                            ? "bg-green-500/20 text-green-700"
                            : chat.status === "waiting"
                              ? "bg-yellow-500/20 text-yellow-700"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {chat.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(chat.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ),
              )
            )}
          </div>
        </Card>
      </div>

      {/* Top Pages */}
      <Card className="p-6">
        <h2 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Top Pages This Week
        </h2>
        <div className="space-y-3">
          {stats.topPages.map(([path, views], idx) => (
            <div key={path} className="flex items-center gap-4">
              <span className="text-sm font-medium w-6">{idx + 1}.</span>
              <div className="flex-1">
                <p className="text-sm font-medium">{path}</p>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${(views / (stats.topPages[0]?.[1] || 1)) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-muted-foreground">{views} views</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
