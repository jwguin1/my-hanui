import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "식단을 지속하도록 돕는 일산한의원 한방 다이어트 처방 안내";

export default function Image() {
  return pageOgImage({
    lead: "굶어서 뺀 살은,",
    accent: "굶는 걸 멈추면 돌아옵니다",
  });
}
