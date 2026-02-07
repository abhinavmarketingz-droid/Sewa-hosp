"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type LicensePayload = {
  tenantId: string
  plan: string
  features: string[]
  issuedAt: string
  expiresAt?: string
}

type LicenseStatus = {
  valid: boolean
  reason?: string
  payload?: LicensePayload
}

export function AdminLicenseStatus() {
  const [status, setStatus] = useState<LicenseStatus | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/admin/license")
        const payload = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to load license status.")
        }
        setStatus(payload.status ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load license status.")
      }
    }
    void load()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">License</CardTitle>
        <CardDescription>License status and entitlements.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {error ? <p className="text-destructive">{error}</p> : null}
        {status ? (
          <>
            <p>
              Status:{" "}
              <span className={status.valid ? "text-emerald-600" : "text-destructive"}>
                {status.valid ? "Valid" : "Invalid"}
              </span>
            </p>
            {status.reason ? <p className="text-muted-foreground">{status.reason}</p> : null}
            {status.payload ? (
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Tenant: {status.payload.tenantId}</p>
                <p>Plan: {status.payload.plan}</p>
                <p>Issued: {status.payload.issuedAt}</p>
                {status.payload.expiresAt ? <p>Expires: {status.payload.expiresAt}</p> : null}
                {status.payload.features?.length ? (
                  <p>Features: {status.payload.features.join(", ")}</p>
                ) : null}
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-muted-foreground">No license data.</p>
        )}
      </CardContent>
    </Card>
  )
}
