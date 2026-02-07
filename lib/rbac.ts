export type Role = "admin" | "editor" | "viewer"

export type Permission =
  | "content:read"
  | "content:write"
  | "requests:read"
  | "users:read"
  | "users:write"
  | "audit:read"
  | "backups:read"
  | "extensions:read"
  | "license:read"
  | "license:write"
  | "theme:read"
  | "theme:write"
  | "payments:read"

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "content:read",
    "content:write",
    "requests:read",
    "users:read",
    "users:write",
    "audit:read",
    "backups:read",
    "extensions:read",
    "license:read",
    "license:write",
    "theme:read",
    "theme:write",
    "payments:read",
  ],
  editor: ["content:read", "content:write", "requests:read"],
  viewer: ["content:read", "requests:read"],
}

export const hasPermission = (role: Role, permission: Permission) => rolePermissions[role].includes(permission)
