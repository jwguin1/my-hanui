/**
 * 한의원 기본 정보(NAP)의 단일 소스.
 *
 * ## 왜 필요한가
 *
 * 전화번호·주소·교통·주차·진료시간이 최소 8개 파일에 하드코딩돼 있었고,
 * 실제로 **표기가 갈려 있었다**:
 *
 *   주소   「경기 고양시」(4곳) vs 「경기도 고양시」(llms.txt)
 *   주차   「무료주차 3시간」 / 「3시간 무료주차」 / 「주차 3시간 무료」
 *   시간   「평일 20시까지」 / 「10:00-20:00」 / 「10:00 – 20:00」(en dash)
 *
 * NAP(Name·Address·Phone) 일관성은 지역 검색의 직접 신호다.
 * 페이지마다 표기가 다르면 AI 는 「일산에서 어디 가야 해」에 답할 때
 * 이 병원을 확신 있게 내놓지 못한다.
 *
 * ## 정본 기준
 *
 * **네이버 플레이스 등록 정보를 정본으로 삼는다.** (2026-08-20 대조)
 *   도로명 「경기도 고양시 일산동구 무궁화로 237 3층」
 *   지번   「경기도 고양시 일산동구 중산동 1809 3층」
 *   좌표   37.6738501 / 126.7871254
 *
 * 사이트 안에서만 맞추면 반쪽이다 — 외부 등록 정보와 어긋나면
 * 같은 병원이 두 곳으로 읽힌다.
 *
 * 이 파일은 **어떤 모듈도 import 하지 않는다.** 서버·클라이언트 어디서나
 * 안전해야 하고 lib/schema.ts 가 이 값을 가져다 쓴다.
 */

