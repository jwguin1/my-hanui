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

  /* ── 진료시간 ── 한 곳에서만 정의한다 */
  weekdayClose: "평일 20:00까지",
  hoursWeekday: "10:00 – 20:00",
  hoursWeekend: "10:00 – 16:00",
  hoursLunch: "13:00 – 14:00",
  closedNote: "매달 2·4번째 수요일 휴무 (이마트 풍산점 휴업일)",

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
