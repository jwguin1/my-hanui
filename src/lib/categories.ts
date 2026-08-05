import type { Metadata } from "next";
import type { Category } from "@/lib/blog-local";
import { CAROUSEL_TARGETS } from "@/lib/carousel-targets";

// blog-local 의 Category 는 type-only import 이므로 이 모듈은 fs 의존성이 없다.
// (서버/클라이언트 어디서나 안전하게 import 가능)

export const SITE_URL = "https://www.ilsanhan.com";

export interface CategoryMeta {
  /** 짧은 라벨 (네비/타이틀용) */
  label: string;
  /** 분과 풀네임 (카드/구조화데이터 name 용) */
  fullLabel: string;
  /** 메타 description / OG description */
  description: string;
  /** 1200x630 카테고리 대표 OG 이미지 경로 (public/ 기준 절대경로). */
  ogImage: string;
}

// 키 순서 = 홈 "진료 범위" 섹션 / ItemList position 순서 (pain → autonomic → diet → skin)
export const CATEGORY_META: Record<Category, CategoryMeta> = {
  pain: {
    label: "통증",
    fullLabel: "통증 · 근골격계",
    description:
      "근골격계 통증, 신경포착증후군, 초음파 유도 치료 등 일산한의원의 통증·근골격계 의학정보입니다.",
    ogImage: "/images/pain-og.jpg",
  },
  autonomic: {
    label: "자율신경",
    fullLabel: "자율신경 · 내과",
    description:
      "자율신경실조증, 이명, 두통, 불면, 기능성소화불량 등 일산한의원의 자율신경·내과 건강정보입니다.",
    ogImage: "/images/autonomic-og.jpg",
  },
  diet: {
    label: "다이어트",
    fullLabel: "한방비만 · 다이어트",
    description:
      "한방비만치료, 체중감량, 대사증후군 관리. 누적 9,000건 처방, 일산한의원 다이어트 정보입니다.",
    ogImage: "/images/diet-og.jpg",
  },
  skin: {
    label: "피부",
    fullLabel: "피부 · 미용레이저",
    description:
      "피부레이저, 아토피, 피부염, 피부재생 등 일산한의원의 피부·미용레이저 정보입니다.",
    ogImage: "/images/skin-og.jpg",
  },
};

// 의료진(/doctor)은 카테고리 글 시스템(blog-local CATEGORIES)과 무관하므로
// CATEGORY_META 에 넣지 않고 별도 상수로 분리한다.
export const DOCTOR_META = {
  slug: "doctor",
  label: "의료진",
  fullLabel: "6인 한의사 협진 의료진",
  description:
    "6인 한의사 협진 — 장경진·남태훈·박건희·강민석·박동석·이명주",
  // 1200x630 의료진 대표 OG 이미지
  ogImage: "/images/doctor-og.jpg",
} as const;

/**
 * 카테고리 목록 페이지(/pain 등)용 Next.js Metadata 를 CATEGORY_META 에서 생성.
 *
 * 주의: 루트 layout 의 title.template 이 "%s | 일산한의원" 이므로
 *   - page title 은 앞부분만 둔다 (template 이 접미사를 붙임)
 *   - openGraph/twitter title 은 풀타이틀을 직접 지정 (OG title 엔 template 미적용)
 *
 * 네이버 캐러셀 타깃(pain/diet/skin)은 라벨 일치를 위해 carousel-targets.ts 의
 * title 을 쓴다. 기존 첫 단어(통증·다이어트·피부)는 그대로 두고 설명만 덧붙인
 * 문구다 — 교체가 아니라 삽입. 타깃이 아닌 autonomic 은 meta.label 그대로.
 */
export function categoryMetadata(category: Category): Metadata {
  const meta = CATEGORY_META[category];
  const url = `${SITE_URL}/${category}`;
  const ogImageUrl = `${SITE_URL}${meta.ogImage}`;
  const title =
    category in CAROUSEL_TARGETS
      ? CAROUSEL_TARGETS[category as keyof typeof CAROUSEL_TARGETS].title
      : meta.label;
  const fullTitle = `${title} | 일산한의원`;

  return {
    title,
    description: meta.description,
    openGraph: {
      title: fullTitle,
      description: meta.description,
      url,
      siteName: "일산한의원",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `일산한의원 ${meta.fullLabel}`,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: meta.description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: url,
    },
  };
}
