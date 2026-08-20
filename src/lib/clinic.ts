/**
 * 한의원 기본 정보의 단일 소스.
 *
 * ## 왜 필요한가
 *
 * 전화번호·주소·교통·주차·진료시간이 지금 최소 7개 파일에 하드코딩돼 있다
 * (page / about / contact / accident / autonomic·care / Footer / layout).
 * 전화번호 하나가 바뀌면 일곱 군데를 찾아 고쳐야 하고, 한 곳을 놓치면
 * **사이트 안에서 서로 다른 정보가 동시에 노출된다.** AI 는 그런 사이트의
 * 사실 정보를 신뢰하지 않는다.
 *
 * 이 모듈은 글 하단 전환 블록(ClinicCta)이 쓰는 값부터 모은다.
 * 기존 페이지들의 하드코딩은 이번 범위가 아니다 — 별건으로 옮긴다.
 *
 * 이 파일은 **어떤 모듈도 import 하지 않는다.** 서버·클라이언트 어디서나
 * 안전하게 쓸 수 있어야 하고, lib/schema.ts 가 이 값을 가져다 쓸 수도 있다.
 */

export const CLINIC = {
  name: "일산한의원",
  /** 건물·층 — 「이마트 풍산점 3층」이 사실상 랜드마크다 */
  building: "이마트 풍산점 3층",
  /** 전화번호. 화면 표기용 (tel: 링크는 telHref 를 쓴다) */
  tel: "031-976-7706",
  telHref: "tel:031-976-7706",
  /** 대중교통 — 도보 시간까지 포함해야 내원 결정에 쓰인다 */
  transit: "경의중앙선 풍산역 2번 출구 도보 1분",
  /** 주차 */
  parking: "이마트 주차 3시간 무료",
  /** 평일 진료 마감 — 야간진료가 선택 이유가 되므로 따로 둔다 */
  weekdayClose: "평일 20:00까지",
} as const;

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
