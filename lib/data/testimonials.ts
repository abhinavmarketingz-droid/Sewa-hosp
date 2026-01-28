import { createClient } from "@/lib/supabase/server"
import type { Testimonial } from "@/lib/supabase/types"

export async function getTestimonials(options?: {
  featured?: boolean
  platform?: string
  serviceType?: string
  destination?: string
  limit?: number
}): Promise<Testimonial[]> {
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
    console.error("Error fetching testimonials:", error)
    return []
  }

  return data || []
}
