import { DIET_PRICES, won } from "./pricing";

// 공개 가격표와 기존 환자 안내 글에서 파생한다.
export const DIET_COST_ANSWER = `일산감비환은 1상자 ${DIET_PRICES.sachets}포 기준 노랑 ${won(DIET_PRICES.yellow)}, 핑크 ${won(DIET_PRICES.pink)}입니다. 하루 1포를 복용하는 경우 ${DIET_PRICES.sachets}일, 하루 2포인 경우 ${DIET_PRICES.sachets / 2}일 분량이며, 실제 복용량은 진료 후 정합니다.`;

export const DIET_QUESTIONS = [
  { href: "/diet/다이어트한약-기간과-비용", title: "다이어트 한약, 한 달 비용과 복용 기간은?", description: "100포 상자 가격과 30일 사용량 환산, 감량·유지 기간을 확인하세요." },
  { href: "/diet/다이어트한약-두근거림", title: "두근거림이나 잠이 안 오는 증상이 걱정돼요", description: "복용 중 나타날 수 있는 불편과 의료진에게 알려야 할 내용을 살펴보세요." },
  { href: "/diet/다이어트한약-복용전-확인", title: "복용 전에 어떤 병력과 약을 알려야 하나요?", description: "첫 상담 전에 확인할 건강 상태와 복용 중인 약을 정리했습니다." },
  { href: "/diet/다이어트한약-요요", title: "약을 끊으면 다시 살이 찌나요?", description: "감량 이후 유지 단계와 식습관에 관한 안내를 읽어보세요." },
  { href: "/diet/다이어트한약-위고비-마운자로-비교", title: "위고비·마운자로와 같이 먹거나 바꿔도 되나요?", description: "병용·전환 전에 확인할 약 이름, 용량, 마지막 투여일과 증상을 정리했습니다." },
  { href: "/diet/다이어트한약-커피-술", title: "커피를 마시거나 술 약속이 있어도 괜찮나요?", description: "카페인과 음주, 복용 일정 변경 전에 상담할 내용을 확인하세요." },
] as const;
