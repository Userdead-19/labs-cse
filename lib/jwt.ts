import { SignJWT, jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const encoder = new TextEncoder()

export interface TokenPayload {
  userId: string
  email: string
  role: string
  [key: string]: unknown // Add index signature to conform to JWTPayload
}

export async function generateToken(payload: TokenPayload): Promise<string> {
  const secret = encoder.encode(JWT_SECRET)
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = encoder.encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return payload as TokenPayload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}
