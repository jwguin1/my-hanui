import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blogthumb.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "**.pstatic.net",
      },
    ],
  },
};

export default nextConfig;
