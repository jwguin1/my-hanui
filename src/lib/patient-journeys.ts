import type { JourneyStep } from "@/components/PatientJourney";
import { CARE_GUIDE } from "@/lib/care-guide";
import { postPath } from "@/lib/slug";
import { SPOT_RETOUCH_POLICY } from "@/lib/pricing";

export const HOME_JOURNEY: JourneyStep[] = [
  { title: "불편한 점부터 말씀해 주세요", text: "어떤 치료를 받아야 할지 미리 정하지 않으셔도 됩니다. 언제부터, 어떤 상황에서 불편했는지 듣고 진료를 시작합니다. 복용 중인 약이나 기존 검사 결과가 있으면 함께 살펴봅니다.", href: "/pain/acute#visit-guide", linkLabel: "통증 진료 준비와 소요 시간" },
  { title: "의료진이 진찰하고 방향을 정합니다", text: "증상과 진찰 결과를 바탕으로 필요한 치료를 설명합니다. 추가 검사나 전문 치료가 필요하면 그 이유를 말씀드리고 적절한 의료기관으로 의뢰합니다.", href: "/doctor", linkLabel: "진료하는 의료진 보기" },
  { title: "치료 과정과 비용을 듣고 결정합니다", text: "어떤 치료를 받는지, 건강보험이 적용되는지, 별도 비용이 있는지 먼저 안내합니다. 궁금한 점을 충분히 물어보고 치료를 결정하세요.", href: "/pricing", linkLabel: "진료비와 치료 구성 보기" },
  { title: "집에서의 관리와 다음 진료를 안내합니다", text: "통증 치료 후 살펴볼 변화, 한약 복용법, 피부 시술 후 관리처럼 받으신 진료에 맞춰 설명합니다. 치료 중 궁금한 점은 진료시간 내 카카오톡으로 문의하실 수 있습니다.", href: "/aftercare", linkLabel: "치료 후 관리 모음" },
];

export const DIET_JOURNEY: JourneyStep[] = [
  { title: "체중보다 먼저, 생활과 건강 상태를 듣습니다", text: "최근 체중 변화와 식사·수면 패턴, 이전 다이어트 경험을 확인합니다. 현재 복용 중인 약과 병력도 살펴 감비환 처방에 함께 반영합니다.", href: postPath("diet", "다이어트한약-복용전-확인"), linkLabel: "복용 전 준비할 내용" },
  { title: "처방과 복용량을 설명합니다", text: "감비환이 필요한지 판단하고 본인에게 맞는 복용량과 일정을 안내합니다. 상자 가격과 예상 사용 기간을 확인한 뒤 처방을 결정합니다.", href: "#prices", linkLabel: "상자 가격과 복용 기간" },
  { title: "복용 중 몸의 반응을 함께 살핍니다", text: "체중 변화뿐 아니라 식사량, 수면과 불편한 증상을 함께 확인합니다. 두근거림이나 불면 등이 생기면 의료진에게 알려주세요. 반응을 살펴 용량 조절이나 처방 변경을 안내합니다.", href: postPath("diet", "다이어트한약-두근거림"), linkLabel: "복용 중 두근거림 안내" },
  { title: "감량 이후의 유지 계획을 세웁니다", text: "목표에 가까워지면 식사 습관과 체중 변화를 보며 복용량을 줄이거나 종료할 시점을 상의합니다. 감량 이후에도 이어갈 수 있는 생활 방식을 함께 정합니다.", href: postPath("diet", "다이어트한약-요요"), linkLabel: "복용을 마친 뒤 체중 관리" },
];

// 사용자가 확인한 CO₂ 리터치 운영 기준. 화면과 FAQ에서 같은 안내를 사용한다.
export const SPOT_RETOUCH = {
  reason: "CO₂ 시술은 흉터 부담을 줄이기 위해 피부 표면 위주로 얕게 제거하므로, 깊은 점은 일부 남거나 편평사마귀 등이 다시 올라올 수 있습니다.",
  timing: `남거나 다시 올라온 병변은 시술 ${SPOT_RETOUCH_POLICY.afterWeeks}주 이후 피부가 충분히 아문 것을 확인하고 리터치로 제거할 수 있습니다.`,
  cost: `리터치는 최초 시술 후 ${SPOT_RETOUCH_POLICY.withinMonths}개월 동안 개당 ${SPOT_RETOUCH_POLICY.perLesion.toLocaleString("ko-KR")}원, 무제한 ${SPOT_RETOUCH_POLICY.unlimited.toLocaleString("ko-KR")}원에 진행합니다.`,
};

export const SKIN_JOURNEY: JourneyStep[] = [
  { title: "어떤 병변인지 먼저 진찰합니다", text: "점·편평사마귀·쥐젖은 겉모습이 비슷해도 치료 계획이 다릅니다. 확대경으로 모양과 분포를 살피고 제거할 부위를 정합니다. 추가 검사가 필요한 병변은 검사받을 의료기관으로 의뢰합니다." },
  { title: "시술 범위와 비용을 확인합니다", text: "얼굴과 목의 어느 부위까지 제거할지, 100개까지와 개수 제한 없음 중 어떤 구성이 맞는지 설명합니다. 회복 과정과 리터치 조건도 시술 전에 함께 안내합니다.", href: "#prices", linkLabel: "부위별 시술 비용" },
  { title: "마취 후 피부 상태에 맞춰 제거합니다", text: "마취 연고를 충분히 바른 뒤 CO₂ 레이저로 시술합니다. 병변의 깊이와 피부 상태를 보며 제거하고, 귀가 전 보호재·연고 사용과 세안 방법을 안내합니다.", href: "/aftercare", linkLabel: "시술 후 관리 안내" },
  { title: "회복을 살피고 남은 병변을 확인합니다", text: "깊은 점이 남거나 편평사마귀가 다시 올라오면 시술 4주 이후 피부가 아문 상태를 확인해 리터치를 진행합니다. 회복 중 궁금한 변화가 있으면 진료시간 내 카카오톡으로 문의해 주세요.", href: "#retouch", linkLabel: "리터치 기간과 비용" },
];

export const PAIN_JOURNEY: JourneyStep[] = [
  { title: "아픈 위치와 움직임을 확인합니다", text: "언제부터 아팠는지, 어떤 자세나 동작에서 심해지는지 듣고 진찰합니다. 필요한 경우 근골격계 초음파를 활용하고 기존 검사 결과도 현재 증상과 함께 살펴봅니다." },
  { title: "침·추나·약침의 필요성을 설명합니다", text: "진찰과 검사 결과를 바탕으로 치료를 정합니다. 기본 침·물리치료와 추나·약침의 목적, 건강보험 적용 여부와 추가 비용을 설명한 뒤 진행합니다.", href: "/pricing#pain", linkLabel: "통증 치료별 비용 확인" },
  { title: "치료 후 일상에서의 변화를 살핍니다", text: "통증의 크기뿐 아니라 목을 돌릴 때, 팔을 들 때, 앉거나 걸을 때의 불편이 어떻게 달라졌는지 확인합니다. 집에서 주의할 움직임과 다음 진료 일정을 안내합니다.", href: "/aftercare", linkLabel: "침·추나·약침 후 관리" },
  { title: "정해진 시점에 경과를 다시 평가합니다", text: `${CARE_GUIDE.acuteReview} ${CARE_GUIDE.chronicReview} 호전이 더디면 진단과 치료 계획을 다시 살피고 필요한 검사·전문 치료를 연결합니다.`, href: "/pain/chronic", linkLabel: "오래가는 통증의 치료 과정" },
];
