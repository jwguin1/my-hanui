import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "일산한의원 색소·홍조·재생치료 – 피부에 맞춘 레이저 치료";

export default function Image() {
  return pageOgImage({ lead: "내 피부에 필요한 레이저", accent: "색소·홍조·재생치료" });
}
