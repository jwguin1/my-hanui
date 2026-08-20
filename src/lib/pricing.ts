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
  "전 항목 비급여이며 부가세 포함 금액입니다. 시술 범위는 진료 후 함께 정합니다.";

/** 110000 → "110,000원" */
export function won(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

/** 110000 → "110,000" (단위를 따로 붙이는 StatCard 용) */
export function wonDigits(amount: number): string {
  return amount.toLocaleString("ko-KR");
}

/** 진입 가격 = 가장 싼 행의 100개까지 금액 */
export const SPOT_ENTRY: SpotPriceRow = SPOT_PRICE_ROWS[0];

/** 100개 기준 개당 단가. 본문의 「개당 1,100원」이 여기서 나온다 */
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
  return [...set].sort((a, b) => a - b);
}
