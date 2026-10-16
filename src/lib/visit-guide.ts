import { CLINIC, CLINIC_HOURS_WEEKDAY, CLINIC_HOURS_WEEKEND } from "@/lib/clinic";
import { PAIN_PRICES, HERBAL_PRICES, HERBAL_INSURANCE_CONDITIONS, HERBAL_INSURANCE_LIMIT, PHARMACOPUNCTURE_NOTE, won } from "@/lib/pricing";

export const PAIN_PRICE_FAQS = [
  {
    q: "목·허리·어깨 통증으로 처음 가면 진료비가 얼마인가요?",
    a: `일산한의원의 일반 근골격계 초진 진료비는 건강보험 적용 후 본인부담금 ${won(PAIN_PRICES.firstVisit)}입니다. 추나와 초음파 유도 약침의 비용도 함께 확인하실 수 있습니다.`,
    href: "/pain/acute#prices", linkLabel: "통증 치료 비용 보기",
  },
  {
    q: "단순추나와 복잡추나 비용은 각각 얼마인가요?",
    a: `단순추나는 ${won(PAIN_PRICES.simpleChuna)}, 복잡추나는 ${won(PAIN_PRICES.complexChuna)}입니다. 건강보험 적용 후 본인부담금이며, 기본 진료비가 포함된 금액입니다.`,
    href: "/pain/chronic#prices", linkLabel: "추나 치료와 비용 보기",
  },
  {
    q: "초음파 유도 약침은 종류별로 얼마인가요?",
    a: `초음파 유도 약침은 기본 통원약침(포도당 5%) ${won(PAIN_PRICES.dextrose)}, PDRN 약침 ${won(PAIN_PRICES.pdrn)}입니다. ${PHARMACOPUNCTURE_NOTE}`,
    href: "/pain/chronic#prices", linkLabel: "초음파 유도 약침 안내",
  },
];

export const HERBAL_PRICE_FAQS = [
  {
    q: "건강보험 한약과 1~3개월 한약 비용은 얼마인가요?",
    a: `건강보험 적용 대상 질환의 한약은 10일 본인부담금 ${HERBAL_PRICES.insuredTenDays}입니다. 한약은 1개월 ${won(HERBAL_PRICES.oneMonth)}, 2개월 ${won(HERBAL_PRICES.twoMonths)}, 3개월 ${won(HERBAL_PRICES.threeMonths)}입니다.`,
    href: "/internal/dyspepsia#herbal-prices", linkLabel: "한약 처방과 비용 보기",
  },
  {
    q: "건강보험 한약은 어떤 질환에, 몇 번까지 적용되나요?",
    a: `대상은 ${HERBAL_INSURANCE_CONDITIONS.join("·")} 6개 질환입니다. ${HERBAL_INSURANCE_LIMIT}`,
    href: "/internal/dyspepsia#herbal-prices", linkLabel: "건강보험 한약 안내",
  },
  {
    q: "내 한약에 어떤 약재가 들어가는지 확인할 수 있나요?",
    a: "일산한의원에서는 처방전과 실제 사용된 약재 사진을 보내드립니다. 복용 중 궁금한 내용은 카카오톡으로 문의해 주세요.",
    href: "/doctor", linkLabel: "한약을 처방하는 의료진 보기",
  },
];

export const VISIT_FAQS = [
  ...PAIN_PRICE_FAQS,
  ...HERBAL_PRICE_FAQS,
  {
    q: "예약 없이 오늘 바로 침 치료를 받을 수 있나요?",
    a: "예약 없이 방문하셔도 당일 침·물리치료가 가능합니다. 방문 전 카카오톡으로 아픈 부위와 오실 시간을 알려주시면 진료 안내를 받으실 수 있습니다.",
    href: "/pain/acute", linkLabel: "당일 통증 진료 안내",
  },
  {
    q: "퇴근 후나 주말에도 진료하나요?",
    a: `평일은 ${CLINIC_HOURS_WEEKDAY}, 토·일·공휴일은 ${CLINIC_HOURS_WEEKEND} 진료합니다. 평일 점심시간은 13:00~14:00이며 주말·공휴일은 점심시간 없이 진료합니다. ${CLINIC.holidayClosedNote}`,
    href: "/contact", linkLabel: "진료시간과 방문 안내",
  },
  {
    q: "주차는 어디에 하고, 주차비는 얼마인가요?",
    a: "이마트 풍산점 4·5·6·7층 주차장을 이용하시면 3시간 무료주차가 가능합니다. 주차 후 3층 일산한의원으로 오시면 됩니다. 풍산역 2번 출구에서는 도보 1분입니다.",
    href: "/contact", linkLabel: "오시는 길 보기",
  },
  {
    q: "어떤 진료를 받아야 할지 모르겠는데 카카오톡으로 물어봐도 되나요?",
    a: "네. 가장 불편한 증상과 언제부터 시작됐는지, 방문을 원하는 시간을 남겨주세요. 예약과 진료 안내는 카카오톡으로 편하게 문의하실 수 있습니다.",
    href: CLINIC.kakaoHref, linkLabel: "카카오톡 상담",
  },
];
