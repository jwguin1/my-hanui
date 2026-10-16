import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "일산한의원 체질보약 – 맞춤보약·두통·어지럼·갱년기";
export default function Image() { return pageOgImage({ lead: "맞춤보약·두통·어지럼·갱년기", accent: "체질보약" }); }
