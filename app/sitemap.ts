import type { MetadataRoute } from "next"
import { getSupabaseAdminClient } from "@/lib/supabase-server"

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sewa-hospitality.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/services`, lastModified: new Date() },
    { url: `${baseUrl}/destinations`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
  ]

  const supabase = getSupabaseAdminClient()
  if (!supabase) {
    return routes
  }

  const { data } = await supabase.from("pages").select("slug,updated_at,status")
  const publishedPages = (data ?? []).filter((page) => page.status === "published" && page.slug)

  publishedPages.forEach((page) => {
    routes.push({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updated_at ? new Date(page.updated_at) : new Date(),
    })
  })

  return routes
}
