"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type PageRecord = {
  id: string
  slug: string
  title: string
  status: "draft" | "published"
  blocks: unknown[]
  updated_at?: string
}

export function AdminPageBuilder() {
  const [pages, setPages] = useState<PageRecord[]>([])
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    slug: "",
    title: "",
    status: "draft",
    blocks: "[]",
  })

  const parsedBlocks = useMemo(() => {
    try {
      return JSON.parse(form.blocks)
    } catch {
      return null
    }
  }, [form.blocks])

  const loadPages = async () => {
    setLoading(true)
    setStatus(null)
    try {
      const response = await fetch("/api/admin/pages")
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to load pages.")
      }
      setPages(payload.pages ?? [])
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to load pages.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPages()
  }, [])

  const handleCreate = async () => {
    setStatus(null)
    if (!parsedBlocks) {
      setStatus("Blocks must be valid JSON.")
      return
    }
    try {
      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug.trim(),
          title: form.title.trim(),
          status: form.status,
          blocks: parsedBlocks,
        }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error ?? "Unable to create page.")
      }
      setForm({ slug: "", title: "", status: "draft", blocks: "[]" })
      setPages(payload.pages ?? [])
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create page.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">Page Builder</CardTitle>
        <CardDescription>Create and manage page content blocks.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Slug</label>
            <Input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input value={form.title} onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Input value={form.status} onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Blocks (JSON)</label>
          <Textarea
            rows={8}
            value={form.blocks}
            onChange={(event) => setForm((prev) => ({ ...prev, blocks: event.target.value }))}
            className="font-mono text-xs"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleCreate}>Create Page</Button>
          <Button variant="outline" onClick={loadPages} disabled={loading}>
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
          {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
        </div>

        {pages.length ? (
          <div className="space-y-2">
            {pages.map((page) => (
              <div key={page.id} className="rounded-md border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{page.title}</span>
                  <span className="text-xs text-muted-foreground">{page.status}</span>
                </div>
                <div className="text-xs text-muted-foreground">/{page.slug}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No pages configured yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
