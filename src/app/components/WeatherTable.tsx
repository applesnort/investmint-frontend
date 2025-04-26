"use client";

import { useState } from "react";
import { apiEndpoint } from "@/utils/api";

interface Forecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

interface WeatherTableProps {
  weatherData: Forecast[];
}

export default function WeatherTable({ weatherData }: WeatherTableProps) {
  const [sortField, setSortField] = useState<keyof Forecast>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Forecast) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...weatherData].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  // Compute the endpoint URL once
  const weatherEndpoint = apiEndpoint("weatherforecast");

  return (
    <div className="bg-slate-900 rounded shadow p-4">
      <h2 className="text-xl mb-2">Weather Data:</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-800">
            <th
              className="border p-2 text-left cursor-pointer hover:bg-slate-700"
              onClick={() => handleSort("date")}
            >
              Date{" "}
              {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="border p-2 text-left cursor-pointer hover:bg-slate-700"
              onClick={() => handleSort("temperatureC")}
            >
              Temp (C){" "}
              {sortField === "temperatureC" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="border p-2 text-left cursor-pointer hover:bg-slate-700"
              onClick={() => handleSort("temperatureF")}
            >
              Temp (F){" "}
              {sortField === "temperatureF" &&
                (sortDirection === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="border p-2 text-left cursor-pointer hover:bg-slate-700"
              onClick={() => handleSort("summary")}
            >
              Summary{" "}
              {sortField === "summary" && (sortDirection === "asc" ? "↑" : "↓")}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((forecast, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? "bg-slate-700" : "bg-slate-600"}
            >
              <td className="border p-2">{forecast.date}</td>
              <td className="border p-2">{forecast.temperatureC}°C</td>
              <td className="border p-2">{forecast.temperatureF}°F</td>
              <td className="border p-2">{forecast.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm opacity-75 mt-2">Endpoint: {weatherEndpoint}</p>
    </div>
  );
}
