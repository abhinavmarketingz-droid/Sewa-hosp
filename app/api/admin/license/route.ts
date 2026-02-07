import { NextResponse } from "next/server"
import { z } from "zod"
import { requirePermission } from "@/lib/admin-auth"
import { evaluateLicense, issueLicense } from "@/lib/license"

const issueSchema = z.object({
  tenantId: z.string().trim().min(1),
  plan: z.string().trim().min(1),
  features: z.array(z.string().trim().min(1)).default([]),
  issuedAt: z.string().trim().min(1),
  expiresAt: z.string().trim().optional(),
})

export async function GET() {
  const guard = await requirePermission("license:read")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }

  const status = evaluateLicense()
  return NextResponse.json({ status })
}

export async function POST(request: Request) {
  const guard = await requirePermission("license:write")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }

  const payload = await request.json()
  const parsed = issueSchema.safeParse(payload)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid request" }, { status: 400 })
  }

  const issuedAt = new Date(parsed.data.issuedAt)
  if (Number.isNaN(issuedAt.getTime())) {
    return NextResponse.json({ error: "Invalid issuedAt date." }, { status: 400 })
  }

  if (parsed.data.expiresAt) {
    const expiresAt = new Date(parsed.data.expiresAt)
    if (Number.isNaN(expiresAt.getTime())) {
      return NextResponse.json({ error: "Invalid expiresAt date." }, { status: 400 })
    }
  }

  try {
    const licenseKey = issueLicense({
      tenantId: parsed.data.tenantId,
      plan: parsed.data.plan,
      features: parsed.data.features,
      issuedAt: parsed.data.issuedAt,
      expiresAt: parsed.data.expiresAt,
    })
    return NextResponse.json({ licenseKey })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to issue license." },
      { status: 500 },
    )
  }
}
