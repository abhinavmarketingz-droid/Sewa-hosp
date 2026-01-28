import { createClient } from "@/lib/supabase/server"

export async function getSiteSettings(): Promise<Record<string, unknown>> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("site_settings").select("key, value")

  if (error) {
    console.error("Error fetching site settings:", error)
    return {}
  }

  const settings: Record<string, unknown> = {}
  data?.forEach((item: { key: string; value: unknown }) => {
    settings[item.key] = item.value
  })

  return settings
}

export async function getSetting(key: string): Promise<unknown | null> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("site_settings").select("value").eq("key", key).single()

  if (error) {
    console.error("Error fetching setting:", error)
    return null
  }

  return data?.value
}
