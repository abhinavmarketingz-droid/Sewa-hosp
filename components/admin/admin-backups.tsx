"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminBackups() {
  const [status, setStatus] = useState<string | null>(null)

  const handleDownload = async () => {
    setStatus(null)
    try {
      const response = await fetch("/api/admin/backups", { method: "GET" })
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error ?? "Failed to generate backup.")
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `sewa-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to download backup.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">Backups</CardTitle>
        <CardDescription>Download a JSON backup of content, requests, audit logs, and media metadata.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Button onClick={handleDownload}>Download Backup</Button>
        {status ? <p className="text-sm text-destructive">{status}</p> : null}
      </CardContent>
    </Card>
  )
}
