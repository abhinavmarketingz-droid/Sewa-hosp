"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquare,
  Mail,
  BarChart3,
  FileText,
  MapPin,
  Users,
  Star,
  Handshake,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface AdminSidebarProps {
  admin: {
    name: string
    email: string
    role: string
  }
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Mail, label: "Contacts", href: "/admin/contacts" },
  { icon: MessageSquare, label: "Live Chat", href: "/admin/chat" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: FileText, label: "Services", href: "/admin/services" },
  { icon: MapPin, label: "Destinations", href: "/admin/destinations" },
  { icon: Users, label: "Team", href: "/admin/team" },
  { icon: Handshake, label: "Partners", href: "/admin/partners" },
  { icon: Star, label: "Testimonials", href: "/admin/testimonials" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
]

export function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" })
    router.push("/admin/login")
    router.refresh()
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/admin">
          <h1 className="text-xl font-serif font-bold text-primary">SEWA Admin</h1>
          <p className="text-xs text-muted-foreground">Hospitality Dashboard</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            {admin.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{admin.name}</p>
            <p className="text-xs text-muted-foreground truncate">{admin.role}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="w-full bg-transparent">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
