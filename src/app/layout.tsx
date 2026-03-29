import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import KakaoButton from "@/components/KakaoButton";

export const metadata: Metadata = {
  title: "일산한의원 | 이마트풍산점",
  description:
    "경기 고양시 일산동구 이마트 풍산점 3층. 한약처방, 침치료, 추나요법, 약침치료. 경의중앙선 풍산역 2번 출구 도보 1분.",
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
