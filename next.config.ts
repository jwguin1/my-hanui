import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Windows 로컬 빌드에서 많은 페이지·OG 이미지를 동시에 생성할 때의 메모리 사용을 제한한다.
  ...(process.platform === "win32" ? { experimental: { cpus: 2 } } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  compress: true,
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
      ],
    }, {
      source: "/fonts/pretendard-1.3.9/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    }];
  },
  async redirects() {
    // 이전 건강정보 경로 중 현재 같은 원고가 남아 있는 주소만 이전한다.
    // 미발행 welcome과 삭제된 글은 404를 유지하며, 검토 중 원고의 noindex도 유지한다.
    return [
      // Host 조건으로 연구노트 서브도메인의 내부 rewrite와 충돌하지 않게 한다.
      {
        source: "/research/:path*",
        has: [{ type: "host", value: "(www\\.)?ilsanhan\\.com" }],
        destination: "https://research.ilsanhan.com/:path*",
        permanent: true,
      },
      { source: "/health-info", destination: "/blog", permanent: true },
      { source: "/health-info/20260418-post-1", destination: "/pain/20260418-post-1", permanent: true },
      { source: "/health-info/20260418-post-2", destination: "/diet/20260418-post-2", permanent: true },
      { source: "/health-info/20260418-post-3", destination: "/pain/20260418-post-3", permanent: true },
      { source: "/health-info/20260419-post-1", destination: "/pain/20260419-post-1", permanent: true },
      { source: "/health-info/20260419-post-2", destination: "/pain/20260419-post-2", permanent: true },
    ];
  },
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
