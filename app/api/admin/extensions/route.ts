import { NextResponse } from "next/server"
import { requirePermission } from "@/lib/admin-auth"
import { getExtensionRegistry } from "@/lib/extensions"
import { getExtensionFlags } from "@/lib/feature-flags"

export async function GET() {
  const guard = await requirePermission("extensions:read")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }

  const extensions = getExtensionRegistry()
  const flags = getExtensionFlags()

  return NextResponse.json({ extensions, flags })
}
