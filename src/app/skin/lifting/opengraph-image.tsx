import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "일산한의원 리프팅 – 슈링크 유니버스 300샷 비용·시간·주기";

export default function Image() {
  return pageOgImage({ lead: "탄력과 얼굴선을 위한", accent: "슈링크 유니버스" });
}
