import { NextResponse } from "next/server"
import {
  defaultBanners,
  defaultCustomSections,
  defaultDestinations,
  defaultServices,
  mapDbBannerToContent,
  mapDbDestinationToContent,
  mapDbSectionToContent,
  mapDbServiceToContent,
} from "@/lib/content"
import { getSupabaseAdminClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return NextResponse.json({
      services: defaultServices,
      destinations: defaultDestinations,
      banners: defaultBanners,
      sections: defaultCustomSections,
    })
  }

  const [servicesResponse, destinationsResponse] = await Promise.all([
    supabase.from("content_services").select("*").order("position", { ascending: true }),
    supabase.from("content_destinations").select("*").order("position", { ascending: true }),
  ])

  const [bannerResponse, sectionsResponse] = await Promise.all([
    supabase.from("content_banners").select("*").order("position", { ascending: true }),
    supabase.from("content_sections").select("*").order("position", { ascending: true }),
  ])

  if (servicesResponse.error || destinationsResponse.error || bannerResponse.error || sectionsResponse.error) {
    return NextResponse.json({
      services: defaultServices,
      destinations: defaultDestinations,
      banners: defaultBanners,
      sections: defaultCustomSections,
    })
  }

  const services = (servicesResponse.data ?? defaultServices).map((item) => mapDbServiceToContent(item))
  const destinations = (destinationsResponse.data ?? defaultDestinations).map((item) =>
    mapDbDestinationToContent(item),
  )
  const banners = (bannerResponse.data ?? defaultBanners).map((item) => ({
    ...mapDbBannerToContent(item),
    active: (item as { active?: boolean | null }).active ?? true,
  }))
  const sections = (sectionsResponse.data ?? defaultCustomSections).map((item) => ({
    ...mapDbSectionToContent(item),
    active: (item as { active?: boolean | null }).active ?? true,
  }))

  return NextResponse.json({
    services,
    destinations: destinations.length ? destinations : defaultDestinations,
    banners: banners.length ? banners : defaultBanners,
    sections: sections.length ? sections : defaultCustomSections,
  })
}
