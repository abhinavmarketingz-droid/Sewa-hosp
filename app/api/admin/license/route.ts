import { NextResponse } from "next/server"
import { requirePermission } from "@/lib/admin-auth"
import { evaluateLicense } from "@/lib/license"

export async function GET() {
  const guard = await requirePermission("license:read")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }

  const status = evaluateLicense()
  return NextResponse.json({ status })
}
