"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type MediaFile = {
  id: string
  name: string
  publicUrl: string | null
  updatedAt: string | null
  createdAt: string | null
  size: number | null
}

export function AdminMediaManager() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [path, setPath] = useState("")

  const loadFiles = useCallback(async () => {
    setLoading(true)
    setStatus(null)
    try {
      const response = await fetch("/api/admin/media")
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error ?? "Failed to load media.")
      }
      setFiles(payload.files ?? [])
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to load media.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadFiles()
  }, [loadFiles])

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setUploading(true)
    setStatus(null)
    try {
      const formData = new FormData(event.currentTarget)
      if (path.trim()) {
        formData.set("path", path.trim())
      }
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error ?? "Upload failed.")
      }
      setPath("")
      event.currentTarget.reset()
      await loadFiles()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to upload media.")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (filePath: string) => {
    setStatus(null)
    try {
      const response = await fetch(`/api/admin/media?path=${encodeURIComponent(filePath)}`, { method: "DELETE" })
      const payload = await response.json().catch(() => null)
      if (!response.ok) {
        throw new Error(payload?.error ?? "Delete failed.")
      }
      await loadFiles()
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete media.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">Media Library</CardTitle>
        <CardDescription>Upload, review, and remove media stored in Supabase.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form className="flex flex-col gap-3 md:flex-row md:items-end" onSubmit={handleUpload}>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium">File</label>
            <Input type="file" name="file" required />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-sm font-medium">Optional path</label>
            <Input
              type="text"
              name="path"
              placeholder="folder/filename.ext"
              value={path}
              onChange={(event) => setPath(event.target.value)}
            />
          </div>
          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </form>

        {status ? <p className="text-sm text-destructive">{status}</p> : null}

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading media...</p>
        ) : files.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <div key={file.id} className="flex flex-col gap-2 rounded-md border p-3">
                {file.publicUrl ? (
                  <img className="h-40 w-full rounded object-cover" src={file.publicUrl} alt={file.name} />
                ) : (
                  <div className="flex h-40 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                    Preview unavailable
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {file.size ? `${Math.round(file.size / 1024)} KB` : "Size unavailable"}
                  </span>
                </div>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(file.name)}>
                  Delete
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No media files found.</p>
        )}
      </CardContent>
    </Card>
  )
}
