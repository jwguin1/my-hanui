import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "담 결림·허리 삐끗·발목 염좌를 침과 물리치료로 보는 일산한의원 급성 통증 안내";

export default function Image() {
  return pageOgImage({
    lead: "담 결리고 삐끗한 통증,",
    accent: "대개 몇 번이면 좋아집니다",
  });
}
