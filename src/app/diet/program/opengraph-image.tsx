import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "일산감비환 가격과 복용 상담 안내";

export default function Image() {
  return pageOgImage({
    lead: "일산감비환,",
    accent: "가격부터 복용 상담까지",
  });
}
