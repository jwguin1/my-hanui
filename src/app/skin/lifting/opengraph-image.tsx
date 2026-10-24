import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "일산한의원 리프팅 – 슈링크·볼뉴머 가격·샷 수·시술 간격";

export default function Image() {
  return pageOgImage({ lead: "탄력과 얼굴선을 위한", accent: "슈링크 · 볼뉴머" });
}
