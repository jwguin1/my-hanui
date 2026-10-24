import { OG_CONTENT_TYPE, OG_SIZE, pageOgImage } from "@/lib/og-page-image";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "일산한의원 얼굴·수염 제모 – 엘리멘트 TL 가격·횟수·관리";
export default function Image() { return pageOgImage({lead:"남녀 공통 얼굴·수염 제모",accent:"엘리멘트 TL"}); }
