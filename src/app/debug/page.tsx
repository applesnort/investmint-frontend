"use client";

import { useState, useEffect } from "react";
import { getApiUrl, apiEndpoint } from "@/utils/api";

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState<{
    url: string;
    resolvedUrl: string;
    weatherStatus: string;
    helloStatus: string;
    nodeEnv: string;
    error?: string;
  }>({
    url: "Loading...",
    resolvedUrl: "Resolving...",
    weatherStatus: "Testing...",
    helloStatus: "Testing...",
    nodeEnv: "Loading...",
  });

  useEffect(() => {
    // Get environment info before any async operations
    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "Not configured";
    const resolvedUrl = getApiUrl();
    const nodeEnv = process.env.NODE_ENV || "unknown";

    // Immediately update with synchronous data
    setApiStatus((prev) => ({
      ...prev,
      url: rawApiUrl,
      resolvedUrl,
      nodeEnv,
    }));

    const checkEndpoints = async () => {
      try {
        let weatherStatus = "Not tested";
        let helloStatus = "Not tested";

        // Test if the API is available
        if (resolvedUrl) {
          try {
            const weatherEndpoint = apiEndpoint("weatherforecast");
            const weatherRes = await fetch(weatherEndpoint, {
              method: "HEAD",
              cache: "no-store",
            });
            weatherStatus = `${weatherRes.status} ${weatherRes.statusText}`;
          } catch (err) {
            weatherStatus = `Error: ${
              err instanceof Error ? err.message : "Unknown error"
            }`;
          }

          try {
            const helloEndpoint = apiEndpoint("api/HelloWorld");
            const helloRes = await fetch(helloEndpoint, {
              method: "HEAD",
              cache: "no-store",
            });
            helloStatus = `${helloRes.status} ${helloRes.statusText}`;
          } catch (err) {
            helloStatus = `Error: ${
              err instanceof Error ? err.message : "Unknown error"
            }`;
          }
        }

        setApiStatus((prev) => ({
          ...prev,
          weatherStatus,
          helloStatus,
        }));
      } catch (error) {
        setApiStatus((prev) => ({
          ...prev,
          weatherStatus: "Error",
          helloStatus: "Error",
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    };

    checkEndpoints();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Debug Information</h1>

      <div className="bg-slate-800 p-4 rounded mb-6">
        <h2 className="text-xl mb-2">Environment Information</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-bold">NODE_ENV:</div>
          <div className="font-mono">{apiStatus.nodeEnv}</div>

          <div className="font-bold">Raw NEXT_PUBLIC_API_URL:</div>
          <div className="font-mono break-all">{apiStatus.url}</div>

          <div className="font-bold">Resolved API URL:</div>
          <div className="font-mono break-all">{apiStatus.resolvedUrl}</div>
        </div>
      </div>

      <div className="bg-slate-800 p-4 rounded mb-6">
        <h2 className="text-xl mb-2">API Endpoint Status</h2>

        <div className="mb-4">
          <h3 className="font-semibold">/weatherforecast</h3>
          <div className="font-mono bg-slate-900 p-2 rounded mt-1">
            Status: {apiStatus.weatherStatus}
          </div>
        </div>

        <div>
          <h3 className="font-semibold">/api/HelloWorld</h3>
          <div className="font-mono bg-slate-900 p-2 rounded mt-1">
            Status: {apiStatus.helloStatus}
          </div>
        </div>
      </div>

      {apiStatus.error && (
        <div className="bg-red-900/20 border border-red-500 p-4 rounded">
          <h2 className="text-xl text-red-400 mb-2">Error</h2>
          <p className="font-mono">{apiStatus.error}</p>
        </div>
      )}

      <div className="mt-6 bg-slate-800 p-4 rounded">
        <h2 className="text-xl mb-2">Using Dynamic Port Configuration</h2>
        <ol className="list-decimal pl-5 space-y-1">
          <li>
            For local development, create a{" "}
            <code className="bg-slate-900 px-1">.env.local</code> file with:
            <pre className="bg-slate-900 p-2 rounded mt-1 mb-2 text-sm">
              NEXT_PUBLIC_API_URL=http://localhost:${"{PORT}"}
            </pre>
          </li>
          <li>Start your API on a specific port, e.g. port 5000</li>
          <li>
            Start Next.js with the PORT environment variable:
            <pre className="bg-slate-900 p-2 rounded mt-1 mb-2 text-sm">
              PORT=5000 pnpm dev
            </pre>
          </li>
          <li>
            The API utility will automatically replace ${"{PORT}"} with the
            actual port value
          </li>
        </ol>
      </div>

      <div className="mt-6 bg-slate-800 p-4 rounded">
        <h2 className="text-xl mb-2">Troubleshooting</h2>
        <p className="mb-2">If the API endpoints are returning 404 errors:</p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Verify the API server is running on the expected port</li>
          <li>Check that the correct URL is set in NEXT_PUBLIC_API_URL</li>
          <li>Make sure your API project has the correct routes configured</li>
          <li>Check for CORS issues if testing locally</li>
          <li>Verify network connectivity to the API server</li>
        </ol>
      </div>
    </div>
  );
}
