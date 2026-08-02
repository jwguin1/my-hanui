/**
 * 네이버 하위링크 카드(캐러셀) 후보 6개의 단일 소스.
 *
 * 네이버는 카드 라벨을 앵커 텍스트에서 뽑기도 하고 <title> 에서 뽑기도 한다.
 * 어느 쪽을 고르든 같은 말이 나오도록 title / 네비 앵커 / 푸터 앵커를
 * 여기 한 곳에서 정의하고, 각 소비처가 이 객체를 읽어 쓴다.
 *
 * 카드 썸네일은 og:image 가 아니라 "본문 최상단의 페이지 내 최대 이미지"에서
 * 나온다 → hero 필드가 그 이미지다. 실제 삽입은 components/PageHeroBanner.tsx.
 *
 * 배너 파일 생성: npm run banners (scripts/generate-hero-banners.mjs)
 */

export interface CarouselTarget {
  /** 사이트 루트 기준 경로 */
  path: string;
  /**
   * <title> 의 앞부분. 루트 layout 의 template 이 " | 일산한의원" 을 붙인다.
   * 기존 title 의 첫 단어를 반드시 유지한다 — 검색 1위를 만든 문구를
   * 교체하는 게 아니라 설명만 삽입하는 것이다.
   */
  title: string;
  /**
   * 전역 네비게이션 앵커. 드롭다운 폭 제약이 있어 짧게 쓰되,
   * title 의 첫 마디와 같은 말로 시작한다.
   */
  navLabel: string;
  /** 1080x1080 본문 최상단 대표이미지 */
  hero: { src: string; alt: string };
}

export const CAROUSEL_TARGETS = {
  pain: {
    path: "/pain",
    title: "통증 · 근골격 – 추나, 초음파약침",
    navLabel: "통증 · 근골격",
    hero: {
      src: "/images/hero/pain-hero.jpg",
      alt: "일산한의원 통증·근골격 – 추나, 초음파 유도 약침",
    },
  },
  diet: {
    path: "/diet",
    title: "다이어트 – 일산감비환 한방 체질 처방",
    navLabel: "한방 다이어트",
    hero: {
      src: "/images/hero/diet-hero.jpg",
      alt: "일산한의원 한방 다이어트 – 일산감비환, 체질 처방",
    },
  },
  skin: {
    path: "/skin",
    // 슈링크(HIFU)는 실제 진료 항목이 아니라 문구에 넣지 않는다.
    title: "피부 · 레이저 – CO₂, 점·편평사마귀",
    navLabel: "피부 · 레이저",
    hero: {
      src: "/images/hero/skin-hero.jpg",
      alt: "일산한의원 피부·레이저 – CO₂ 레이저, 점·편평사마귀",
    },
  },
  doctor: {
    path: "/doctor",
    title: "의료진 – 한의사 6인 협진",
    navLabel: "의료진",
    hero: {
      src: "/images/hero/doctor-hero.jpg",
      alt: "일산한의원 의료진 – 한의사 6인 협진",
    },
  },
  about: {
    path: "/about",
    title: "병원 소개 – 이마트 풍산점 3층",
    navLabel: "병원 소개",
    hero: {
      src: "/images/hero/about-hero.jpg",
      alt: "일산한의원 병원 소개 – 이마트 풍산점 3층",
    },
  },
  contact: {
    path: "/contact",
    title: "오시는 길 – 경의중앙선 풍산역 2번출구",
    navLabel: "오시는 길",
    hero: {
      src: "/images/hero/contact-hero.jpg",
      alt: "일산한의원 오시는 길 – 경의중앙선 풍산역 2번출구",
    },
  },
} as const satisfies Record<string, CarouselTarget>;

export type CarouselTargetKey = keyof typeof CAROUSEL_TARGETS;

/** 홈 "둘러보기" 섹션 / 푸터 사이트맵 / 검증 스크립트의 순회 순서 */
export const CAROUSEL_ORDER = [
  "pain",
  "diet",
  "skin",
  "doctor",
  "about",
  "contact",
] as const satisfies readonly CarouselTargetKey[];