export const CLINIC = {
  name: "일산한의원",
  alternateName: "일산한의원 이마트풍산점",
  /** 건물·층 — 「이마트 풍산점 3층」이 사실상 랜드마크다 */
  building: "이마트 풍산점 3층",

  /* ── 주소 ── 네이버 플레이스 표기와 한 글자도 다르지 않게 유지한다 */
  addressRegion: "경기도",
  addressLocality: "고양시 일산동구",
  streetAddress: "무궁화로 237",
  postalCode: "10311",

  /* ── 전화 ── */
  /** 화면 표기용 */
  tel: "031-976-7706",
  /** <a href> 용 */
  telHref: "tel:031-976-7706",
  /** JSON-LD 용 국제 표기 */
  telIntl: "+82-31-976-7706",

  /* ── 접근 ── */
  transit: "경의중앙선 풍산역 2번 출구 도보 1분",
  parking: "이마트 주차 3시간 무료",
  /** 주차 가능 층 — 안내가 필요한 페이지에서만 쓴다 */
  parkingDetail: "이마트 4·5·6·7층 주차장 · 3시간 무료",

  /* ── 진료시간 ──
     기계가 읽는 값(HH:MM)만 정의하고 화면 문자열은 아래에서 파생시킨다.
     화면과 JSON-LD 를 따로 적으면 언젠가 갈린다 —
     「지금 진료하나요」류 질의에 직접 쓰이는 값이라 갈리면 틀린 답이 나간다. */
  hours: {
    /* days 는 schema.org 표준 요일 문자열이다. JSON-LD 의 dayOfWeek 가 여기서 파생된다 —
       시각만 정본으로 두고 요일을 schema.ts 에 손으로 적어 두면 요일 쪽만 조용히 갈린다.
       실제로 값 검증에 시각만 있고 요일이 빠져 있었다 (좌표가 144일 살아남은 것과 같은 구조). */
    /* 평일은 점심을 기준으로 **두 구간**이다. 이어 붙여 10:00~20:00 하나로만 적으면
       JSON-LD 상 13시에도 진료중이 되어 「지금 하나요」에 틀린 답이 나간다. */
    weekdayMorning: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "13:00",
    },
    weekdayAfternoon: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "14:00",
      closes: "20:00",
    },
    /* 주말은 점심시간 없이 이어서 본다 */
    weekend: { days: ["Saturday", "Sunday"], opens: "10:00", closes: "16:00" },
    /* 공휴일도 주말과 같다. 요일이 아니라 **날짜**로 정해지므로 days 가 없고,
       schema.org 의 dayOfWeek 로는 표현되지 않는다 (PublicHolidays 는 표준이 아니다).
       JSON-LD 반영은 별건 — 권고안 승인 전까지 넣지 않는다. */
    holiday: { opens: "10:00", closes: "16:00" },
    /* 휴무일 표기. JSON-LD 에서 「그날은 열지 않는다」를 나타내는 표준 방식이
       opens 와 closes 를 같은 값으로 두는 것이다. 화면에는 쓰지 않는다. */
    closed: { opens: "00:00", closes: "00:00" },
  },
  weekdayClose: "평일 20:00까지",

  /**
   * 명절 휴진 안내. 「토·일·공휴일 16:00까지」만으로는 설·추석 당일 휴무가
   * 드러나지 않는다 — 공휴일이라 여는 줄 알고 오시게 된다.
   * 화면과 llms.txt 가 이 문장을 그대로 쓴다.
   */
  holidayClosedNote: "설날·추석 당일은 휴진합니다.",

  /**
   * 이마트 풍산점 의무휴업일 안내.
   *
   * **「휴진」이라고 단정하지 않는다.** 조례가 자주 바뀌고 실제로는 대부분 문을 연다.
   * 닫는다고 못 박으면 **열려 있는 날 환자를 잃는다** — 방향이 잘못된 손실이다.
   * 같은 이유로 JSON-LD 에는 이 예외를 넣지 않는다 (정상 요일 패턴만 유지).
   */
  closedNote:
    "매달 2·4번째 수요일은 이마트 풍산점 휴업일에 따라 진료가 조정될 수 있습니다. 방문 전 확인 부탁드립니다.",

  /**
   * 확정된 휴진일 (YYYY-MM-DD). **원장이 확실한 날짜만 적는다.**
   *
   * 비어 있어도 된다 — 비어 있으면 2·4 수요일에도 정상 진료로 계산하고
   * 상태 뱃지에 「확인」만 덧붙인다. 규칙으로 자동 휴진 판정을 하지 않는 이유는
   * 위 closedNote 와 같다.
   */
  closedDates: [] as readonly string[],

  /**
   * 관공서 공휴일 (YYYY-MM-DD, KST).
   *
   * `open: true`  — 평일이어도 주말과 같은 10:00~16:00, 점심시간 없이 본다
   * `open: false` — 휴진. **설날 당일과 추석 당일 두 날뿐이다.**
   *                 연휴 전날·다음날은 정상 진료한다.
   *
   * 이 구분이 화면·llms.txt·상태 뱃지·JSON-LD 네 곳의 유일한 출처다.
   * 「공휴일 = 여는 날」로만 두면 명절 당일에 헛걸음하게 만든다 —
   * 요일로만 판정해 공휴일에 20:00 까지로 안내하던 것과 같은 유형의 사고다.
   *
   * 왜 정적 표인가
   *  - 설날·추석·부처님오신날은 음력이라 규칙으로 계산할 수 없다.
   *  - 대체공휴일과 선거일은 그해 상황에 따라 정해진다.
   *  - 외부 라이브러리나 런타임 API 를 쓰면 의존성이 늘고, 뱃지는 클라이언트
   *    컴포넌트라 네트워크 호출이 더 나쁘다.
   *  → 확인된 날짜만 적고, 표가 떨어지기 전에 **검증기가 FAIL 로 알린다.**
   *
   * 넣지 않은 것
   *  - 근로자의 날(5/1) — 「근로자의 날 제정에 관한 법률」상 유급휴일이지
   *    관공서 공휴일이 아니다. 평일 20:00 까지로 계산된다.
   *
   * 제헌절(7/17)은 **공휴일이다.** 2008년에 빠졌다가 2026-05-11 시행으로
   * 18년 만에 재지정됐다 (공휴일에 관한 법률 개정 + 관공서의 공휴일에 관한
   * 규정 개정). 대체공휴일 적용 대상에도 포함됐다.
   * 처음에 「2008년부터 제외」로 잘못 적어 2026-07-17 이 빠져 있었다.
   *
   * 2026년분만 싣는다. 2027년분은 확인 후 추가한다 — 틀린 날짜를 넣으면
   * 여는 날 시간이 어긋나 그대로 환자를 돌려보낸다.
   */
  holidays: [
    { date: "2026-01-01", name: "신정", open: true },
    { date: "2026-02-16", name: "설날 연휴", open: true },
    { date: "2026-02-17", name: "설날", open: false },
    { date: "2026-02-18", name: "설날 연휴", open: true },
    { date: "2026-03-01", name: "삼일절", open: true },
    { date: "2026-03-02", name: "삼일절 대체공휴일", open: true },
    { date: "2026-05-05", name: "어린이날", open: true },
    { date: "2026-05-24", name: "부처님오신날", open: true },
    { date: "2026-05-25", name: "부처님오신날 대체공휴일", open: true },
    { date: "2026-06-03", name: "제9회 전국동시지방선거", open: true },
    { date: "2026-06-06", name: "현충일", open: true },
    { date: "2026-07-17", name: "제헌절", open: true },
    { date: "2026-08-15", name: "광복절", open: true },
    { date: "2026-08-17", name: "광복절 대체공휴일", open: true },
    { date: "2026-09-24", name: "추석 연휴", open: true },
    { date: "2026-09-25", name: "추석", open: false },
    { date: "2026-09-26", name: "추석 연휴", open: true },
    { date: "2026-10-03", name: "개천절", open: true },
    { date: "2026-10-05", name: "개천절 대체공휴일", open: true },
    { date: "2026-10-09", name: "한글날", open: true },
    { date: "2026-12-25", name: "성탄절", open: true },
  ] as readonly { date: string; name: string; open: boolean }[],

  /**
   * 진료 권역 — JSON-LD areaServed 의 정본.
   *
   * **실재하는 행정구역명만 쓴다.** 이전에 「파주시 운정」이라는 시(市)+지구
   * 결합 문자열을 넣었는데, 그런 행정구역명은 없어서 장소 엔티티로 매칭되지 않는다.
   * 2026-08-20 측정에서 파주 운정 질의만 ChatGPT·Gemini **양쪽 공통 X** 였다.
   */
  areaServed: [
    { type: "City", name: "고양시" },
    { type: "AdministrativeArea", name: "일산동구" },
    { type: "AdministrativeArea", name: "일산서구" },
    { type: "AdministrativeArea", name: "덕양구" },
    { type: "City", name: "파주시" },
    { type: "AdministrativeArea", name: "운정신도시" },
    { type: "AdministrativeArea", name: "교하동" },
  ] as ReadonlyArray<{ type: "City" | "AdministrativeArea"; name: string }>,

  /**
   * 좌표 (WGS84).
   *
   * 이전 값 37.7636 / 126.7735 는 **실제 위치에서 약 10km 벗어나 있었다.**
   * MedicalClinic.geo 는 「가까운 한의원」류 질의에 직접 쓰이는 값이라
   * 틀리면 지역 검색에서 조용히 손해를 본다.
   * 네이버 플레이스 등록 좌표로 교정했다 (풍산역 위치와도 일치).
   */
  geo: { latitude: 37.6738501, longitude: 126.7871254 },

  /**
   * 개원 연도. 화면의 「2023년 개원 이래 누적 …」과 JSON-LD foundingDate 가
   * 여기서 같이 나온다. 진료시간 요일·실적 산출 근거·좌표에서 화면과 스키마가
   * 갈려 문제가 됐다 — 같은 값은 한 곳에 두고 양쪽이 파생한다.
   */
  foundingYear: 2023,

  /**
   * 초음파 장비. 정식 명칭은 라벨 실물 기준이다.
   *
   * detail 문안은 원장 확정본이다. 「고사양」·「프리미엄」·「최상위」·「최고급」은
   * 쓰지 않는다 — 제조사 마케팅 문구이고, 우리가 인용하면 최상급 표현이 된다.
   * 「대학병원급」을 걷어낸 것과 같은 이유다. 검증기가 금지어로 막는다.
   */
  ultrasound: {
    name: "GE LOGIQ Totus",
    count: 3,
    detail:
      "GE LOGIQ Totus — LOGIQ E10 시리즈의 씨사운드 이미지포머(cSound Imageformer) 기술을 적용한 범용 초음파 진단기기입니다.",
  },
} as const;

