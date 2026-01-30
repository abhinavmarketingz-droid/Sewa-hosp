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

    const emailLower = email.toLowerCase().trim()
    
    console.log("[v0] Login attempt for:", emailLower)

    // Try admin client first, fall back to regular client
    let supabase
    try {
      supabase = await createAdminClient()
      console.log("[v0] Using admin client")
    } catch (e) {
      console.error("[v0] Admin client failed:", e instanceof Error ? e.message : String(e))
      const { createClient } = await import("@/lib/supabase/server")
      supabase = await createClient()
      console.log("[v0] Using regular client as fallback")
    }

    // Find admin user by email (case-insensitive)
    const { data: admin, error } = await supabase
      .from("admin_users")
      .select("id, email, password_hash, name, role, is_active")
      .ilike("email", emailLower)
      .eq("is_active", true)
      .single()

    console.log("[v0] Query result:", { error: error?.message, found: !!admin })

    if (error) {
      console.error("[v0] Database query error:", error.message)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    if (!admin) {
      console.log("[v0] Admin user not found")
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log("[v0] Admin found:", admin.email)

    // Verify password
    try {
      const validPassword = await bcrypt.compare(password, admin.password_hash)
      console.log("[v0] Password valid:", validPassword)
      
      if (!validPassword) {
        console.log("[v0] Password mismatch for:", admin.email)
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }
    } catch (bcryptError) {
      console.error("[v0] Bcrypt error:", bcryptError instanceof Error ? bcryptError.message : String(bcryptError))
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
