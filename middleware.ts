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
    const separatorIndex = decoded.indexOf(":")
    if (separatorIndex === -1) {
      return null
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    }
  } catch {
    return null
  }
}

const constantTimeEqual = (left: string, right: string) => {
  const leftLength = left.length
  const rightLength = right.length
  const maxLength = Math.max(leftLength, rightLength)
  let result = 0

  for (let index = 0; index < maxLength; index += 1) {
    const leftChar = index < leftLength ? left.charCodeAt(index) : 0
    const rightChar = index < rightLength ? right.charCodeAt(index) : 0
    result |= leftChar ^ rightChar
  }

  return result === 0 && leftLength === rightLength
}

const isAuthorized = (request: NextRequest) => {
  if (!isAdminConfigured()) {
    return false
  }

  const credentials = parseBasicAuth(request.headers.get("authorization"))
  if (!credentials) {
    return false
  }

  const expectedUsername = process.env.ADMIN_USERNAME ?? ""
  const expectedPassword = process.env.ADMIN_PASSWORD ?? ""

  return (
    constantTimeEqual(credentials.username, expectedUsername) &&
    constantTimeEqual(credentials.password, expectedPassword)
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
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
}