/** 화면 표기용 진료시간 — 기계 값에서 파생시킨다. 직접 문자열을 쓰지 말 것. */
const range = (t: { opens: string; closes: string }) => `${t.opens} – ${t.closes}`;

/** 평일 전체 구간 — 오전 시작 ~ 오후 종료 */
export const CLINIC_HOURS_WEEKDAY = `${CLINIC.hours.weekdayMorning.opens} – ${CLINIC.hours.weekdayAfternoon.closes}`;
export const CLINIC_HOURS_WEEKEND = range(CLINIC.hours.weekend);
export const CLINIC_HOURS_HOLIDAY = range(CLINIC.hours.holiday);

/** 「토·일·공휴일」 — 같은 시간대를 쓰는 날들의 표기. 문자열을 직접 쓰지 말 것 */
export const CLINIC_WEEKEND_HOLIDAY_LABEL = "토·일·공휴일";

/** 「토·일·공휴일 16:00까지」 */
export const CLINIC_WEEKEND_HOLIDAY_CLOSE =
  `${CLINIC_WEEKEND_HOLIDAY_LABEL} ${CLINIC.hours.weekend.closes}까지`;

export type ClinicHoliday = { date: string; name: string; open: boolean };

/** 그날의 공휴일 항목. 공휴일이 아니면 undefined */
export function holidayFor(isoDate: string): ClinicHoliday | undefined {
  return CLINIC.holidays.find((h) => h.date === isoDate);
}

