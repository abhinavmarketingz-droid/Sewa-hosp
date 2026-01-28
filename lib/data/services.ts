import { createClient } from "@/lib/supabase/server"
import type { Service } from "@/lib/supabase/types"

export async function getServices(options?: {
  featured?: boolean
  limit?: number
}): Promise<Service[]> {
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
    console.error("Error fetching services:", error)
    return []
  }

  return data || []
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("services").select("*").eq("slug", slug).eq("is_published", true).single()

  if (error) {
    console.error("Error fetching service:", error)
    return null
  }

  return data
}
