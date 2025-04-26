import React from "react";

export default function ErrorDisplay(error: Error) {
  console.error("Error occurred:", error);

  return (
    <div className="p-6 max-w-4xl mx-auto my-8 bg-red-900/20 border border-red-500 rounded-lg text-white">
      <h1 className="text-2xl font-bold text-red-400 mb-4">Error Occurred</h1>
      <div className="bg-slate-800 p-4 rounded mb-4">
        <p className="text-lg font-mono mb-2">
          {error.message || "Unknown error"}
        </p>
      </div>
      <div className="mt-4 bg-slate-900 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Troubleshooting:</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Check that your API server is running</li>
          <li>Verify the API URL is correctly set in environment variables</li>
          <li>Ensure the endpoint paths are correct</li>
          <li>Check network connectivity to the API server</li>
        </ul>
      </div>
    </div>
  );
}
