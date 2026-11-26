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

/** 원장이 확인한 최초 CO₂ 시술 후 남거나 다시 올라온 병변의 리터치 기준. */
export const SPOT_RETOUCH_POLICY = {
  afterWeeks: 4,
  withinMonths: 6,
  perLesion: 4900,
  unlimited: 55000,
} as const;

/** 읽기 쉬운 원화 표기: 88000 → "8만8천원", 14300 → "1만4천3백원". */
export function won(amount: number): string {
  return wonDigits(amount) + "원";
}

/** 통증 진료비는 원 단위 숫자로 표시한다. 한약·미용 가격은 기존 won 표기 유지. */
export function painWon(amount: number): string {
  if (!Number.isSafeInteger(amount) || amount < 0) throw new RangeError("금액은 0 이상의 정수여야 합니다.");
  return `${amount.toLocaleString("ko-KR")}원`;
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

/** 얼굴 전체 시술 가격 */
export const SPOT_ENTRY: SpotPriceRow = SPOT_PRICE_ROWS[0];

export const FLAT_WART_FACE_PRICES = [
  { name: "낱개 1개", price: 9900 },
  { name: "얼굴 100개 이하", price: SPOT_ENTRY.upTo100 },
  { name: "얼굴 전체 무제한", price: SPOT_ENTRY.unlimited },
] as const;

export const FLAT_WART_FACE_SUMMARY =
  `점·편평사마귀·검버섯은 같은 기본 제거비를 적용합니다. 낱개는 1개 ${painWon(FLAT_WART_FACE_PRICES[0].price)}입니다. 얼굴은 100개까지 ${painWon(SPOT_ENTRY.upTo100)}, 얼굴 전체 무제한은 ${painWon(SPOT_ENTRY.unlimited)}입니다.`;

export const EXTRA_REMOVAL_TARGETS = "3mm 이상 돌출점, 돌출된 쥐젖, 압출하는 비립종";
export const EXTRA_REMOVAL_PRICES = [
  { name: "1~4개 (개당)", price: 9900 },
  { name: "5~10개", price: 55000 },
  { name: "11~20개", price: 110000 },
  { name: "개수 무제한", price: 165000 },
] as const;

export const EXTRA_REMOVAL_SUMMARY = EXTRA_REMOVAL_PRICES.map(row => `${row.name} ${painWon(row.price)}`).join(", ");

export const LENTIGO_PRICES = [
  { name: "1cm 이하", price: 22000 },
  { name: "1cm 초과", price: 33000 },
] as const;

/** 편평사마귀 부위별 무제한 가격 (한 번의 시술 기준). */
export const FLAT_WART_PRICE_GROUPS = [
  { title: "목·몸통", rows: [
    { name: "목 전체", includes: "앞·뒤 포함", price: 165000 },
    { name: "윗가슴", includes: "쇄골 아래~가슴 위", price: 165000 }, { name: "복부", price: 440000 },
    { name: "등", price: 275000 }, { name: "허리", price: 275000 },
  ] },
  { title: "부위별 패키지", rows: [
    { name: "얼굴＋목 전체", price: 275000 }, { name: "윗가슴＋복부", price: 440000 },
    { name: "등＋허리", price: 440000 }, { name: "얼굴＋상반신 전체", includes: "얼굴·목·윗가슴·복부·등·허리 포함 · 팔 제외", price: 880000 },
  ] },
  { title: "팔", rows: [
    { name: "아래팔 한쪽", price: 165000 }, { name: "윗팔 한쪽", price: 165000 },
    { name: "팔 한쪽 전체", price: 275000 }, { name: "양쪽 팔 전체", price: 440000 },
  ] },
  { title: "다리", rows: [
    { name: "무릎 아래 한쪽", price: 165000 }, { name: "허벅지 한쪽", price: 165000 },
    { name: "다리 한쪽 전체", price: 275000 }, { name: "양쪽 다리 전체", price: 440000 },
  ] },
] as const;

type PigmentAreaGroup = {
  name: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  rows: { name: string; price: number }[];
};

export const PIGMENTATION_PRICE_GROUPS: PigmentAreaGroup[] = [
  { name: "얼굴·목", image: "face", width: 376, height: 344, alt: "얼굴과 목의 치료 범위", rows: [
    { name: "얼굴 전체", price: 88000 }, { name: "얼굴 전체＋목", price: 110000 },
  ] },
  { name: "겨드랑이·팔", image: "arm", width: 123, height: 548, alt: "겨드랑이, 윗팔, 아래팔 위치를 구분한 그림", rows: [
    { name: "겨드랑이", price: 55000 }, { name: "상완(윗팔)", price: 110000 },
    { name: "하완(아래팔)", price: 110000 }, { name: "팔 전체", price: 240000 },
  ] },
  { name: "사타구니·다리", image: "leg", width: 158, height: 567, alt: "사타구니, 허벅지, 종아리 위치를 구분한 그림", rows: [
    { name: "사타구니", price: 110000 }, { name: "허벅지", price: 198000 },
    { name: "종아리", price: 165000 }, { name: "다리 전체", price: 440000 },
  ] },
];
export const PIGMENTATION_AREA_PRICES = PIGMENTATION_PRICE_GROUPS.flatMap(group => group.rows);
export const PIGMENTATION_PACKAGE_NOTE = "색소·착색 치료 5회 패키지: 부위별 1회 가격의 5회 합계에서 10% 할인";
export const PIGMENTATION_COUPON_NOTE = "얼굴 전체 1회 44,000원 쿠폰 사용 시, 양쪽 1회 가격에서 44,000원을 차감합니다.";

/** 2026-11-12 원장 확인: 맞춤 치료와 단독 토닝관리를 구분한다. */
export const PIGMENTATION_PRICES = {
  name: "색소·홍조·재생치료",
  single: 88000,
  selection: "피부 상태와 치료 목표를 진단한 뒤 피코하이·엘리멘트 TL의 파장과 조사 방식을 맞춰 치료합니다.",
} as const;

export const TONING_SESSION = "1회 2,000샷";
export const TONING_PRICES = { genesis: 33000, pico: 33000 } as const;

/** 2026-10-24 원장 확인. 슈링크 3회 단독 구성은 종료. */
export const SHURINK_PRICES = { name: "슈링크 유니버스", single: 99000, shots600: 176000 } as const;
export const VOLNEWMER_PRICES = { name: "볼뉴머", single: 299000, shots600: 549000 } as const;
export const LIFTING_PACKAGE = { name: "슈링크 3회＋볼뉴머 1회", shots300: 539000, shots600: 969000 } as const;
export const HAIR_REMOVAL_PRICES = [
  { area: "인중＋앞턱", option: "기본", single: 17000, five: 74000, annual: 154000 },
  { area: "인중＋앞턱", option: "케어 포함", single: 22000, five: 99000, annual: 209000 },
  { area: "얼굴전체", option: "기본", single: 39000, five: 164000, annual: 294000 },
  { area: "얼굴전체", option: "케어 포함", single: 44000, five: 189000, annual: 349000 },
] as const;
export const SKIN_CARE_INCLUDED = "마취·비타민 쿨링팩·LED 포함";
export function skinPrice(amount: number): string { return `${amount / 10000}만원`; }

/** 2026-10-16 원장 확인: 일반 근골격계 진료·추나·초음파 유도 약침. */
export const PAIN_PRICES = {
  firstVisit: 14300, // 2026-10-20 원장 확인
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
  const set = new Set<number>([SPOT_RETOUCH_POLICY.perLesion, SPOT_RETOUCH_POLICY.unlimited]);
  for (const r of SPOT_PRICE_ROWS) {
    set.add(r.upTo100);
    set.add(r.unlimited);
    set.add(perSpot(r));
  }
  for (const p of AFTERCARE_PRODUCTS) set.add(p.price);
  for (const row of FLAT_WART_FACE_PRICES) set.add(row.price);
  for (const row of [...EXTRA_REMOVAL_PRICES, ...LENTIGO_PRICES]) set.add(row.price);
  for (const group of FLAT_WART_PRICE_GROUPS) for (const row of group.rows) set.add(row.price);
  for (const row of PIGMENTATION_AREA_PRICES) { set.add(row.price); set.add(row.price * 5 * 0.9); }
  for (const amount of [44000, TONING_PRICES.genesis, TONING_PRICES.pico, PIGMENTATION_PRICES.single, SHURINK_PRICES.single, SHURINK_PRICES.shots600, VOLNEWMER_PRICES.single, VOLNEWMER_PRICES.shots600, LIFTING_PACKAGE.shots300, LIFTING_PACKAGE.shots600]) set.add(amount);
  for (const row of HAIR_REMOVAL_PRICES) for (const amount of [row.single, row.five, row.annual]) set.add(amount);
  return [...set].sort((a, b) => a - b);
}

/** 일산감비환 공개 가격표 대조: 2026-10-16. */
export const DIET_PRICES = { yellow: 90000, pink: 110000, sachets: 100, consultationMinutes: 10 } as const;
