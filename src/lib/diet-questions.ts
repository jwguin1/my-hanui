import { DIET_PRICES, won } from "./pricing";

// 공개 가격표와 기존 환자 안내 글에서 파생한다.
export const DIET_COST_ANSWER = `일산감비환은 1상자 ${DIET_PRICES.sachets}포 기준 노랑 ${won(DIET_PRICES.yellow)}, 핑크 ${won(DIET_PRICES.pink)}입니다. 하루 1포를 복용하는 경우 ${DIET_PRICES.sachets}일, 하루 2포인 경우 ${DIET_PRICES.sachets / 2}일 분량이며, 실제 복용량은 진료 후 정합니다.`;

export const DIET_QUESTIONS = [
  { href: "/diet/감비환", title: "감비환이란? 일산감비환과 처방 확인법", description: "이름이 비슷한 감비환을 구분하고 진료 전에 준비할 내용을 확인하세요." },
  { href: "/diet/감비환-효과", title: "감비환 효과, 언제부터 판단하나요?", description: "체중뿐 아니라 식사·수면·불편한 증상까지 함께 살펴보는 방법입니다." },
  { href: "/diet/감비환-복용법", title: "감비환 복용법: 식전·식후, 횟수와 빠뜨렸을 때", description: "본인 처방을 확인하고 임의로 복용량을 바꾸지 않아야 하는 이유를 안내합니다." },
  { href: "/diet/다이어트한약-기간과-비용", title: "일산감비환, 한 달 비용과 복용 기간은?", description: "100포 상자 가격과 30일 사용량 환산, 감량·유지 기간을 확인하세요." },
  { href: "/diet/다이어트한약-두근거림", title: "두근거림이나 잠이 안 오는 증상이 걱정돼요", description: "복용 중 나타날 수 있는 불편과 의료진에게 알려야 할 내용을 살펴보세요." },
  { href: "/diet/다이어트한약-복용전-확인", title: "복용 전에 어떤 병력과 약을 알려야 하나요?", description: "첫 상담 전에 확인할 건강 상태와 복용 중인 약을 정리했습니다." },
  { href: "/diet/다이어트한약-요요", title: "약을 끊으면 다시 살이 찌나요?", description: "감량 이후 유지 단계와 식습관에 관한 안내를 읽어보세요." },
  { href: "/diet/다이어트한약-위고비-마운자로-비교", title: "위고비·마운자로와 같이 먹거나 바꿔도 되나요?", description: "병용·전환 전에 확인할 약 이름, 용량, 마지막 투여일과 증상을 정리했습니다." },
  { href: "/diet/다이어트한약-커피-술", title: "커피를 마시거나 술 약속이 있어도 괜찮나요?", description: "카페인과 음주, 복용 일정 변경 전에 상담할 내용을 확인하세요." },
] as const;

export const DIET_COMPARISON_QUESTIONS = [
  { href: "/diet/해인감비환-일산감비환", title: "해인감비환과 일산감비환, 같은 감비환일까요?" },
  { href: "/diet/모래내-감비환-가격비교", title: "모래내 감비환 가격을 비교할 때, 포 수보다 먼저 볼 것" },
  { href: "/diet/해인부부-감비환-복용문의", title: "해인부부 감비환 복용 문의, 처방기관에 무엇을 알려야 하나요?" },
] as const;
