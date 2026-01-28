"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Mail, Eye, Trash2 } from "lucide-react"
import type { ContactSubmission } from "@/lib/supabase/types"

interface ContactsTableProps {
  contacts: ContactSubmission[]
}

export function ContactsTable({ contacts }: ContactsTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>(null)

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(search.toLowerCase()) ||
      contact.email.toLowerCase().includes(search.toLowerCase()) ||
      contact.message.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = !statusFilter || contact.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const statusColors: Record<string, string> = {
    new: "bg-green-500/20 text-green-700",
    contacted: "bg-blue-500/20 text-blue-700",
    in_progress: "bg-yellow-500/20 text-yellow-700",
    completed: "bg-muted text-muted-foreground",
    spam: "bg-red-500/20 text-red-700",
  }

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    // In production, would refetch or use optimistic updates
    window.location.reload()
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {["all", "new", "contacted", "in_progress", "completed"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status || (status === "all" && !statusFilter) ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status === "all" ? null : status)}
              className="capitalize"
            >
              {status.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Service Interest</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No contacts found
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.service_interest || "—"}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[contact.status] || ""} variant="secondary">
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(contact.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`mailto:${contact.email}`)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(contact.id, "contacted")}>
                          Mark as Contacted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => updateStatus(contact.id, "spam")} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Mark as Spam
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-muted-foreground">
        Showing {filteredContacts.length} of {contacts.length} contacts
      </p>
    </div>
  )
}
