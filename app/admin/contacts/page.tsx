import { Card } from "@/components/ui/card"
import { createAdminClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { ContactsTable } from "@/components/admin/contacts-table"

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

async function getContacts() {
  const supabase = await createAdminClient()

  const { data: contacts } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })

  return contacts || []
}

export default async function AdminContactsPage() {
  const admin = await getAdminUser()
  if (!admin) redirect("/admin/login")

  const contacts = await getContacts()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Contact Submissions</h1>
        <p className="text-muted-foreground">Manage and respond to contact form submissions</p>
      </div>

      <Card className="p-6">
        <ContactsTable contacts={contacts} />
      </Card>
    </div>
  )
}
