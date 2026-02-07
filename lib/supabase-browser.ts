"use client"

import { createBrowserClient } from "@supabase/ssr"

const resolveSupabaseUrl = () =>
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL

const resolveAnonKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

export const createSupabaseBrowserClient = () => {
  const supabaseUrl = resolveSupabaseUrl()
  const anonKey = resolveAnonKey()

  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase browser client is not configured.")
  }

  return createBrowserClient(supabaseUrl, anonKey)
}
