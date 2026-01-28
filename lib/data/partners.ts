import { createClient } from "@/lib/supabase/server"
import type { Partner } from "@/lib/supabase/types"

const FALLBACK_PARTNERS: Partner[] = [
  {
    id: "partner-1",
    name: "Apollo Hospitals",
    category: "Healthcare",
    description: "Asia's largest integrated healthcare group",
    logo_url: "/placeholder.svg?height=80&width=200&query=apollo hospitals logo",
    website_url: "https://apollohospitals.com",
    display_order: 1,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "partner-2",
    name: "Oberoi Hotels",
    category: "Hospitality",
    description: "Iconic luxury hotel chain with heritage properties",
    logo_url: "/placeholder.svg?height=80&width=200&query=oberoi hotels logo",
    website_url: "https://oberoihotels.com",
    display_order: 2,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "partner-3",
    name: "Taj Hotels",
    category: "Hospitality",
    description: "India's premier luxury hotel brand",
    logo_url: "/placeholder.svg?height=80&width=200&query=taj hotels logo",
    website_url: "https://tajhotels.com",
    display_order: 3,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "partner-4",
    name: "Air India",
    category: "Aviation",
    description: "India's flagship carrier for premium travel",
    logo_url: "/placeholder.svg?height=80&width=200&query=air india logo",
    website_url: "https://airindia.com",
    display_order: 4,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "partner-5",
    name: "Max Healthcare",
    category: "Healthcare",
    description: "Leading private healthcare provider in North India",
    logo_url: "/placeholder.svg?height=80&width=200&query=max healthcare logo",
    website_url: "https://maxhealthcare.in",
    display_order: 5,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "partner-6",
    name: "Incredible India",
    category: "Tourism",
    description: "Official tourism partner of Government of India",
    logo_url: "/placeholder.svg?height=80&width=200&query=incredible india tourism logo",
    website_url: "https://incredibleindia.org",
    display_order: 6,
    is_featured: true,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function getPartners(options?: {
  featured?: boolean
  category?: string
  limit?: number
}): Promise<Partner[]> {
  try {
    const supabase = await createClient()

    let query = supabase.from("partners").select("*").eq("is_published", true).order("display_order", { ascending: true })

    if (options?.featured) {
      query = query.eq("is_featured", true)
    }

    if (options?.category) {
      query = query.eq("category", options.category)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching partners:", error.message)
      return FALLBACK_PARTNERS
    }

    return data || FALLBACK_PARTNERS
  } catch (error) {
    console.error("[v0] Exception fetching partners:", error instanceof Error ? error.message : String(error))
    return FALLBACK_PARTNERS
  }
}
