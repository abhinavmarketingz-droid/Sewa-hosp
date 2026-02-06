import { NextResponse, type NextRequest } from "next/server"

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

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="SEWA Admin"',
    },
  })
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
