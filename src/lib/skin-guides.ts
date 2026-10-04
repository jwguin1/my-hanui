/** 피부 진료 안내와 관련 글의 표시 순서. 제목·요약은 실제 글에서 읽는다. */
export const PIGMENTATION_PATH = "/skin/pigmentation";
export const PIGMENTATION_UPDATED = "2026-10-04";
export const LIFTING_PATH = "/skin/lifting";
export const LIFTING_UPDATED = "2026-10-04";
export const LIFTING_SLUGS: readonly string[] = [
  "슈링크-시간-횟수-주기",
  "슈링크-효과-볼살-턱선",
  "슈링크-피코토닝-제네시스-차이",
];
export const SHURINK_CARE = {
  intervalWeeks: 12,
  totalMinutes: 30,
  steps: [
    { title: "마취", minutes: 10, body: "시술 부위를 확인하고 마취를 진행합니다." },
    { title: "슈링크 유니버스 300샷", minutes: 10, body: "피부 상태와 고민 부위에 맞춰 초음파를 조사합니다." },
    { title: "LED·진정 마스크팩", minutes: 10, body: "시술 후 피부를 진정시키고 관리 방법을 안내합니다." },
  ],
} as const;

export const PIGMENTATION_GROUPS = [
  { id: "pigment", name: "기미·잡티·흑자", slugs: ["피코토닝-효과-횟수", "흑자제거-피코레이저", "기미-주근깨-흑자-차이", "기미레이저-재발-관리"] },
  { id: "genesis", name: "제네시스·피부결·홍조", slugs: ["제네시스토닝-효과", "피코토닝-제네시스-차이", "피코토닝-피부톤-미백", "제네시스-피부장벽-민감피부"] },
  { id: "cost-care", name: "비용·시술 후 관리", slugs: ["피코토닝-가격-제네시스", "토닝후-색소침착-딱지"] },
] as const;

export const PIGMENTATION_SLUGS: readonly string[] = PIGMENTATION_GROUPS.flatMap((g) => [...g.slugs]);
export const SKIN_GUIDE_SLUGS: readonly string[] = [...PIGMENTATION_SLUGS, ...LIFTING_SLUGS];

export const SKIN_RELATED: Record<string, readonly string[]> = {
  "피코토닝-효과-횟수": ["피코토닝-가격-제네시스", "기미레이저-재발-관리", "흑자제거-피코레이저"],
  "흑자제거-피코레이저": ["기미-주근깨-흑자-차이", "피코토닝-가격-제네시스", "쥐젖-사마귀-검버섯-구분"],
  "기미-주근깨-흑자-차이": ["흑자제거-피코레이저", "피코토닝-효과-횟수", "쥐젖-사마귀-검버섯-구분"],
  "기미레이저-재발-관리": ["피코토닝-효과-횟수", "토닝후-색소침착-딱지", "피코토닝-제네시스-차이"],
  "제네시스토닝-효과": ["피코토닝-제네시스-차이", "제네시스-피부장벽-민감피부", "슈링크-피코토닝-제네시스-차이"],
  "피코토닝-가격-제네시스": ["피코토닝-효과-횟수", "피코토닝-제네시스-차이", "잡티제거-개수와-비용"],
  "피코토닝-제네시스-차이": ["제네시스토닝-효과", "피코토닝-효과-횟수", "피코토닝-가격-제네시스"],
  "피코토닝-피부톤-미백": ["기미-주근깨-흑자-차이", "피코토닝-제네시스-차이", "토닝후-색소침착-딱지"],
  "제네시스-피부장벽-민감피부": ["제네시스토닝-효과", "토닝후-색소침착-딱지", "피코토닝-제네시스-차이"],
  "토닝후-색소침착-딱지": ["기미레이저-재발-관리", "제네시스-피부장벽-민감피부", "점뺀후-딱지-선크림"],
  "쥐젖-사마귀-검버섯-구분": ["기미-주근깨-흑자-차이", "흑자제거-피코레이저", "잡티제거-개수와-비용"],
  "잡티제거-개수와-비용": ["피코토닝-가격-제네시스", "쥐젖-사마귀-검버섯-구분", "점뺀후-딱지-선크림"],
  "점뺀후-딱지-선크림": ["토닝후-색소침착-딱지", "기미레이저-재발-관리", "잡티제거-개수와-비용"],
  "슈링크-시간-횟수-주기": ["슈링크-효과-볼살-턱선", "슈링크-피코토닝-제네시스-차이", "피코토닝-가격-제네시스"],
  "슈링크-효과-볼살-턱선": ["슈링크-시간-횟수-주기", "슈링크-피코토닝-제네시스-차이", "제네시스토닝-효과"],
  "슈링크-피코토닝-제네시스-차이": ["슈링크-효과-볼살-턱선", "피코토닝-제네시스-차이", "피코토닝-가격-제네시스"],
};

export function skinPostHub(slug: string) {
  if (LIFTING_SLUGS.includes(slug)) return { href: LIFTING_PATH, label: "리프팅 · 슈링크 유니버스 안내" };
  return PIGMENTATION_SLUGS.includes(slug)
    ? { href: PIGMENTATION_PATH, label: "색소치료 · 피코토닝·제네시스 안내" }
    : { href: "/skin/spot", label: "잡티 제거 · 점·편평사마귀·쥐젖 안내" };
}
