import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    // In development, use dynamic port or fallback to 5000
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      (isDev
        ? "http://localhost:${PORT}"
        : "https://investmint-api.vercel.app"),
  },
};

export default nextConfig;
