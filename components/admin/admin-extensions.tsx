"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Extension = {
  id: string
  name: string
  description: string
  version: string
  category: string
  requires?: string[]
}

export function AdminExtensions() {
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [flags, setFlags] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/admin/extensions")
        const payload = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to load extensions.")
        }
        setExtensions(payload.extensions ?? [])
        setFlags(payload.flags ?? {})
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Unable to load extensions.")
      }
    }
    void load()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">Extensions</CardTitle>
        <CardDescription>Installed extensions and feature flags.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {status ? <p className="text-sm text-destructive">{status}</p> : null}
        {extensions.length ? (
          <div className="space-y-3">
            {extensions.map((extension) => (
              <div key={extension.id} className="rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{extension.name}</p>
                    <p className="text-xs text-muted-foreground">{extension.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    v{extension.version} · {extension.category}
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  {flags[extension.id] === false ? "Disabled" : "Enabled"}
                </div>
                {extension.requires?.length ? (
                  <div className="mt-2 text-xs text-muted-foreground">
                    Requires: {extension.requires.join(", ")}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No extensions registered.</p>
        )}
      </CardContent>
    </Card>
  )
}
