import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "오십견·디스크·척추관협착증을 초음파 진단 후 추나·약침으로 보는 일산한의원 만성 통증 안내";

export default function Image() {
  return pageOgImage({
    lead: "3주가 지나도 그대로라면,",
    accent: "다른 곳을 봐야 합니다",
  });
}
