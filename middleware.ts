import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/jwt"

// Define which routes require authentication
const PROTECTED_ROUTES = ["/dashboard", "/bookings", "/labs", "/profile", "/admin"]

export function middleware(request: NextRequest) {
  // Get the pathname from the URL
  const { pathname } = request.nextUrl

  // Check if the pathname is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route) || pathname === route)

  // If it's an API route that requires auth, check the Authorization header
  if (pathname.startsWith("/api/") && pathname !== "/api/auth/login" && pathname !== "/api/auth/register") {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }
  }

  // For protected pages, check the token in cookies
  if (isProtectedRoute) {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Match all API routes except auth
    "/api/:path*",
    // Match all protected routes
    ...PROTECTED_ROUTES.map((route) => `${route}/:path*`),
    ...PROTECTED_ROUTES,
  ],
}

