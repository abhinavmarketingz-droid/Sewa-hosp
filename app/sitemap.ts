import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sewa-hospitality.com"

  // Static pages
  const staticPages = [
    { url: "", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/destinations", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/corporate", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/partners", priority: 0.7, changeFrequency: "monthly" as const },
    { url: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
  ]

  // Dynamic pages from database
  const supabase = await createClient()

  // Get services
  const { data: services } = await supabase.from("services").select("slug, updated_at").eq("is_published", true)

  // Get destinations
  const { data: destinations } = await supabase.from("destinations").select("slug, updated_at").eq("is_published", true)

  // Languages for alternate versions
  const languages = ["en", "hi", "ja", "ko", "de", "fr", "es", "ru", "zh", "tr"]

  // Build sitemap entries
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Static pages with language alternates
  for (const page of staticPages) {
    sitemapEntries.push({
      url: `${baseUrl}${page.url}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: languages.reduce(
          (acc, lang) => {
            acc[lang] = `${baseUrl}${page.url}${page.url ? "" : ""}?lang=${lang}`
            return acc
          },
          {} as Record<string, string>,
        ),
      },
    })
  }

  // Service pages
  services?.forEach((service) => {
    sitemapEntries.push({
      url: `${baseUrl}/services#${service.slug}`,
      lastModified: new Date(service.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  })

  // Destination pages
  destinations?.forEach((destination) => {
    sitemapEntries.push({
      url: `${baseUrl}/destinations#${destination.slug}`,
      lastModified: new Date(destination.updated_at),
      changeFrequency: "weekly",
      priority: 0.8,
    })
  })

  return sitemapEntries
}
