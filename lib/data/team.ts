import { createClient } from "@/lib/supabase/server"
import type { TeamMember } from "@/lib/supabase/types"

export async function getTeamMembers(options?: {
  leadership?: boolean
  limit?: number
}): Promise<TeamMember[]> {
  const supabase = await createClient()

  let query = supabase
    .from("team_members")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true })

  if (options?.leadership) {
    query = query.eq("is_leadership", true)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching team members:", error)
    return []
  }

  return data || []
}
