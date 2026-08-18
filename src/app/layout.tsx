import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import KakaoButton from "@/components/KakaoButton";

const notoSerifKR = localFont({
  src: [
    {
      path: "../../public/fonts/NotoSerifKR-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/NotoSerifKR-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/NotoSerifKR-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-serif-kr",
  fallback: ["Georgia", "serif"],
});

const SITE_URL = "https://www.ilsanhan.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "일산한의원 | 이마트풍산점 – 고양시 일산 한의원",
    template: "%s | 일산한의원",
  },
  description:
    "일산한의원. 이마트풍산점 3층. 침, 한약, 초음파진단, 피부레이저, 추나, 약침, 경의중앙선 풍산역 2번출구. 031-976-7706.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "일산한의원",
    title: "일산한의원 | 이마트풍산점 – 고양시 일산 한의원",
    description:
      "일산한의원. 이마트풍산점 3층. 침, 한약, 초음파진단, 피부레이저, 추나, 약침, 경의중앙선 풍산역 2번출구. 031-976-7706.",
    // 실제 파일 치수와 일치시킬 것 (public/og-image.jpg = 1280x846).
    // 하위 페이지는 openGraph 를 선언하는 순간 이 images 를 상속받지 못하므로
    // 반드시 lib/page-metadata.ts 의 pageMetadata() 를 통해 metadata 를 만든다.
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1280,
        height: 846,
        alt: "일산한의원 이마트풍산점",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  verification: {
    google: "22ChFnBQrveZIT-GeE1Og3uQAH1Y3BMqj1i2ZQqCD14",
    other: {
      "naver-site-verification": "83d2c358b88e14b85aafa600c95a741cf4d0a0e6",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSerifKR.variable}>
      <head>
        <meta name="naver-site-verification" content="aab70373e7135bf4cc9a612bc491f5f1a662f675" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <Footer />
        <KakaoButton />
      </body>
    </html>
  );
}
