import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Windows 로컬 빌드에서 많은 페이지·OG 이미지를 동시에 생성할 때의 메모리 사용을 제한한다.
  ...(process.platform === "win32" ? { experimental: { cpus: 2 } } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blogthumb.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "**.pstatic.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
