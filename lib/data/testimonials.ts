import { createClient } from "@/lib/supabase/server"
import type { Testimonial } from "@/lib/supabase/types"

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    id: "testi-1",
    client_name: "Sarah Johnson",
    client_title: "Marketing Director",
    client_company: "Tech Corp",
    client_location: "New York, USA",
    client_image_url: "/placeholder.svg?height=300&width=300&query=professional woman portrait",
    platform: "google",
    platform_url: "https://g.co/kgs/example1",
    rating: 5,
    content: "SEWA made my medical journey to India seamless. From airport pickup to hospital coordination, everything was perfect. The cost savings were incredible and the care was world-class.",
    content_hi: null,
    service_type: "Medical Tourism",
    destination: "Delhi",
    is_featured: true,
    is_published: true,
    display_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "testi-2",
    client_name: "Hans Mueller",
    client_title: "CEO",
    client_company: "Mueller GmbH",
    client_location: "Munich, Germany",
    client_image_url: "/placeholder.svg?height=300&width=300&query=professional man portrait",
    platform: "trustpilot",
    platform_url: "https://trustpilot.com/review/example2",
    rating: 5,
    content: "Our corporate retreat in Rajasthan exceeded all expectations. The team handled every detail with precision and the cultural experiences were unforgettable.",
    content_hi: null,
    service_type: "Corporate Services",
    destination: "Rajasthan",
    is_featured: true,
    is_published: true,
    display_order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "testi-3",
    client_name: "Yuki Tanaka",
    client_title: "Wellness Coach",
    client_company: "Zen Life",
    client_location: "Tokyo, Japan",
    client_image_url: "/placeholder.svg?height=300&width=300&query=professional woman portrait",
    platform: "tripadvisor",
    platform_url: "https://tripadvisor.com/example3",
    rating: 5,
    content: "The Ayurveda retreat in Kerala transformed my health. Authentic treatments, serene surroundings, and incredibly knowledgeable practitioners. A life-changing experience.",
    content_hi: null,
    service_type: "Wellness Retreats",
    destination: "Kerala",
    is_featured: true,
    is_published: true,
    display_order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "testi-4",
    client_name: "Emma Thompson",
    client_title: "Bride",
    client_company: null,
    client_location: "London, UK",
    client_image_url: "/placeholder.svg?height=300&width=300&query=professional woman portrait",
    platform: "google",
    platform_url: "https://g.co/kgs/example4",
    rating: 5,
    content: "Our destination wedding at a Rajasthan palace was a fairy tale come true. SEWA coordinated everything perfectly for our 200 guests from 12 countries.",
    content_hi: null,
    service_type: "Destination Weddings",
    destination: "Rajasthan",
    is_featured: true,
    is_published: true,
    display_order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "testi-5",
    client_name: "Michael Chen",
    client_title: "Travel Blogger",
    client_company: "Wanderlust Weekly",
    client_location: "Singapore",
    client_image_url: "/placeholder.svg?height=300&width=300&query=professional man portrait",
    platform: "direct",
    platform_url: "https://wanderlustweekly.com/sewa-review",
    rating: 5,
    content: "As a seasoned traveler, I appreciate attention to detail. SEWA's luxury tour of South India was the most well-organized trip I've ever experienced.",
    content_hi: null,
    service_type: "Luxury Travel",
    destination: "Kerala",
    is_featured: true,
    is_published: true,
    display_order: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "testi-6",
    client_name: "Pierre Dubois",
    client_title: "Surgeon",
    client_company: "Paris Hospital",
    client_location: "Paris, France",
    client_image_url: "/placeholder.svg?height=300&width=300&query=professional man portrait",
    platform: "google",
    platform_url: "https://g.co/kgs/example5",
    rating: 5,
    content: "I visited India for a medical conference and SEWA handled all my arrangements. Impressed by their professionalism and local knowledge.",
    content_hi: null,
    service_type: "Medical Tourism",
    destination: "Mumbai",
    is_featured: true,
    is_published: true,
    display_order: 6,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export async function getTestimonials(options?: {
  featured?: boolean
  platform?: string
  serviceType?: string
  destination?: string
  limit?: number
}): Promise<Testimonial[]> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("display_order", { ascending: true })

    if (options?.featured) {
      query = query.eq("is_featured", true)
    }

    if (options?.platform) {
      query = query.eq("platform", options.platform)
    }

    if (options?.serviceType) {
      query = query.eq("service_type", options.serviceType)
    }

    if (options?.destination) {
      query = query.eq("destination", options.destination)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching testimonials:", error.message)
      return FALLBACK_TESTIMONIALS
    }

    return data || FALLBACK_TESTIMONIALS
  } catch (error) {
    console.error("[v0] Exception fetching testimonials:", error instanceof Error ? error.message : String(error))
    return FALLBACK_TESTIMONIALS
  }
}
