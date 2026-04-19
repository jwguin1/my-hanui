import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "@/components/Navigation";
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
  keywords: [
    "일산한의원",
    "고양시한의원",
    "일산동구한의원",
    "풍산역한의원",
    "이마트풍산점한의원",
    "침치료",
    "한약처방",
    "추나요법",
    "약침치료",
    "비수술치료",
    "초음파한의원",
    "교통사고한의원",
    "일산통증치료",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "일산한의원",
    title: "일산한의원 | 이마트풍산점 – 고양시 일산 한의원",
    description:
      "일산한의원. 이마트풍산점 3층. 침, 한약, 초음파진단, 피부레이저, 추나, 약침, 경의중앙선 풍산역 2번출구. 031-976-7706.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
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
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalClinic",
              name: "일산한의원",
              alternateName: "일산한의원 이마트풍산점",
              url: SITE_URL,
              image: `${SITE_URL}/og-image.jpg`,
              priceRange: "₩₩",
              telephone: "+82-31-976-7706",
              address: {
                "@type": "PostalAddress",
                streetAddress: "무궁화로 237, 이마트 풍산점 3층",
                addressLocality: "고양시 일산동구",
                addressRegion: "경기도",
                postalCode: "10381",
                addressCountry: "KR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 37.7636,
                longitude: 126.7735,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "10:00",
                  closes: "20:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Saturday", "Sunday"],
                  opens: "10:00",
                  closes: "16:00",
                },
              ],
              medicalSpecialty: [
                "한약처방",
                "침치료",
                "추나요법",
                "약침치료",
                "초음파진단",
                "비수술치료",
              ],
              numberOfEmployees: {
                "@type": "QuantitativeValue",
                value: 6,
              },
              sameAs: [
                "https://naver.me/IItclnGB",
                "https://blog.naver.com/jwguin",
                "https://www.youtube.com/@%EC%9D%BC%EC%82%B0%ED%95%9C%EC%9D%98%EC%9B%90",
                "https://pf.kakao.com/_eXXun",
              ],
            }),
          }}
        />
      </head>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
        <KakaoButton />
      </body>
    </html>
  );
}
