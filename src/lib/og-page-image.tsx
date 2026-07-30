import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/** 라이트 웜 토큰과 동일한 값 (globals.css :root) */
const BG = "#fdfbf7";
const INK = "#2a211a";
const TAN = "#8a5f38";
const PRIMARY = "#6b4226";
const BRUSH = "#dcc7a6";
const MUTED = "#857c73";

/**
 * 진료 페이지 공통 OG 이미지.
 * 배경은 --bg 단색, 페이지 h1(투톤) + 브랜드 한 줄로 구성한다.
 */
export function pageOgImage({
  lead,
  accent,
}: {
  lead: string;
  accent: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: BG,
          padding: "0 88px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            letterSpacing: 6,
            color: PRIMARY,
          }}
        >
          ILSANHAN
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 28,
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.28,
            letterSpacing: -2,
          }}
        >
          <span style={{ color: INK }}>{lead}</span>
          <span style={{ color: TAN }}>{accent}</span>
        </div>

        <div
          style={{
            display: "flex",
            width: 260,
            height: 8,
            marginTop: 32,
            borderRadius: 8,
            background: BRUSH,
          }}
        />

        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 28,
            color: MUTED,
          }}
        >
          일산한의원 · 이마트 풍산점 3층
        </div>
      </div>
    ),
    OG_SIZE
  );
}
