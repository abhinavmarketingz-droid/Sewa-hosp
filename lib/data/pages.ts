import { createClient } from "@/lib/supabase/server"
import type { Page } from "@/lib/supabase/types"

export async function getPageMeta(slug: string): Promise<Page | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("pages").select("*").eq("slug", slug).eq("is_published", true).single()

  if (error) {
    console.error("Error fetching page meta:", error)
    return null
  }

  return data
}

export async function getAllPages(): Promise<Page[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("pages").select("*").eq("is_published", true)

  if (error) {
    console.error("Error fetching pages:", error)
    return []
  }

  return data || []
}
