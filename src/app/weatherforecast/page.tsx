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

export default async function WeatherForecastPage() {
  try {
    // Get API URL using our utility
    const apiBaseUrl = getApiUrl();
    if (!apiBaseUrl) {
      const error = new Error(
        "API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable."
      );
      return (
        <div className="p-4 bg-slate-950 min-h-screen">
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
        `Cannot connect to API server at ${apiBaseUrl}. Server may be down or URL may be incorrect.`
      );
      return (
        <div className="p-4 bg-slate-950 min-h-screen">
          <ErrorDisplay {...error} />
          <div className="mt-4">
            <Link href="/debug" className="text-blue-400 hover:underline">
              View API Debug Information
            </Link>
          </div>
        </div>
      );
    }

    // Fetch weather forecast data using our utility
    const weatherRes = await fetch(apiEndpoint("weatherforecast"), {
      cache: "no-store", // Ensure fresh data on each request
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check for errors
    if (!weatherRes.ok) {
      const errorText = await weatherRes.text();
      const error = new Error(
        `API Error (Weather): ${weatherRes.status} - ${errorText}`
      );
      return (
        <div className="p-4 bg-slate-950 min-h-screen">
          <ErrorDisplay {...error} />
          <div className="mt-4">
            <Link href="/debug" className="text-blue-400 hover:underline">
              View API Debug Information
            </Link>
          </div>
        </div>
      );
    }

    // Parse response
    const weatherData = await weatherRes.json();

    return (
      <div className="p-4 bg-slate-950 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Weather Forecast</h1>

        <WeatherTable weatherData={weatherData} />

        <div className="mt-4">
          <Link href="/debug" className="text-blue-400 hover:underline">
            View API Debug Information
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Weather page error:", error);
    const errorObj =
      error instanceof Error ? error : new Error("Unknown error occurred");
    return (
      <div className="p-4 bg-slate-950 min-h-screen">
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
