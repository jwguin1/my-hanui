import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "일산한의원 건강보험 한약 – 소화불량·생리통 등 6개 질환";
export default function Image() { return pageOgImage({ lead: "소화불량·생리통 등 6개 질환", accent: "건강보험 한약" }); }
