"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AuthTestPage() {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const [cookieToken, setCookieToken] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isDebugLoading, setIsDebugLoading] = useState(false);

  useEffect(() => {
    // Check for token in cookies
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
    if (tokenCookie) {
      setCookieToken(tokenCookie.split("=")[1]);
    }
  }, []);

  const fetchDebugInfo = async () => {
    setIsDebugLoading(true);
    try {
      const response = await fetch("/api/auth/debug", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await response.json();
      setDebugInfo(data);
    } catch (error) {
      console.error("Error fetching debug info:", error);
    } finally {
      setIsDebugLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Test Page</h1>

      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold mb-2">Auth Status</h2>
        <p>
          <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
        </p>
        <p>
          <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
        </p>
        <p>
          <strong>Token in Context:</strong> {token ? "Yes" : "No"}
        </p>
        <p>
          <strong>Token in Cookie:</strong> {cookieToken ? "Yes" : "No"}
        </p>
        <p>
          <strong>Token in LocalStorage:</strong>{" "}
          {typeof window !== "undefined" && localStorage.getItem("token")
            ? "Yes"
            : "No"}
        </p>
      </div>

      {user && (
        <div className="bg-green-100 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">User Info</h2>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>ID:</strong> {user._id}
          </p>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <button
          onClick={fetchDebugInfo}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={isDebugLoading}
        >
          {isDebugLoading ? "Loading..." : "Fetch Debug Info"}
        </button>
      </div>

      {debugInfo && (
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <h2 className="text-xl font-semibold mb-2">Debug Info</h2>
          <pre className="bg-gray-800 text-white p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      <div className="space-y-2">
        <Link
          href="/dashboard"
          className="block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-center"
        >
          Go to Dashboard
        </Link>
        <Link
          href="/login"
          className="block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
