import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { createClient } from "@/lib/supabase/server"

/**
 * Emergency endpoint to reset admin password
 * THIS SHOULD ONLY BE USED FOR INITIAL SETUP
 * Remove this endpoint after setting up the admin account properly
 */
export async function POST(request: Request) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and newPassword required" },
        { status: 400 }
      )
    }

    // Security check - only allow admin@it.com for now
    if (email.toLowerCase() !== "admin@it.com") {
      return NextResponse.json(
        { error: "Only admin@it.com can be reset via this endpoint" },
        { status: 403 }
      )
    }

    // Generate hash using bcryptjs
    console.log(`[v0] Generating bcryptjs hash for password: ${newPassword}`)
    const passwordHash = await bcrypt.hash(newPassword, 10)
    console.log(`[v0] Generated hash: ${passwordHash}`)

    // Update database
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("admin_users")
      .update({ password_hash: passwordHash })
      .eq("email", email.toLowerCase())
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating password:", error)
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      )
    }

    console.log("[v0] Password updated successfully")

    return NextResponse.json({
      success: true,
      message: `Password for ${email} has been reset`,
      hash: passwordHash,
      data,
    })
  } catch (error) {
    console.error("[v0] Emergency reset error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
