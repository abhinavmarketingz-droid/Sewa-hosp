"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Gateway = {
  id: string
  name: string
  description: string
  status: "enabled" | "disabled"
  mode: "test" | "live"
}

export function AdminPaymentGateways() {
  const [gateways, setGateways] = useState<Gateway[]>([])
  const [status, setStatus] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/admin/payments")
        const payload = await response.json().catch(() => null)
        if (!response.ok) {
          throw new Error(payload?.error ?? "Unable to load payment gateways.")
        }
        setGateways(payload.gateways ?? [])
      } catch (error) {
        setStatus(error instanceof Error ? error.message : "Unable to load payment gateways.")
      }
    }
    void load()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">Payment Gateways</CardTitle>
        <CardDescription>Configured payment providers and modes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {status ? <p className="text-sm text-destructive">{status}</p> : null}
        {gateways.length ? (
          <div className="space-y-2">
            {gateways.map((gateway) => (
              <div key={gateway.id} className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{gateway.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {gateway.status === "enabled" ? "Enabled" : "Disabled"} · {gateway.mode}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{gateway.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No payment gateways configured.</p>
        )}
      </CardContent>
    </Card>
  )
}
