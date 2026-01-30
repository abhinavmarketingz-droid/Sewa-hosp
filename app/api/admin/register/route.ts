import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { error: "Password must contain uppercase, lowercase, and numbers" },
        { status: 400 }
      )
    }

    const emailLower = email.toLowerCase().trim()
    console.log("[v0] Registering new admin:", emailLower)

    // Try admin client first, fall back to regular client
    let supabase
    try {
      supabase = await createAdminClient()
      console.log("[v0] Using admin client for registration")
    } catch (e) {
      console.error("[v0] Admin client failed:", e instanceof Error ? e.message : String(e))
      supabase = await createClient()
      console.log("[v0] Using regular client as fallback for registration")
    }

    // Check if email already exists
    const { data: existingAdmin } = await supabase
      .from("admin_users")
      .select("id")
      .ilike("email", emailLower)
      .single()

    if (existingAdmin) {
      console.log("[v0] Email already exists:", emailLower)
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    console.log("[v0] Password hashed successfully")

    // Create new admin user
    const { data: newAdmin, error: createError } = await supabase
      .from("admin_users")
      .insert({
        email: emailLower,
        name: name.trim(),
        password_hash: passwordHash,
        role: "admin",
        is_active: true,
      })
      .select("id, email, name, role")
      .single()

    if (createError) {
      console.error("[v0] Error creating admin user:", createError.message)
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
    }

    if (!newAdmin) {
      console.error("[v0] Admin user was not created properly")
      return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
    }

    console.log("[v0] New admin created:", newAdmin.email)

    // Create session token
    const token = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    // Save session
    const { error: sessionError } = await supabase.from("admin_sessions").insert({
      admin_id: newAdmin.id,
      token,
      expires_at: expiresAt.toISOString(),
      ip_address: request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown",
      user_agent: request.headers.get("user-agent") || "",
    })

    if (sessionError) {
      console.error("[v0] Error creating session:", sessionError.message)
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    console.log("[v0] Session created for:", newAdmin.email)

    // Update last login
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", newAdmin.id)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    })

    console.log("[v0] Admin registered and logged in successfully")

    return NextResponse.json({
      success: true,
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    })
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
