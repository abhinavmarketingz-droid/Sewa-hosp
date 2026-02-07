"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { createSupabaseBrowserClient } from "@/lib/supabase-browser"

type AdminAuthBarProps = {
  email: string | null
}

export function AdminAuthBar({ email }: AdminAuthBarProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.signOut()
      router.push("/admin/login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3 text-sm">
      <div className="text-muted-foreground">Signed in as: <span className="font-medium text-foreground">{email ?? "Unknown"}</span></div>
      <Button size="sm" variant="outline" onClick={handleSignOut} disabled={loading}>
        {loading ? "Signing out..." : "Sign out"}
      </Button>
    </div>
  )
}
