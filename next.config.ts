import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.RAILWAY_ENVIRONMENT ? "standalone" : undefined,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
