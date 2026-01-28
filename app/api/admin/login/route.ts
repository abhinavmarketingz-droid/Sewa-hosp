import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const supabase = await createAdminClient()

    // Find admin user
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email.toLowerCase())
      .eq("is_active", true)
      .single()

    if (error || !admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password_hash)
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session token
    const token = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    // Save session
    await supabase.from("admin_sessions").insert({
      admin_id: admin.id,
      token,
      expires_at: expiresAt.toISOString(),
      ip_address: request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown",
      user_agent: request.headers.get("user-agent") || "",
    })

    // Update last login
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", admin.id)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
