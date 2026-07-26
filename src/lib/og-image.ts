import fs from "fs";
import path from "path";

/**
 * 글별 OG/캐러셀 전용 파생 이미지의 경로 규약과 소스 선택 로직.
 *
 * 이 모듈은 sharp 를 import 하지 않는다 (페이지 렌더링 경로에서 쓰이므로 가볍게 유지).
 * 실제 이미지 생성은 og-render.ts 가 담당한다.
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const PUBLIC_DIR = path.join(process.cwd(), "public");

export function isExternalImage(src: string): boolean {
  return /^https?:\/\//.test(src);
}

/** 파생 OG 이미지의 public 기준 절대경로 (`/blog-images/{slug}/og.png`) */
export function ogImagePath(slug: string): string {
  return `/blog-images/${slug}/og.png`;
}

export function hasOgImage(slug: string): boolean {
  return fs.existsSync(path.join(PUBLIC_DIR, "blog-images", slug, "og.png"));
}

/**
 * 글 카드·og:image·JSON-LD 가 공통으로 쓸 이미지 경로.
 *
 * 파생 OG(1200x630) 가 있으면 그것을 쓰고, 없으면 원본 썸네일, 그것도 없으면
 * 호출측이 넘긴 카테고리 대표 OG 로 폴백한다.
 */
export function postImagePath(
  slug: string,
  thumbnail: string,
  fallback: string
): string {
  if (hasOgImage(slug)) return ogImagePath(slug);
  if (thumbnail) return thumbnail;
  return fallback;
}

/**
 * OG 소스로 쓸 "자사 도메인" 이미지를 고른다.
 *
 * 일부 글은 frontmatter thumbnail 이 Unsplash 외부 URL 이지만 본문에 로컬 figure 를
 * 함께 갖고 있다. OG/캐러셀 이미지는 자사 도메인이어야 하므로 그런 경우
 * 본문의 첫 로컬 이미지 → blog-images/{slug} 의 첫 파일 순으로 폴백한다.
 */
export function resolveOgSource(
  slug: string,
  thumbnail: string,
  content: string
): { rel: string; via: string } | null {
  if (thumbnail && !isExternalImage(thumbnail)) {
    return { rel: thumbnail, via: "frontmatter/본문" };
  }

  const localInBody = [
    ...content.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g),
  ]
    .map((m) => m[1].trim())
    .find((p) => !isExternalImage(p));
  if (localInBody) return { rel: localInBody, via: "본문 로컬 이미지 폴백" };

  const dir = path.join(PUBLIC_DIR, "blog-images", slug);
  if (fs.existsSync(dir)) {
    const first = fs
      .readdirSync(dir)
      .filter((f) => /^(img-\d+|thumbnail)\.(png|jpe?g|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))[0];
    if (first) {
      return { rel: `/blog-images/${slug}/${first}`, via: "이미지 폴더 폴백" };
    }
  }

  return null;
}
