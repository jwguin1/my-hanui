import type { Metadata } from "next";
import { SITE_URL } from "@/lib/categories";
import { OG_HEIGHT, OG_WIDTH } from "@/lib/og-image";

/**
 * 정적 페이지(/about, /contact 등)의 Metadata 생성기.
 *
 * Next.js 는 openGraph 를 얕은 병합한다 — 자식이 openGraph 를 선언하면
 * 부모(layout)의 openGraph.images 는 상속되지 않고 통째로 사라진다.
 * alternates.canonical 도 마찬가지로 선언하지 않으면 layout 의 값(홈 URL)이
 * 그대로 상속되어 "이 페이지는 홈의 중복"이라고 선언해버린다.
 *
 * 두 함정을 페이지마다 기억하지 않도록 이 함수를 통해서만 metadata 를 만든다.
 */

/** 사이트 기본 OG 이미지 (public/og-image.jpg) */
export const DEFAULT_OG_IMAGE = "/og-image.jpg";
const DEFAULT_OG_IMAGE_SIZE = { width: 1280, height: 846 };

export interface PageMetadataInput {
  /** 사이트 루트 기준 경로 (`/about`). canonical 과 og:url 에 쓰인다. */
  path: string;
  title: string;
  description: string;
  /** 미지정 시 title 을 그대로 쓴다 (layout 의 title.template 은 OG 에 적용되지 않음) */
  ogTitle?: string;
  /** 미지정 시 description 을 그대로 쓴다 */
  ogDescription?: string;
  /** public 기준 절대경로. 미지정 시 사이트 기본 OG */
  image?: string;
  imageAlt?: string;
  /** opengraph-image.tsx 파일 규약을 쓰는 페이지 — metadata 에서 og:image 를 지정하지 않는다 */
  routeOgImage?: boolean;
}

export function pageMetadata({
  path,
  title,
  description,
  ogTitle,
  ogDescription,
  image,
  imageAlt,
  routeOgImage = false,
}: PageMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;
  const imagePath = image ?? DEFAULT_OG_IMAGE;
  const imageUrl = `${SITE_URL}${imagePath}`;
  const size =
    image === undefined
      ? DEFAULT_OG_IMAGE_SIZE
      : { width: OG_WIDTH, height: OG_HEIGHT };

  // opengraph-image.tsx 를 둔 페이지는 images 를 비워야 파일 규약이 적용된다.
  // (metadata 에서 openGraph.images 를 명시하면 파일 규약을 덮어쓴다)
  const images = routeOgImage
    ? {}
    : {
        openGraph: {
          images: [
            {
              url: imageUrl,
              width: size.width,
              height: size.height,
              alt: imageAlt ?? ogTitle ?? title,
            },
          ],
        },
        twitter: { images: [imageUrl] },
      };

  return {
    title,
    description,
    openGraph: {
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      url,
      siteName: "일산한의원",
      locale: "ko_KR",
      type: "website",
      ...(images.openGraph ?? {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle ?? title,
      description: ogDescription ?? description,
      ...(images.twitter ?? {}),
    },
    alternates: { canonical: url },
  };
}
