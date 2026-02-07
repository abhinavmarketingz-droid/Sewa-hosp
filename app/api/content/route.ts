import { NextResponse } from "next/server"
import { defaultDestinations, defaultServices } from "@/lib/content"
import { getSupabaseAdminClient } from "@/lib/supabase-server"

const mapDestinations = (data: Array<Record<string, unknown>> | null) =>
  (data ?? []).map((item) => ({
    ...item,
    imageUrl: (item.image_url as string | null) ?? (item.imageUrl as string | null) ?? undefined,
  }))

export async function GET() {
  const supabase = getSupabaseAdminClient()

  if (!supabase) {
    return NextResponse.json({ services: defaultServices, destinations: defaultDestinations })
  }

  const [servicesResponse, destinationsResponse] = await Promise.all([
    supabase.from("content_services").select("*").order("position", { ascending: true }),
    supabase.from("content_destinations").select("*").order("position", { ascending: true }),
  ])

  if (servicesResponse.error || destinationsResponse.error) {
    return NextResponse.json({ services: defaultServices, destinations: defaultDestinations })
  }

  const services = (servicesResponse.data ?? defaultServices).map((item) => ({
    ...item,
    titleKey: (item as { title_key?: string | null; titleKey?: string }).title_key ?? item.titleKey,
  }))
  const destinations = mapDestinations(destinationsResponse.data ?? null)

  return NextResponse.json({
    services,
    destinations: destinations.length ? destinations : defaultDestinations,
  })
}
