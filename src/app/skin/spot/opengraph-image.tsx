import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "점·편평사마귀·쥐젖을 CO2 레이저로 제거하는 일산한의원 잡티 제거 안내";

export default function Image() {
  return pageOgImage({
    lead: "점, 빼기 전에",
    accent: "한 번 보고 결정합니다",
  });
}
