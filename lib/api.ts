type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  headers?: Record<string, string>
}

export async function fetchWithAuth(url: string, options: FetchOptions = {}) {
  // Get token from localStorage
  const token = localStorage.getItem("token")

  // Set default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Add Authorization header if token exists
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers,
  }

  // Add body if it exists
  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body)
  }

  // Make the request
  const response = await fetch(url, fetchOptions)

  // Parse JSON response
  const data = await response.json()

  // If response is not ok, throw an error
  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
  }

  return data
}

