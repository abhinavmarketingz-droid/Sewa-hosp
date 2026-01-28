import { createClient } from "@/lib/supabase/server"
import type { Partner } from "@/lib/supabase/types"

export async function getPartners(options?: {
  featured?: boolean
  category?: string
  limit?: number
}): Promise<Partner[]> {
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
    console.error("Error fetching partners:", error)
    return []
  }

  return data || []
}
