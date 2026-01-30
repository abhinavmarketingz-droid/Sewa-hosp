import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// This is a temporary test endpoint to verify bcrypt hash
// Remove in production
export async function POST(request: Request) {
  try {
    const { password, hash } = await request.json()

    if (!password || !hash) {
      return NextResponse.json({ error: "Password and hash required" }, { status: 400 })
    }

    const isMatch = await bcrypt.compare(password, hash)
    
    return NextResponse.json({
      password,
      hash,
      isMatch,
      message: isMatch ? "Password matches!" : "Password does not match",
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
