export default async function Home() {
  try {
    // Fetch the hello world message
    const helloRes = await fetch("http://localhost:5131/api/HelloWorld");
    if (!helloRes.ok) throw new Error("Failed to fetch hello world data");
    const helloData = await helloRes.json();

    // Fetch the weather forecast data
    const weatherRes = await fetch("http://localhost:5131/weatherforecast");
    if (!weatherRes.ok) throw new Error("Failed to fetch weather data");
    const weatherData = await weatherRes.json();

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Investmint Dashboard</h1>

        <div className="mb-6 p-4 bg-blue-900 rounded shadow">
          <h2 className="text-xl mb-2">API Message:</h2>
          <p>{helloData.message}</p>
        </div>

        <div className="p-4 bg-slate-950 rounded shadow">
          <h2 className="text-xl mb-2">Weather Forecast:</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-900">
                <th className="border p-2 bg-slate-950 text-left">Date</th>
                <th className="border p-2 bg-slate-950 text-left">Temp (C)</th>
                <th className="border p-2 bg-slate-950 text-left">Temp (F)</th>
                <th className="border p-2 bg-slate-950 text-left">Summary</th>
              </tr>
            </thead>
            <tbody>
              {weatherData.map((forecast, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  <td className="border p-2 bg-slate-950">{forecast.date}</td>
                  <td className="border p-2 bg-slate-950">{forecast.temperatureC}°C</td>
                  <td className="border p-2 bg-slate-950">{forecast.temperatureF}°F</td>
                  <td className="border p-2 bg-slate-950">{forecast.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return <div className="p-4 text-red-500">Error: {errorMessage}</div>;
  }
}
