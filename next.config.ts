import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  allowedDevOrigins: [
    "*.replit.dev",
    "*.sisko.replit.dev",
    "*.pike.replit.dev",
    "*.repl.co",
    "127.0.0.1",
  ],
  images: {
    qualities: [75, 95, 100],

  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
        ],
      },
    ];
  },
};

export default nextConfig;