/** 관공서 공휴일인가 (여는 날·휴진일 모두 포함) */
export function isPublicHoliday(isoDate: string): boolean {
  return holidayFor(isoDate) !== undefined;
}

/** 그날 휴진인가 — 설날 당일·추석 당일 */
export function isClinicClosedDay(isoDate: string): boolean {
  return holidayFor(isoDate)?.open === false;
}

/** 휴진으로 지정된 공휴일 목록 */
export const CLINIC_CLOSED_HOLIDAYS: readonly ClinicHoliday[] =
  CLINIC.holidays.filter((h) => !h.open);

/** 표에 실린 마지막 공휴일. 검증기가 이 날짜로 갱신 시점을 재촉한다 */
export const CLINIC_HOLIDAY_TABLE_END =
  [...CLINIC.holidays].map((h) => h.date).sort().at(-1) ?? "";
/** 점심 = 두 평일 구간 **사이의 빈 시간**. 따로 적지 않고 파생시킨다 */
export const CLINIC_HOURS_LUNCH = `${CLINIC.hours.weekdayMorning.closes} – ${CLINIC.hours.weekdayAfternoon.opens}`;

/** 한 줄 주소 — 「경기도 고양시 일산동구 무궁화로 237, 이마트 풍산점 3층」 */
export const CLINIC_ADDRESS_FULL =
  `${CLINIC.addressRegion} ${CLINIC.addressLocality} ${CLINIC.streetAddress}, ${CLINIC.building}`;

/** 시·구까지 — 「경기도 고양시 일산동구」 */
export const CLINIC_ADDRESS_CITY =
  `${CLINIC.addressRegion} ${CLINIC.addressLocality}`;

/** 도로명 + 번지까지 (건물명 제외) */
export const CLINIC_ADDRESS_STREET =
  `${CLINIC.addressRegion} ${CLINIC.addressLocality} ${CLINIC.streetAddress}`;

/**
 * 글 하단 전환 블록에 찍는 두 줄.
 *
 * 순서를 바꾸지 말 것 — 첫 줄은 "어디인가", 둘째 줄은 "언제·어떻게 가는가"다.
 * 환자가 글을 다 읽고 판단하는 순서와 같다.
 */
/** 화면 문구 접두사 — 「2023년 개원 이래」 */
export const CLINIC_FOUNDING_PREFIX = `${CLINIC.foundingYear}년 개원 이래`;

export const CLINIC_CTA_LINES: readonly string[] = [
  [CLINIC.name, CLINIC.building, CLINIC.transit].join(" · "),
  /* 주말 마감을 함께 적는다. 「주말에 하는 한의원」은 실제 검색 유형이고
     (측정 문항 21·22), 평일만 적으면 주말 진료를 아예 안 하는 것으로 읽힌다.
     원장이 직접 쓴 글 하단 문구에도 토·일 시간이 들어 있었다. */
  [
    CLINIC.weekdayClose,
    CLINIC_WEEKEND_HOLIDAY_CLOSE,
    CLINIC.parking,
    CLINIC.tel,
  ].join(" · "),
];
