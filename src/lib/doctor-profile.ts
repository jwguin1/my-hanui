export const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;

// 원내 정규 진료표. 명절이나 임시 변경일의 근무자를 이 표로 추정하지 않는다.
export const DOCTOR_WORKDAYS = {
  박건희: ["월", "화", "토", "일"],
  강민석: ["화", "수", "목", "금", "토"],
  남태훈: ["월", "화", "목", "일"],
  박동석: ["월", "수", "목", "금", "토"],
  장경진: ["월", "수", "금"],
  이명주: ["수", "목", "금", "토", "일"],
  오서혜: ["월", "화", "목", "일"],
} as const satisfies Record<string, readonly (typeof WEEKDAYS)[number][]>;

export interface Credential {
  abbr: string;
  name: string;
  issuer: string;
  issuerFull: string;
}

export interface Doctor {
  name: keyof typeof DOCTOR_WORKDAYS;
  image: string;
  school: string;
  introduction: string;
  careLinks: { href: string; label: string }[];
  specialty?: string;
  education?: string[];
  career?: string[];
  credentials: Credential[];
  laserCertification?: string;
  societies: string[];
  bio: string[];
}

export const SHOULDER_LECTURE = {
  title: "안 낫는 어깨 통증의 포인트",
  report: "한의영상학회, 임상 맞춤형 영상 진단 및 초음파 중재술 공유",
  href: "https://www.mjmedi.com/news/articleView.html?idxno=61769",
  publisher: "민족의학신문",
  published: "2025-12-09",
  description: "장경진 원장이 2025년 12월 7일 대한한의영상학회·대한희귀난치질환학회 연합 학술대회에서 팔을 움직일 수 있는 범위에 따라 어깨 앞쪽의 근육과 인대 중 어느 부위를 살피는지 설명했습니다.",
  careHref: "/pain/팔이-안올라감-오십견-회전근개",
} as const;

// 대한한방내과학회지 원문의 저자 순서와 당시 동서한방병원 소속을 대조한 논문.
export const INTERNAL_MEDICINE_PAPERS = [
  {
    title: "양성 돌발성 두위 현훈에 대한 반하백출천마탕의 효과: 체계적 문헌고찰 — CNKI 검색을 중심으로",
    credit: "공동저자",
    authors: ["권기현", "오서혜", "박은수", "김미현", "홍승효", "송금주", "박은영"],
    citation: "대한한방내과학회지. 2021;42(4):572–589.",
    href: "https://www.jikm.or.kr/journal/view.php?doi=10.22246/jikm.2021.42.4.572",
    description: "이석증 환자에게 반하백출천마탕을 사용한 중국 임상시험을 모아 살펴본 체계적 문헌고찰입니다.",
  },
  {
    title: "요추천자 후 발생한 두통 치험 1례",
    credit: "제1저자",
    authors: ["오서혜", "박은수", "김원영", "김동영", "박은영"],
    citation: "대한한방내과학회지. 2022;43(2):115–121.",
    href: "https://www.jikm.or.kr/journal/view.php?doi=10.22246/jikm.2022.43.2.115",
    description: "요추천자 후 두통이 생긴 환자 한 명의 치료와 경과를 기록한 증례보고입니다.",
  },
] as const;
