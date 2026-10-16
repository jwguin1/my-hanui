/**
 * 가격 정본 (single source of truth).
 *
 * 좌표·NAP·진료시간에서 정본이 갈려 문제가 났던 것과 같은 구조를 막는다.
 * 가격은 환자가 직접 보는 정보라 갈리면 그대로 신뢰 문제가 된다.
 *
 * 규칙
 *  - 금액을 새로 쓰는 곳은 여기 하나뿐이다. 페이지·블록은 전부 여기서 파생한다.
 *  - 마크다운 본문(content/skin/*.md)은 TS 를 import 할 수 없으므로 파생이 불가능하다.
 *    대신 scripts/validate-jsonld.mjs 의 「가격 일관성」 검사가 렌더된 HTML 을 훑어
 *    이 파일에 없는 금액이 나오면 FAIL 시킨다. 즉 정본은 여기, 강제는 검증기.
 *  - 이 파일은 `node --experimental-strip-types` 로도 읽힌다.
 *    `@/` 별칭 import 를 넣지 말 것 — 검증기가 깨진다 (schema.ts 에서 겪었다).
 */

export type SpotPriceRow = {
  /** 표기명. 검증기가 이 문자열로 본문의 금액을 찾아 대조하므로 임의로 바꾸지 말 것 */
  name: string;
  /** 100개까지 */
  upTo100: number;
  /** 개수 제한 없음 */
  unlimited: number;
};

/** 잡티 제거 (CO2 레이저) — 부위 단위 정찰제 */
export const SPOT_PRICE_ROWS: SpotPriceRow[] = [
  { name: "얼굴 전체", upTo100: 110000, unlimited: 165000 },
  { name: "얼굴 + 목 앞면", upTo100: 165000, unlimited: 220000 },
  { name: "얼굴 + 목 앞뒤", upTo100: 220000, unlimited: 275000 },
];

export type ProductPrice = { name: string; volume: string; price: number };

/** 시술 후 관리용 — 별도 구매 항목 */
export const AFTERCARE_PRODUCTS: ProductPrice[] = [
  { name: "EGF 재생크림", volume: "15ml", price: 16500 },
  { name: "EGF 재생크림", volume: "50ml", price: 30000 },
];

export const SPOT_PRICE_HEADERS: [string, string] = [
  "100개까지",
  "개수 제한 없음",
];

export const SPOT_PRICE_NOTE =
  "전 항목 비급여입니다. 시술 범위는 진료 후 함께 정합니다.";

/** 읽기 쉬운 원화 표기: 88000 → "8만8천원", 13400 → "1만3천4백원". */
export function won(amount: number): string {
  return wonDigits(amount) + "원";
}

/** 원 단위를 따로 붙이는 StatCard에서도 같은 금액 표기를 쓴다. */
export function wonDigits(amount: number): string {
  if (!Number.isSafeInteger(amount) || amount < 0) throw new RangeError("금액은 0 이상의 정수여야 합니다.");
  if (amount === 0) return "0";
  let remainder = amount;
  let label = "";
  for (const [unit, suffix] of [[10000, "만"], [1000, "천"], [100, "백"], [10, "십"], [1, ""]] as const) {
    const count = Math.floor(remainder / unit);
    if (count) label += `${count}${suffix}`;
    remainder %= unit;
  }
  return label;
}

/** 진입 가격 = 가장 싼 행의 100개까지 금액 */
export const SPOT_ENTRY: SpotPriceRow = SPOT_PRICE_ROWS[0];

/** 2026-10-16 원장 확인. 방문 시 피부 상태에 맞는 장비를 선택한다. */
export const PIGMENTATION_PRICES = {
  name: "피코 트리플 토닝",
  single: 88000,
  tenSessions: 660000,
  perSession: 66000,
} as const;

export const SHURINK_PRICES = { name: "슈링크 유니버스 300샷", single: 99000, threeSessions: 264000 } as const;

/** 2026-10-16 원장 확인: 일반 근골격계 진료·추나·초음파 유도 약침. */
export const PAIN_PRICES = {
  firstVisit: 13400,
  simpleChuna: 28400,
  complexChuna: 50800,
  dextrose: 30000,
  pdrn: 60000,
} as const;

export const PAIN_INSURANCE_NOTE = "건강보험 적용 후 본인부담금입니다. 추나 금액에는 기본 진료비가 포함되어 있습니다.";
export const PHARMACOPUNCTURE_NOTE = "1회 비급여 비용이며, 보험 진료비는 별도로 추가됩니다.";

/** 건강보험 한약은 안내받은 범위 그대로 표시한다. */
export const HERBAL_PRICES = {
  insuredTenDays: "4만원대",
  oneMonth: 390000,
  twoMonths: 690000,
  threeMonths: 990000,
} as const;

// 원장 확인 및 한국한의약진흥원 2단계 시범사업 안내(2026-10-16 대조).
export const HERBAL_INSURANCE_CONDITIONS = [
  "기능성 소화불량", "요추추간판탈출증", "알레르기 비염",
  "월경통", "안면신경마비", "뇌혈관질환 후유증",
] as const;
export const HERBAL_INSURANCE_LIMIT = "1인당 연간 2개 질환에 대해, 질환별 10일씩 2회(총 20일)까지 적용됩니다.";

/** 100개 기준 개당 단가. 본문의 「개당 1천1백원」이 여기서 나온다 */
export function perSpot(row: SpotPriceRow): number {
  return Math.round(row.upTo100 / 100);
}

/**
 * 이 카테고리에서 등장해도 되는 금액 전부.
 * 검증기가 화이트리스트로 쓴다 — 여기 없는 금액이 skin 페이지에 보이면 FAIL.
 */
export function allowedSkinAmounts(): number[] {
  const set = new Set<number>();
  for (const r of SPOT_PRICE_ROWS) {
    set.add(r.upTo100);
    set.add(r.unlimited);
    set.add(perSpot(r));
  }
  for (const p of AFTERCARE_PRODUCTS) set.add(p.price);
  for (const amount of [PIGMENTATION_PRICES.single, PIGMENTATION_PRICES.tenSessions, PIGMENTATION_PRICES.perSession, SHURINK_PRICES.single, SHURINK_PRICES.threeSessions]) set.add(amount);
  return [...set].sort((a, b) => a - b);
}
