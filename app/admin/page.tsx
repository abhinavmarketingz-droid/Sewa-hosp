import { format } from "date-fns"
import { getSupabaseAdminClient } from "@/lib/supabase-server"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AdminAuthBar } from "@/components/admin/admin-auth-bar"
import { AdminContentManager } from "@/components/admin/admin-content-manager"
import { AdminUserManager } from "@/components/admin/admin-user-manager"
import { AdminAuditLog } from "@/components/admin/admin-audit-log"
import { AdminBackups } from "@/components/admin/admin-backups"
import { AdminMediaManager } from "@/components/admin/admin-media-manager"
import { AdminExtensions } from "@/components/admin/admin-extensions"
import { AdminLicenseStatus } from "@/components/admin/admin-license-status"
import { AdminThemeManager } from "@/components/admin/admin-theme-manager"
import {
  defaultBanners,
  defaultCustomSections,
  defaultDestinations,
  defaultServices,
  mapDbBannerToContent,
  mapDbDestinationToContent,
  mapDbSectionToContent,
  mapDbServiceToContent,
  type BannerContent,
  type CustomSectionContent,
  type DestinationContent,
  type ServiceContent,
} from "@/lib/content"
import { getAdminContext } from "@/lib/admin-auth"
import { hasPermission } from "@/lib/rbac"

type ConciergeRequest = {
  id: string
  name: string
  email: string
  nationality: string | null
  service_interest: string
  preferred_language: string | null
  message: string
  submitted_at: string
  ip_address: string | null
  user_agent: string | null
}

const formatTimestamp = (value: string) => {
  try {
    return format(new Date(value), "PPP p")
  } catch {
    return value
  }
}

export default async function AdminPage() {
  const context = await getAdminContext()
  if (!context) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Admin Dashboard</CardTitle>
              <CardDescription>Sign in to access the admin console.</CardDescription>
            </CardHeader>
          </Card>
        </section>
      </main>
    )
  }

  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Admin Dashboard</CardTitle>
              <CardDescription>Admin access is enabled, but Supabase is not configured.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                Add SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY to enable
                concierge request storage and viewing.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    )
  }

  const { data, error } = await supabase
    .from("concierge_requests")
    .select("*")
    .order("submitted_at", { ascending: false })
    .limit(200)

  const [servicesResponse, destinationsResponse, bannersResponse, sectionsResponse] = await Promise.all([
    supabase.from("content_services").select("*").order("position", { ascending: true }),
    supabase.from("content_destinations").select("*").order("position", { ascending: true }),
    supabase.from("content_banners").select("*").order("position", { ascending: true }),
    supabase.from("content_sections").select("*").order("position", { ascending: true }),
  ])

  const servicesData = servicesResponse.data?.map((item) => mapDbServiceToContent(item))
  const services =
    servicesResponse.error || !servicesData?.length ? defaultServices : (servicesData as ServiceContent[])
  const destinationsData = destinationsResponse.data?.map((item) => mapDbDestinationToContent(item))
  const destinations =
    destinationsResponse.error || !destinationsData?.length
      ? defaultDestinations
      : (destinationsData as DestinationContent[])
  const bannersData = bannersResponse.data?.map((item) => mapDbBannerToContent(item))
  const banners =
    bannersResponse.error || !bannersData?.length ? defaultBanners : (bannersData as BannerContent[])
  const sectionsData = sectionsResponse.data?.map((item) => mapDbSectionToContent(item))
  const sections =
    sectionsResponse.error || !sectionsData?.length
      ? defaultCustomSections
      : (sectionsData as CustomSectionContent[])

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-serif">Admin Dashboard</CardTitle>
              <CardDescription>Unable to load concierge requests.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>{error.message}</p>
            </CardContent>
          </Card>
        </section>
      </main>
    )
  }

  const requests = (data ?? []) as ConciergeRequest[]
  const canReadRequests = hasPermission(context.role, "requests:read")
  const canEditContent = hasPermission(context.role, "content:write")
  const canManageUsers = hasPermission(context.role, "users:write")
  const canReadAudit = hasPermission(context.role, "audit:read")

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-serif font-semibold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Review the latest concierge requests submitted from the website.
          </p>
        </div>

        <AdminAuthBar email={context.email} />

        {canReadRequests ? (
          requests.length === 0 ? (
            <Empty className="border-dashed bg-card">
              <EmptyHeader>
                <EmptyTitle>No requests yet</EmptyTitle>
                <EmptyDescription>Concierge requests will appear here once submitted.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-serif">Concierge Requests</CardTitle>
                <CardDescription>Showing the most recent {requests.length} submissions.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Language</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-medium text-foreground">{request.name}</span>
                            <span className="text-xs text-muted-foreground">{request.nationality ?? "—"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{request.service_interest}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {request.preferred_language ?? "—"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatTimestamp(request.submitted_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            <a className="text-primary underline-offset-4 hover:underline" href={`mailto:${request.email}`}>
                              {request.email}
                            </a>
                            <span className="text-xs text-muted-foreground line-clamp-2">{request.message}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-serif">Concierge Requests</CardTitle>
              <CardDescription>You do not have permission to view concierge requests.</CardDescription>
            </CardHeader>
          </Card>
        )}

        <AdminContentManager
          initialServices={services}
          initialDestinations={destinations}
          initialBanners={banners}
          initialSections={sections}
          canEdit={canEditContent}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {hasPermission(context.role, "content:read") ? <AdminMediaManager /> : null}
          {hasPermission(context.role, "backups:read") ? <AdminBackups /> : null}
        </div>

        {hasPermission(context.role, "extensions:read") ? <AdminExtensions /> : null}

        {hasPermission(context.role, "license:read") ? <AdminLicenseStatus /> : null}

        {hasPermission(context.role, "theme:read") ? <AdminThemeManager /> : null}

        <AdminUserManager canManage={canManageUsers} />

        <AdminAuditLog canRead={canReadAudit} />
      </section>
    </main>
  )
}
