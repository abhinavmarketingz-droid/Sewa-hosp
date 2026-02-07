import { cookies, headers } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { getSupabaseUrl } from "@/lib/supabase-server"

const resolveAnonKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const createSupabaseServerClient = () => {
  const supabaseUrl = getSupabaseUrl()
  const anonKey = resolveAnonKey()

  if (!supabaseUrl || !anonKey) {
    return null
  }

  const cookieStore = cookies()
  const headerStore = headers()

  return createServerClient(supabaseUrl, anonKey, {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
      set(name, value, options) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name, options) {
        cookieStore.set({ name, value: "", ...options })
      },
    },
    global: {
      headers: {
        "X-Client-Info": "sewa-hospitality-web",
        "X-Forwarded-Host": headerStore.get("x-forwarded-host") ?? "",
      },
    },
  })
}
