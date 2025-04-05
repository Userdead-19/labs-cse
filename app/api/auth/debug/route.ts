import { NextResponse } from "next/server"
import { TokenPayload, verifyToken } from "@/lib/jwt"

export async function GET(request: Request) {
    try {
        // Get token from Authorization header
        const authHeader = request.headers.get("Authorization")
        let tokenInfo: { valid: boolean; payload: TokenPayload | null } = { valid: false, payload: null }

        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1]
            const payload = verifyToken(token)
            tokenInfo = { valid: !!payload, payload }
        }

        // Get cookie token
        const cookieHeader = request.headers.get("cookie")
        let cookieToken = null

        if (cookieHeader) {
            const cookies = cookieHeader.split(";").map((cookie) => cookie.trim())
            const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="))
            if (tokenCookie) {
                cookieToken = tokenCookie.split("=")[1]
            }
        }

        // Return debug info
        return NextResponse.json({
            message: "Auth debug info",
            authHeader: !!authHeader,
            tokenInfo,
            cookieToken: !!cookieToken,
            headers: Object.fromEntries(request.headers.entries()),
        })
    } catch (error) {
        console.error("Auth debug error:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error in debug route",
                error: (error as Error).message,
            },
            { status: 500 },
        )
    }
}

