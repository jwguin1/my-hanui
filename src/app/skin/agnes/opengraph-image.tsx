import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "일산한의원 아그네스 RF – 여드름·피지선 고주파 치료";
export default function Image() {
  return pageOgImage({ lead: "반복되는 여드름, 피지선에 집중", accent: "아그네스 RF" });
}
