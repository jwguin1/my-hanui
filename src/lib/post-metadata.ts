import type { Metadata } from "next";
import {
  CATEGORY_LABEL,
  type Category,
  getPostBySlug,
} from "@/lib/blog-local";
import { CATEGORY_META, SITE_URL } from "@/lib/categories";
import { OG_HEIGHT, OG_WIDTH, hasOgImage, postImagePath } from "@/lib/og-image";

/**
 * 카테고리 글 상세(/{category}/{slug}) 페이지의 Metadata.
 *
 * og:image 는 파생 OG(1200x630) → 원본 썸네일 → 카테고리 대표 OG 순으로 폴백한다.
 * 4개 카테고리 라우트가 동일한 코드를 쓰므로 이 함수가 유일한 출처다.
 */
export function categoryPostMetadata(
  category: Category,
  slug: string
): Metadata {
  const post = getPostBySlug(slug, category);
  if (!post) return { title: "글을 찾을 수 없습니다" };

  const label = CATEGORY_LABEL[category];
  // 글 제목에 이미 브랜드명이 들어 있으면 접미사를 붙이지 않는다 (title 내 중복 방지)
  const fullTitle = post.title.includes("일산한의원")
    ? `${post.title} | ${label}`
    : `${post.title} | 일산한의원 ${label}`;
  const url = `${SITE_URL}/${category}/${slug}`;

  const imagePath = postImagePath(
    slug,
    post.thumbnail,
    CATEGORY_META[category].ogImage
  );
  const imageUrl = /^https?:\/\//.test(imagePath)
    ? imagePath
    : `${SITE_URL}${imagePath}`;

  // 파생 OG 와 카테고리 대표 OG 만 치수를 보장할 수 있다 (원본 썸네일은 비율이 제각각)
  const knownSize = hasOgImage(slug) || imagePath === CATEGORY_META[category].ogImage;
  const image = knownSize
    ? { url: imageUrl, width: OG_WIDTH, height: OG_HEIGHT, alt: post.title }
    : { url: imageUrl, alt: post.title };

  return {
    title: { absolute: fullTitle },
    description: post.description,
    openGraph: {
      title: fullTitle,
      description: post.description,
      type: "article",
      url,
      siteName: "일산한의원",
      locale: "ko_KR",
      publishedTime: post.date,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: post.description,
      images: [imageUrl],
    },
    alternates: { canonical: url },
  };
}
