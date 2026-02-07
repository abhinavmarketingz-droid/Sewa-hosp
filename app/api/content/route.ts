import { NextResponse } from "next/server"
import { defaultBanners, defaultCustomSections, defaultDestinations, defaultServices } from "@/lib/content"
import { getSupabaseAdminClient } from "@/lib/supabase-server"

const mapDestinations = (data: Array<Record<string, unknown>> | null) =>
  (data ?? []).map((item) => ({
    ...item,
    imageUrl: (item.image_url as string | null) ?? (item.imageUrl as string | null) ?? undefined,
  }))

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

  const services = (servicesResponse.data ?? defaultServices).map((item) => ({
    ...item,
    titleKey: (item as { title_key?: string | null; titleKey?: string }).title_key ?? item.titleKey,
  }))
  const destinations = mapDestinations(destinationsResponse.data ?? null)
  const banners = (bannerResponse.data ?? defaultBanners).map((item) => ({
    ...item,
    ctaLabel: (item as { cta_label?: string | null }).cta_label ?? item.ctaLabel,
    ctaUrl: (item as { cta_url?: string | null }).cta_url ?? item.ctaUrl,
    active: (item as { active?: boolean | null }).active ?? true,
  }))
  const sections = (sectionsResponse.data ?? defaultCustomSections).map((item) => ({
    ...item,
    imageUrl: (item as { image_url?: string | null }).image_url ?? item.imageUrl,
    ctaLabel: (item as { cta_label?: string | null }).cta_label ?? item.ctaLabel,
    ctaUrl: (item as { cta_url?: string | null }).cta_url ?? item.ctaUrl,
    active: (item as { active?: boolean | null }).active ?? true,
  }))

  return NextResponse.json({
    services,
    destinations: destinations.length ? destinations : defaultDestinations,
    banners: banners.length ? banners : defaultBanners,
    sections: sections.length ? sections : defaultCustomSections,
  })
}
