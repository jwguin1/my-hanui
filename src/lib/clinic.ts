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
  },
  weekdayClose: "평일 20:00까지",

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
} as const;

/** 화면 표기용 진료시간 — 기계 값에서 파생시킨다. 직접 문자열을 쓰지 말 것. */
const range = (t: { opens: string; closes: string }) => `${t.opens} – ${t.closes}`;

/** 평일 전체 구간 — 오전 시작 ~ 오후 종료 */
export const CLINIC_HOURS_WEEKDAY = `${CLINIC.hours.weekdayMorning.opens} – ${CLINIC.hours.weekdayAfternoon.closes}`;
export const CLINIC_HOURS_WEEKEND = range(CLINIC.hours.weekend);
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
export const CLINIC_CTA_LINES: readonly string[] = [
  [CLINIC.name, CLINIC.building, CLINIC.transit].join(" · "),
  [CLINIC.weekdayClose, CLINIC.parking, CLINIC.tel].join(" · "),
];
