import { NextResponse } from "next/server"

export async function POST() {
    try {
        // Create response
        const response = NextResponse.json({
            success: true,
            message: "Logged out successfully",
        })

        // Clear the token cookie
        response.cookies.set({
            name: "token",
            value: "",
            httpOnly: true,
            expires: new Date(0), // Set expiration to epoch time (effectively deleting it)
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
        })

        return response
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "An error occurred during logout",
            },
            { status: 500 },
        )
    }
}
