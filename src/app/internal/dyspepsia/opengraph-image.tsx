import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "급체는 당일 침 치료, 반복되는 소화불량은 한약으로 보는 일산한의원 안내";

export default function Image() {
  return pageOgImage({
    lead: "체한 건 며칠이면 낫는데,",
    accent: "늘 더부룩한 건 다릅니다",
  });
}
