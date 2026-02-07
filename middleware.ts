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

  const supabaseUrl = getSupabaseUrl()
  const anonKey = resolveAnonKey()

  if (!supabaseUrl || !anonKey) {
  if (!isAuthConfigured()) {
    if (isApi) {
      return NextResponse.json({ error: "Auth is not configured" }, { status: 503 })
    }

    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  const response = NextResponse.next()
  const supabase = createServerClient(supabaseUrl, anonKey, {
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

const isAdminConfigured = () =>
  Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD)

const parseBasicAuth = (authHeader: string | null) => {
  if (!authHeader?.startsWith("Basic ")) {
    return null
  }

  const encoded = authHeader.slice(6)

  try {
    const decoded = atob(encoded)
    const [username, password] = decoded.split(":")
    if (!username || !password) {
      return null
    }

    return { username, password }
  } catch {
    return null
  }
}

const isAuthorized = (request: NextRequest) => {
  if (!isAdminConfigured()) {
    return false
  }

  const credentials = parseBasicAuth(request.headers.get("authorization"))
  if (!credentials) {
    return false
  }

  return (
    credentials.username === process.env.ADMIN_USERNAME &&
    credentials.password === process.env.ADMIN_PASSWORD
  )
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isApi = path.startsWith("/api/admin")

  if (!isAdminConfigured()) {
    if (isApi) {
      return NextResponse.json({ error: "Admin access is not configured" }, { status: 503 })
    }

    return new NextResponse("Admin access is not configured.", { status: 503 })
  }

  if (isAuthorized(request)) {
    return NextResponse.next()
  }

  if (isApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.redirect(new URL("/admin/login", request.url))
  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="SEWA Admin"',
    },
  })
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
}
