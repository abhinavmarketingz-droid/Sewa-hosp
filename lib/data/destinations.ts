import { createClient } from "@/lib/supabase/server"
import type { Destination } from "@/lib/supabase/types"

const FALLBACK_DESTINATIONS: Destination[] = [
  {
    id: "dest-1",
    slug: "delhi",
    name: "Delhi",
    name_hi: "दिल्ली",
    headline: "Gateway to India",
    headline_hi: "भारत का प्रवेश द्वार",
    description: "India's capital blends ancient monuments with modern sophistication",
    description_hi: null,
    icon: "Building",
    services: ["Medical Tourism", "Corporate Services", "Heritage Tours"],
    highlights: ["Red Fort", "India Gate", "Qutub Minar"],
    image_url: "/placeholder.svg?height=400&width=600&query=delhi india gate skyline",
    gallery_images: [],
    display_order: 1,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dest-2",
    slug: "mumbai",
    name: "Mumbai",
    name_hi: "मुंबई",
    headline: "City of Dreams",
    headline_hi: "सपनों का शहर",
    description: "Financial capital with world-class healthcare and luxury experiences",
    description_hi: null,
    icon: "Building2",
    services: ["Medical Tourism", "Luxury Travel", "Corporate Services"],
    highlights: ["Gateway of India", "Marine Drive", "Elephanta Caves"],
    image_url: "/placeholder.svg?height=400&width=600&query=mumbai gateway of india skyline",
    gallery_images: [],
    display_order: 2,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dest-3",
    slug: "rajasthan",
    name: "Rajasthan",
    name_hi: "राजस्थान",
    headline: "Land of Kings",
    headline_hi: "राजाओं की भूमि",
    description: "Royal palaces, desert adventures, and timeless traditions",
    description_hi: null,
    icon: "Crown",
    services: ["Luxury Travel", "Destination Weddings", "Heritage Tours"],
    highlights: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer"],
    image_url: "/placeholder.svg?height=400&width=600&query=rajasthan palace udaipur india",
    gallery_images: [],
    display_order: 3,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dest-4",
    slug: "kerala",
    name: "Kerala",
    name_hi: "केरल",
    headline: "God's Own Country",
    headline_hi: "भगवान की अपनी जगह",
    description: "Backwaters, beaches, and authentic Ayurveda wellness",
    description_hi: null,
    icon: "Palmtree",
    services: ["Wellness Retreats", "Luxury Travel", "Medical Tourism"],
    highlights: ["Backwaters", "Ayurveda", "Hill Stations"],
    image_url: "/placeholder.svg?height=400&width=600&query=kerala backwaters houseboat india",
    gallery_images: [],
    display_order: 4,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dest-5",
    slug: "goa",
    name: "Goa",
    name_hi: "गोवा",
    headline: "Beach Paradise",
    headline_hi: "समुद्र तट स्वर्ग",
    description: "Sun, sand, and Portuguese heritage on India's western coast",
    description_hi: null,
    icon: "Umbrella",
    services: ["Destination Weddings", "Wellness Retreats", "Luxury Travel"],
    highlights: ["Beaches", "Churches", "Nightlife"],
    image_url: "/placeholder.svg?height=400&width=600&query=goa beach sunset india",
    gallery_images: [],
    display_order: 5,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dest-6",
    slug: "varanasi",
    name: "Varanasi",
    name_hi: "वाराणसी",
    headline: "Spiritual Capital",
    headline_hi: "आध्यात्मिक राजधानी",
    description: "Ancient city of enlightenment on the sacred Ganges",
    description_hi: null,
    icon: "Sparkles",
    services: ["Heritage Tours", "Wellness Retreats"],
    highlights: ["Ghats", "Temples", "Ceremonies"],
    image_url: "/placeholder.svg?height=400&width=600&query=varanasi ganges ghats india",
    gallery_images: [],
    display_order: 6,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function getDestinations(options?: {
  featured?: boolean
  limit?: number
}): Promise<Destination[]> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from("destinations")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })

    if (options?.featured) {
      query = query.eq("is_featured", true)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching destinations:", error.message)
      return FALLBACK_DESTINATIONS
    }

    return data || FALLBACK_DESTINATIONS
  } catch (error) {
    console.error("[v0] Exception fetching destinations:", error instanceof Error ? error.message : String(error))
    return FALLBACK_DESTINATIONS
  }
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("destinations")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single()

    if (error) {
      console.error("[v0] Error fetching destination:", error.message)
      return FALLBACK_DESTINATIONS.find(d => d.slug === slug) || null
    }

    return data
  } catch (error) {
    console.error("[v0] Exception fetching destination:", error instanceof Error ? error.message : String(error))
    return FALLBACK_DESTINATIONS.find(d => d.slug === slug) || null
  }
}
