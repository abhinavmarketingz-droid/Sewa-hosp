import { createClient } from "@/lib/supabase/server"
import type { Service } from "@/lib/supabase/types"

// Fallback data for development/offline mode
const FALLBACK_SERVICES: Service[] = [
  {
    id: "svc-1",
    slug: "medical-tourism",
    title: "Medical Tourism",
    title_hi: "चिकित्सा पर्यटन",
    title_ja: null,
    title_ko: null,
    title_fr: null,
    title_de: null,
    title_es: null,
    title_ru: null,
    title_zh: null,
    title_tr: null,
    description: "World-class healthcare at affordable prices with personalized care coordination",
    description_hi: null,
    description_ja: null,
    description_ko: null,
    description_fr: null,
    description_de: null,
    description_es: null,
    description_ru: null,
    description_zh: null,
    description_tr: null,
    items: ["Hospital appointments", "Treatment planning", "Recovery accommodation", "Medical visa assistance"],
    icon: "Stethoscope",
    image_url: "/placeholder.svg?height=400&width=600&query=medical tourism hospital india",
    display_order: 1,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "svc-2",
    slug: "luxury-travel",
    title: "Luxury Travel",
    title_hi: "विलासिता यात्रा",
    title_ja: null,
    title_ko: null,
    title_fr: null,
    title_de: null,
    title_es: null,
    title_ru: null,
    title_zh: null,
    title_tr: null,
    description: "Bespoke luxury experiences across India's most exclusive destinations",
    description_hi: null,
    description_ja: null,
    description_ko: null,
    description_fr: null,
    description_de: null,
    description_es: null,
    description_ru: null,
    description_zh: null,
    description_tr: null,
    items: ["Private jets & helicopters", "Palace stays", "Exclusive experiences", "Personal concierge"],
    icon: "Crown",
    image_url: "/placeholder.svg?height=400&width=600&query=luxury travel palace india",
    display_order: 2,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "svc-3",
    slug: "wellness-retreats",
    title: "Wellness Retreats",
    title_hi: "कल्याण रिट्रीट",
    title_ja: null,
    title_ko: null,
    title_fr: null,
    title_de: null,
    title_es: null,
    title_ru: null,
    title_zh: null,
    title_tr: null,
    description: "Authentic Ayurveda, yoga, and holistic healing programs",
    description_hi: null,
    description_ja: null,
    description_ko: null,
    description_fr: null,
    description_de: null,
    description_es: null,
    description_ru: null,
    description_zh: null,
    description_tr: null,
    items: ["Ayurveda treatments", "Yoga programs", "Meditation retreats", "Spa therapies"],
    icon: "Leaf",
    image_url: "/placeholder.svg?height=400&width=600&query=wellness retreat yoga india",
    display_order: 3,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "svc-4",
    slug: "corporate-services",
    title: "Corporate Services",
    title_hi: "कॉर्पोरेट सेवाएं",
    title_ja: null,
    title_ko: null,
    title_fr: null,
    title_de: null,
    title_es: null,
    title_ru: null,
    title_zh: null,
    title_tr: null,
    description: "End-to-end corporate travel management and MICE solutions",
    description_hi: null,
    description_ja: null,
    description_ko: null,
    description_fr: null,
    description_de: null,
    description_es: null,
    description_ru: null,
    description_zh: null,
    description_tr: null,
    items: ["Conference planning", "Executive travel", "Team retreats", "Incentive trips"],
    icon: "Building2",
    image_url: "/placeholder.svg?height=400&width=600&query=corporate conference india",
    display_order: 4,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "svc-5",
    slug: "destination-weddings",
    title: "Destination Weddings",
    title_hi: "गंतव्य शादियाँ",
    title_ja: null,
    title_ko: null,
    title_fr: null,
    title_de: null,
    title_es: null,
    title_ru: null,
    title_zh: null,
    title_tr: null,
    description: "Create unforgettable celebrations at India's most stunning venues",
    description_hi: null,
    description_ja: null,
    description_ko: null,
    description_fr: null,
    description_de: null,
    description_es: null,
    description_ru: null,
    description_zh: null,
    description_tr: null,
    items: ["Venue selection", "Wedding planning", "Guest management", "Cultural ceremonies"],
    icon: "Heart",
    image_url: "/placeholder.svg?height=400&width=600&query=destination wedding palace india",
    display_order: 5,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "svc-6",
    slug: "heritage-tours",
    title: "Heritage Tours",
    title_hi: "विरासत पर्यटन",
    title_ja: null,
    title_ko: null,
    title_fr: null,
    title_de: null,
    title_es: null,
    title_ru: null,
    title_zh: null,
    title_tr: null,
    description: "Discover India's rich history and cultural treasures",
    description_hi: null,
    description_ja: null,
    description_ko: null,
    description_fr: null,
    description_de: null,
    description_es: null,
    description_ru: null,
    description_zh: null,
    description_tr: null,
    items: ["Expert guides", "Private tours", "Cultural immersion", "Historical sites"],
    icon: "Landmark",
    image_url: "/placeholder.svg?height=400&width=600&query=heritage tour taj mahal india",
    display_order: 6,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function getServices(options?: {
  featured?: boolean
  limit?: number
}): Promise<Service[]> {
  try {
    const supabase = await createClient()

    let query = supabase.from("services").select("*").eq("is_published", true).order("display_order", { ascending: true })

    if (options?.featured) {
      query = query.eq("is_featured", true)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching services from Supabase:", error.message)
      return FALLBACK_SERVICES
    }

    return data || FALLBACK_SERVICES
  } catch (error) {
    console.error("[v0] Exception fetching services:", error instanceof Error ? error.message : String(error))
    return FALLBACK_SERVICES
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("services").select("*").eq("slug", slug).eq("is_published", true).single()

    if (error) {
      console.error("[v0] Error fetching service by slug:", error.message)
      return FALLBACK_SERVICES.find(s => s.slug === slug) || null
    }

    return data
  } catch (error) {
    console.error("[v0] Exception fetching service by slug:", error instanceof Error ? error.message : String(error))
    return FALLBACK_SERVICES.find(s => s.slug === slug) || null
  }
}
