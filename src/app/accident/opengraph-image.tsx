import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "교통사고 후유증을 자동차보험으로 추나·물리치료하는 일산한의원 안내";

export default function Image() {
  return pageOgImage({
    lead: "사고 직후엔 괜찮다가,",
    accent: "며칠 뒤에 옵니다",
  });
}
