import RegionalVisitGuide from "../_components/RegionalVisitGuide";
import { pageMetadata } from "@/lib/page-metadata";

const guide = {
  path: "/contact/eunpyeong",
  title: "서울 은평에서 일산한의원 오시는 길 · 대곡역 환승·차량 안내",
  description: "은평구 연신내역에서 대곡역을 거쳐 풍산역으로 오는 길, 자가용 주차, 일요일 접수 마감과 오서혜 한방내과 전문의 진료 요일을 안내합니다.",
  origin: "서울 은평",
  driving: "은평구에서 출발할 때는 내비게이션 목적지를 ‘이마트 풍산점’으로 정하세요. 연신내·불광 등 실제 출발지를 넣으면 고양시 일산동구까지의 경로와 도착 예정 시각을 볼 수 있습니다.",
  railSteps: [
    "연신내역에서 3호선 대화행 열차를 타고 대곡역에서 내리세요.",
    "대곡역에서 경의중앙선 일산·문산 방면 일반열차로 갈아타세요. 곡산역과 백마역을 지나 세 번째 역이 풍산역입니다.",
  ],
};

export const metadata = pageMetadata(guide);

export default function EunpyeongVisitPage() {
  return <RegionalVisitGuide guide={guide} />;
}
