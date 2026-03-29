import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import KakaoButton from "@/components/KakaoButton";

const SITE_URL = "https://my-hanui.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "일산한의원 | 이마트풍산점 – 고양시 일산 한의원",
    template: "%s | 일산한의원",
  },
  description:
    "고양시 일산동구 이마트 풍산점 3층. 한약처방, 침치료, 추나요법, 약침치료, 초음파 진단, 비수술 치료. 경의중앙선 풍산역 2번 출구 도보 1분. 031-976-7706",
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
      "고양시 일산동구 이마트 풍산점 3층. 건강보험 우선 진료, 대학병원급 초음파 진단, 비수술 치료. 풍산역 도보 1분.",
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
  verification: {},
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&display=swap"
          rel="stylesheet"
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
