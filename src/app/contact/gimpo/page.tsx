import RegionalVisitGuide from "../_components/RegionalVisitGuide";
import { pageMetadata } from "@/lib/page-metadata";

const guide = {
  path: "/contact/gimpo",
  title: "김포에서 일산한의원 오시는 길 · 차량·전철·일요일 접수",
  description: "김포 장기동에서 이마트 풍산점 3층 일산한의원까지 자가용과 김포골드라인·서해선으로 오는 길입니다. 주차 위치, 일요일 접수 마감, 원장별 진료 요일과 예약 방법을 확인하세요.",
  origin: "김포",
  driving: "김포 장기동에서 출발하신다면 내비게이션 목적지에 ‘이마트 풍산점’을 입력하세요. 출발 전 지도에서 일산대교 방면을 포함한 경로와 도착 예정 시각을 확인하실 수 있습니다.",
  railSteps: [
    "장기역에서 김포골드라인 김포공항행을 타고 종점인 김포공항역에서 내리세요.",
    "김포공항역에서 서해선 일산행으로 갈아타고 풍산역에서 내리세요. 승강장 전광판에서 종착역이 ‘일산’인지 확인하세요.",
  ],
};

export const metadata = pageMetadata(guide);

export default function GimpoVisitPage() {
  return <RegionalVisitGuide guide={guide} />;
}
