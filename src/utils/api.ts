/**
 * Gets the API URL from environment variables with support for dynamic port configuration.
 *
 * For local development:
 * - You can set NEXT_PUBLIC_API_URL=http://localhost:5000 in .env.local
 * - Or use the PORT environment variable: NEXT_PUBLIC_API_URL=http://localhost:${PORT}
 *
 * For production:
 * - The value from Vercel environment variables will be used
 * - Defaults to https://investmint-api.vercel.app if not set
 */
export function getApiUrl(): string {
  // Get the environment variable
  let apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return "";
  }

  // Only replace ${PORT} in development
  if (process.env.NODE_ENV === "development" && apiUrl.includes("${PORT}")) {
    const port = process.env.PORT || "5000"; // Default port if not specified
    apiUrl = apiUrl.replace("${PORT}", port);
  }

  return apiUrl;
}

/**
 * Builds a complete API endpoint URL
 * @param endpoint - The API endpoint path (e.g., "/weatherforecast")
 * @returns Full URL to the API endpoint
 */
export function apiEndpoint(endpoint: string): string {
  const baseUrl = getApiUrl();

  // Ensure endpoint starts with slash if baseUrl doesn't end with one
  if (!baseUrl.endsWith("/") && !endpoint.startsWith("/")) {
    return `${baseUrl}/${endpoint}`;
  }

  // Avoid double slashes if baseUrl ends with slash and endpoint starts with one
  if (baseUrl.endsWith("/") && endpoint.startsWith("/")) {
    return `${baseUrl}${endpoint.substring(1)}`;
  }

  return `${baseUrl}${endpoint}`;
}
