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
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MedicalClinic",
              name: "일산한의원",
              alternateName: "일산한의원 이마트풍산점",
              description:
                "6인의 한의사가 4개 분과를 협진합니다. 근골격계, 자율신경, 다이어트, 피부레이저 특화. 연간 65,700명 내원. 연간 8,000건 이상 한방 다이어트 처방.",
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
                "근골격계·통증",
                "자율신경·내과",
                "한방비만·다이어트",
                "피부·미용레이저",
              ],
              amenityFeature: [
                {
                  "@type": "LocationFeatureSpecification",
                  name: "대형주차장",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "평일야간진료(오후8시)",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "주말진료",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "초음파진단장비",
                  value: true,
                },
                {
                  "@type": "LocationFeatureSpecification",
                  name: "6인협진시스템",
                  value: true,
                },
              ],
              numberOfEmployees: {
                "@type": "QuantitativeValue",
                value: 6,
              },
              employee: [
                {
                  "@type": "Physician",
                  name: "장경진",
                  jobTitle: "한의사",
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "대구한의대학교 한의과대학",
                  },
                  url: `${SITE_URL}/doctor`,
                },
                {
                  "@type": "Physician",
                  name: "남태훈",
                  jobTitle: "한의사",
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "상지대학교 한의과대학",
                  },
                  url: `${SITE_URL}/doctor`,
                },
                {
                  "@type": "Physician",
                  name: "박건희",
                  jobTitle: "한의사",
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "상지대학교 한의과대학",
                  },
                  url: `${SITE_URL}/doctor`,
                },
                {
                  "@type": "Physician",
                  name: "강민석",
                  jobTitle: "한의사",
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "상지대학교 한의과대학",
                  },
                  url: `${SITE_URL}/doctor`,
                },
                {
                  "@type": "Physician",
                  name: "박동석",
                  jobTitle: "한의사",
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "부산대학교 한의과대학",
                  },
                  url: `${SITE_URL}/doctor`,
                },
                {
                  "@type": "Physician",
                  name: "이명주",
                  jobTitle: "한의사",
                  alumniOf: {
                    "@type": "CollegeOrUniversity",
                    name: "동의대학교 한의과대학",
                  },
                  url: `${SITE_URL}/doctor`,
                },
              ],
              sameAs: [
                "https://naver.me/IItclnGB",
                "https://blog.naver.com/jwguin",
                "https://www.youtube.com/@%EC%9D%BC%EC%82%B0%ED%95%9C%EC%9D%98%EC%9B%90",
                "https://pf.kakao.com/_eXXun",
              ],
            }),
          }}
        />
        {/* 네이버가 사이트 메뉴 구조를 인식하도록 — 전역 적용 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              name: [
                "일산한의원",
                "의료진",
                "통증",
                "다이어트",
                "자율신경",
                "피부",
                "의학칼럼",
                "유튜브",
                "오시는 길",
              ],
              url: [
                `${SITE_URL}/about`,
                `${SITE_URL}/doctor`,
                `${SITE_URL}/pain`,
                `${SITE_URL}/diet`,
                `${SITE_URL}/autonomic`,
                `${SITE_URL}/skin`,
                `${SITE_URL}/column`,
                `${SITE_URL}/media`,
                `${SITE_URL}/contact`,
              ],
            }),
          }}
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
