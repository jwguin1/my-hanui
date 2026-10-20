import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "일산한의원 방문진료 – 집으로 찾아가는 한의사";
export default function Image() { return pageOgImage({ lead: "집으로 찾아가는 한의사 · 서울·경기", accent: "일산한의원 방문진료" }); }
