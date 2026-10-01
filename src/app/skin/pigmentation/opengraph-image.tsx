import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "일산한의원 색소치료 – 피코토닝·제네시스 비용과 기미·흑자 질문 안내";

export default function Image() {
  return pageOgImage({ lead: "기미·잡티부터 피부결까지", accent: "피코토닝 · 제네시스" });
}
