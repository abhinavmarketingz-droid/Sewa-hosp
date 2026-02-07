"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { defaultThemeTokens } from "@/lib/theme-tokens"

export function AdminThemeManager() {
  const [tenantId, setTenantId] = useState("default")
  const [tokens, setTokens] = useState(JSON.stringify(defaultThemeTokens, null, 2))
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const loadTokens = async (targetTenant: string) => {
    setLoading(true)
    setStatus(null)
    try {
      const response = await fetch(`/api/admin/themes?tenantId=${encodeURIComponent(targetTenant)}`)
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to load theme tokens.")
      }
      setTokens(JSON.stringify(payload.tokens ?? defaultThemeTokens, null, 2))
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to load theme tokens.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTokens(tenantId)
  }, [])

  const handleLoad = async () => {
    await loadTokens(tenantId)
  }

  const handleSave = async () => {
    setStatus(null)
    try {
      const parsed = JSON.parse(tokens)
      const response = await fetch("/api/admin/themes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId, tokens: parsed }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to save theme tokens.")
      }
      setStatus("Theme tokens saved.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save theme tokens.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">Theme Tokens</CardTitle>
        <CardDescription>Manage design tokens per tenant.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-end">
          <div className="flex-1 space-y-1">
            <label className="text-sm font-medium">Tenant ID</label>
            <Input value={tenantId} onChange={(event) => setTenantId(event.target.value)} />
          </div>
          <Button onClick={handleLoad} disabled={loading}>
            {loading ? "Loading..." : "Load"}
          </Button>
        </div>
        <Textarea
          value={tokens}
          onChange={(event) => setTokens(event.target.value)}
          rows={14}
          className="font-mono text-xs"
        />
        <div className="flex items-center gap-3">
          <Button onClick={handleSave}>Save</Button>
          {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        </div>
      </CardContent>
    </Card>
  )
}
