export default async function Home() {
  try {
    // Get API URL from environment variables
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiBaseUrl) throw new Error("API URL is not configured");

    // Debug output - will appear in browser console
    console.log("Connecting to API at:", apiBaseUrl);

    // Fetch both endpoints in parallel
    const [helloRes, weatherRes] = await Promise.all([
      fetch(`${apiBaseUrl}/api/HelloWorld`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      fetch(`${apiBaseUrl}/weatherforecast`, {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    ]);

    // Check for errors
    if (!helloRes.ok) {
      const errorText = await helloRes.text();
      throw new Error(
        `API Error (HelloWorld): ${helloRes.status} - ${errorText}`
      );
    }
    if (!weatherRes.ok) {
      const errorText = await weatherRes.text();
      throw new Error(
        `API Error (Weather): ${weatherRes.status} - ${errorText}`
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
            Endpoint: {apiBaseUrl}/api/HelloWorld
          </p>
        </div>

        <div className="p-4 bg-slate-950 rounded shadow">
          <h2 className="text-xl mb-2">Weather Forecast:</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900">
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Temp (C)</th>
                <th className="border p-2 text-left">Temp (F)</th>
                <th className="border p-2 text-left">Summary</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.map(
                (
                  forecast: {
                    date: string;
                    temperatureC: number;
                    temperatureF: number;
                    summary: string;
                  },
                  index: number
                ) => (
                  <tr
                    key={index}
                    className={
                      index % 2 === 0 ? "bg-slate-800" : "bg-slate-700"
                    }
                  >
                    <td className="border p-2">{forecast.date}</td>
                    <td className="border p-2">{forecast.temperatureC}°C</td>
                    <td className="border p-2">{forecast.temperatureF}°F</td>
                    <td className="border p-2">{forecast.summary}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          <p className="text-sm opacity-75 mt-2">
            Endpoint: {apiBaseUrl}/weatherforecast
          </p>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4 text-red-500">
        <h2 className="text-xl font-bold mb-2">Connection Error</h2>
        <p className="mb-4">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>

        <div className="p-3 bg-slate-900 rounded">
          <h3 className="font-bold mb-1">Debug Information:</h3>
          <p>API URL: {process.env.NEXT_PUBLIC_API_URL || "Not set"}</p>
          <p>Environment: {process.env.NODE_ENV || "development"}</p>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Retry Connection
        </button>
      </div>
    );
  }
}
