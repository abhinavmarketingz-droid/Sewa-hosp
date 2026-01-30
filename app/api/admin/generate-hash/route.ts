import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 })
    }

    // Generate hash with 10 rounds
    const hash = await bcrypt.hash(password, 10)

    console.log(`[v0] Generated hash for password "${password}":`)
    console.log(`[v0] Hash: ${hash}`)

    return NextResponse.json({
      password,
      hash,
      rounds: 10,
      message: "Copy the hash value above and use it in the database",
    })
  } catch (error) {
    console.error("[v0] Error generating hash:", error)
    return NextResponse.json({ error: "Failed to generate hash" }, { status: 500 })
  }
}
