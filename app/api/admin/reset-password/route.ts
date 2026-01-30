import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createClient } from "@/lib/supabase/server"

/**
 * Emergency password reset endpoint
 * This should be removed after first use for security
 * Usage: POST /api/admin/reset-password
 * Body: { email: "admin@it.com", newPassword: "Admin@1230" }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    // Generate bcrypt hash
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(newPassword, saltRounds)

    console.log("[v0] Generated hash for", email, ":", passwordHash)

    // Update admin user password
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("admin_users")
      .update({ password_hash: passwordHash })
      .ilike("email", email)
      .select()
      .single()

    if (error) {
      console.error("[v0] Password reset error:", error.message)
      return NextResponse.json(
        { error: "Failed to reset password" },
        { status: 500 }
      )
    }

    console.log("[v0] Password reset successful for:", email)

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
      email: data.email,
      hash: passwordHash,
    })
  } catch (error) {
    console.error(
      "[v0] Reset password exception:",
      error instanceof Error ? error.message : String(error)
    )
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
