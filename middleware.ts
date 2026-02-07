import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { getSupabaseUrl } from "@/lib/supabase-server"

const resolveAnonKey = () =>
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY

const isAuthConfigured = () => Boolean(getSupabaseUrl() && resolveAnonKey())

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isApi = path.startsWith("/api/admin")
  const isLogin = path.startsWith("/admin/login")

  if (isLogin) {
    return NextResponse.next()
  }

  if (!isAuthConfigured()) {
    if (isApi) {
      return NextResponse.json({ error: "Auth is not configured" }, { status: 503 })
    }

    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  const response = NextResponse.next()
  const supabase = createServerClient(getSupabaseUrl() as string, resolveAnonKey() as string, {
    cookies: {
      get(name) {
        return request.cookies.get(name)?.value
      },
      set(name, value, options) {
        response.cookies.set({ name, value, ...options })
      },
      remove(name, options) {
        response.cookies.set({ name, value: "", ...options })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return response
  }

  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.redirect(new URL("/admin/login", request.url))
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
}
