"use client"

import type React from "react"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    } else if (!isLoading && isAuthenticated && allowedRoles && user) {
      // Check if user role is in allowed roles
      if (!allowedRoles.includes(user.role)) {
        router.push("/dashboard")
      }
    }
  }, [isLoading, isAuthenticated, router, allowedRoles, user])

  // Show nothing while loading
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  // If not authenticated, don't render children
  if (!isAuthenticated) {
    return null
  }

  // If role check is needed and user doesn't have the required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null
  }

  // Render children if authenticated and authorized
  return <>{children}</>
}

