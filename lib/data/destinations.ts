import { createClient } from "@/lib/supabase/server"
import type { Destination } from "@/lib/supabase/types"

export async function getDestinations(options?: {
  featured?: boolean
  limit?: number
}): Promise<Destination[]> {
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
    console.error("Error fetching destinations:", error)
    return []
  }

  return data || []
}

export async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single()

  if (error) {
    console.error("Error fetching destination:", error)
    return null
  }

  return data
}
