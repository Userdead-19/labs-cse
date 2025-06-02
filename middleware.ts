import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./lib/jwt"

const PROTECTED_ROUTES = ["/dashboard", "/bookings", "/labs", "/profile", "/admin"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname === route || pathname.startsWith(route + "/")
  )

  const token = request.cookies.get("token")?.value

  const isProtectedAPI = pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/auth/")

  if ((isProtectedRoute || isProtectedAPI)) {
    if (!token) {
      if (isProtectedAPI) {
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })
      } else {
        const loginUrl = new URL("/login", request.url)
        return NextResponse.redirect(loginUrl)
      }
    }

    const payload = await verifyToken(token)
    if (!payload) {
      if (isProtectedAPI) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      } else {
        const loginUrl = new URL("/login", request.url)
        return NextResponse.redirect(loginUrl)
      }
    }
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
