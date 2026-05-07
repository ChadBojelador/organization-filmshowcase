const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Makes an API request. Automatically attaches the JWT token from
 * localStorage as a Bearer token when one exists, so authenticated
 * endpoints (admin write operations) work without manual header setup.
 */
export async function apiRequest(path, options = {}) {
  const token = typeof window !== "undefined"
    ? window.localStorage.getItem("token")
    : null;

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : {};

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}
