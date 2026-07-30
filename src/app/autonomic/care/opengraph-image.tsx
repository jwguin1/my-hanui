import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "이명·어지럼·두통을 침으로 먼저 확인하는 일산한의원 자율신경 진료 안내";

export default function Image() {
  return pageOgImage({
    lead: "검사에선 이상 없다는데,",
    accent: "계속 힘드시다면",
  });
}
