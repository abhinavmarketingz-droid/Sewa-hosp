import { NextResponse } from "next/server"
import { requirePermission } from "@/lib/admin-auth"
import { getPaymentGatewayConfigs } from "@/lib/payment-gateways"

export async function GET() {
  const guard = await requirePermission("payments:read")
  if (!guard.ok) {
    return NextResponse.json({ error: guard.error }, { status: guard.error === "Forbidden" ? 403 : 401 })
  }

  return NextResponse.json({ gateways: getPaymentGatewayConfigs() })
}
