"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type UserProfile = {
  id: string
  email: string | null
  full_name: string | null
  role: string | null
  created_at: string
}

type AdminUserManagerProps = {
  canManage: boolean
}

export function AdminUserManager({ canManage }: AdminUserManagerProps) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [status, setStatus] = useState<string | null>(null)

  const loadUsers = async () => {
    const response = await fetch("/api/admin/users")
    if (!response.ok) {
      return
    }
    const data = (await response.json()) as { users: UserProfile[] }
    setUsers(data.users ?? [])
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const updateRole = async (userId: string, role: string) => {
    setStatus(null)
    const response = await fetch(`/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    })
    if (!response.ok) {
      setStatus("Unable to update role.")
      return
    }
    const data = (await response.json()) as { users: UserProfile[] }
    setUsers(data.users ?? [])
    setStatus("Role updated.")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-serif">User Management</CardTitle>
        <CardDescription>Assign roles and manage admin access.</CardDescription>
      </CardHeader>
      <CardContent>
        {status && <p className="mb-4 text-sm text-primary">{status}</p>}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email ?? "—"}</TableCell>
                <TableCell>{user.full_name ?? "—"}</TableCell>
                <TableCell>{user.role ?? "viewer"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Select
                      disabled={!canManage}
                      onValueChange={(value) => updateRole(user.id, value)}
                      defaultValue={user.role ?? "viewer"}
                    >
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" onClick={loadUsers}>
                      Refresh
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!users.length && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
