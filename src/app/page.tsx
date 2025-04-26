import ErrorDisplay from "@/app/components/ErrorDisplay";
import WeatherTable from "@/app/components/WeatherTable";
import Link from "next/link";
import { getApiUrl, apiEndpoint } from "@/utils/api";

async function testApiConnection(url: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    // Test the weatherforecast endpoint since we know it exists
    const response = await fetch(`${url}/weatherforecast`, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`API connection test failed: ${error.message}`);
    }
    return false;
  }
}

export default async function Home() {
  try {
    // Get API URL using our utility
    const apiBaseUrl = getApiUrl();
    if (!apiBaseUrl) {
      const error = new Error(
        "API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable."
      );
      error.name = "ConfigurationError";
      return (
        <div className="p-4">
          <ErrorDisplay {...error} />
          <div className="mt-4">
            <Link href="/debug" className="text-blue-400 hover:underline">
              View API Debug Information
            </Link>
          </div>
        </div>
      );
    }

    // Test API connection before making actual requests
    const isApiAvailable = await testApiConnection(apiBaseUrl);
    if (!isApiAvailable) {
      const error = new Error(
        `Cannot connect to API server at ${apiBaseUrl}. Server may be down or URL may be incorrect. Current environment: ${process.env.NODE_ENV}`
      );
      error.name = "ConnectionError";
      return (
        <div className="p-4">
          <ErrorDisplay {...error} />
          <div className="mt-4">
            <Link href="/debug" className="text-blue-400 hover:underline">
              View API Debug Information
            </Link>
          </div>
        </div>
      );
    }

    // Fetch both endpoints in parallel using our utility
    const [helloRes, weatherRes] = await Promise.all([
      fetch(apiEndpoint("api/HelloWorld"), {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      fetch(apiEndpoint("weatherforecast"), {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ]);

    // Check for errors
    if (!helloRes.ok) {
      const errorText = await helloRes.text();
      const error = new Error(
        `API Error (HelloWorld): ${helloRes.status} - ${errorText}`
      );
      error.name = "ApiError";
      return (
        <div className="p-4">
          <ErrorDisplay {...error} />
          <div className="mt-4">
            <Link href="/debug" className="text-blue-400 hover:underline">
              View API Debug Information
            </Link>
          </div>
        </div>
      );
    }
    if (!weatherRes.ok) {
      const errorText = await weatherRes.text();
      const error = new Error(
        `API Error (Weather): ${weatherRes.status} - ${errorText}`
      );
      error.name = "ApiError";
      return (
        <div className="p-4">
          <ErrorDisplay {...error} />
          <div className="mt-4">
            <Link href="/debug" className="text-blue-400 hover:underline">
              View API Debug Information
            </Link>
          </div>
        </div>
      );
    }

    // Parse responses
    const [helloData, weatherData] = await Promise.all([
      helloRes.json(),
      weatherRes.json(),
    ]);

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Investmint Dashboard</h1>

        <div className="mb-6 p-4 bg-blue-900 rounded shadow">
          <h2 className="text-xl mb-2">API Message:</h2>
          <p className="text-lg">{helloData.message}</p>
          <p className="text-sm opacity-75 mt-1">
            Endpoint: {apiEndpoint("api/HelloWorld")}
          </p>
        </div>

        <WeatherTable weatherData={weatherData} />

        <div className="mt-4">
          <Link href="/debug" className="text-blue-400 hover:underline">
            View API Debug Information
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Home page error:", error);
    const errorObj =
      error instanceof Error ? error : new Error("Unknown error occurred");
    errorObj.name = errorObj.name || "UnknownError";
    return (
      <div className="p-4">
        <ErrorDisplay {...errorObj} />
        <div className="mt-4">
          <Link href="/debug" className="text-blue-400 hover:underline">
            View API Debug Information
          </Link>
        </div>
      </div>
    );
  }
}
