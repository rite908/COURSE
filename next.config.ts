import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "719204df-188d-4826-b3b2-96041d02e2d9-00-399wfgwm6szl.sisko.replit.dev",
    "*.sisko.replit.dev",
    "*.replit.dev",
    "*.repl.co",
    "127.0.0.1",
    "localhost",
  ],
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
