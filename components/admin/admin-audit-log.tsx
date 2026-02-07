"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type AuditLog = {
  id: string
  actor_email: string | null
  action: string
  resource: string
  created_at: string
}

type AdminAuditLogProps = {
  canRead: boolean
}

export function AdminAuditLog({ canRead }: AdminAuditLogProps) {
  const [logs, setLogs] = useState<AuditLog[]>([])

  const loadLogs = async () => {
    if (!canRead) {
      return
    }
    const response = await fetch("/api/admin/audit-logs")
    if (!response.ok) {
      return
    }
    const data = (await response.json()) as { logs: AuditLog[] }
    setLogs(data.logs ?? [])
  }

  useEffect(() => {
    loadLogs()
  }, [canRead])

  if (!canRead) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-serif">Audit Log</CardTitle>
          <CardDescription>You do not have permission to view audit logs.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-xl font-serif">Audit Log</CardTitle>
          <CardDescription>Recent administrative actions.</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={loadLogs}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Actor</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.actor_email ?? "—"}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.resource}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(log.created_at).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            {!logs.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                  No audit entries yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
