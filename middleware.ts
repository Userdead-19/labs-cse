import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/jwt"

const PROTECTED_ROUTES = ["/dashboard", "/bookings", "/labs", "/profile", "/admin"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  )

  // Extract token from cookie for both page and API routes
  const token = request.cookies.get("token")?.value

  // If it's a protected route or protected API and token is missing/invalid
  const isProtectedAPI = pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth/")

  if ((isProtectedRoute || isProtectedAPI)) {
    if (!token) {
      if (isProtectedAPI) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      } else {
        const loginUrl = new URL("/login", request.url)
        loginUrl.searchParams.set("from", encodeURIComponent(pathname))
        return NextResponse.redirect(loginUrl)
      }
    }

    const payload = verifyToken(token)

  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/:path*",
    ...PROTECTED_ROUTES.map((route) => `${route}/:path*`),
    ...PROTECTED_ROUTES,
  ],
}
