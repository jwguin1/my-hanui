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

/**
 * 이 모듈의 모든 함수는 슬러그가 아니라 **글의 파일 ID** 를 받는다.
 *
 * 자산 경로를 슬러그에 묶으면 슬러그를 고칠 때마다 폴더를 옮겨야 하고,
 * og.png/og.webp 쌍 대조와 소셜 크롤러 캐시가 함께 깨진다.
 * 기존 글은 프론트매터 thumbnail 에 `/blog-images/{id}/...` 를 하드코딩해 두었기 때문에
 * 더더욱 id 로 고정한다. (LocalBlogPost.id 를 넘길 것 — post.slug 가 아니다)
 */

/** 파생 OG 이미지의 public 기준 절대경로 (`/blog-images/{id}/og.png`) */
export function ogImagePath(id: string): string {
  return `/blog-images/${id}/og.png`;
}

export function hasOgImage(id: string): boolean {
  return fs.existsSync(path.join(PUBLIC_DIR, "blog-images", id, "og.png"));
}

/** 화면 표시용 파생 OG 의 public 기준 절대경로 (`/blog-images/{id}/og.webp`) */
export function ogWebpPath(id: string): string {
  return `/blog-images/${id}/og.webp`;
}

export function hasOgWebp(id: string): boolean {
  return fs.existsSync(path.join(PUBLIC_DIR, "blog-images", id, "og.webp"));
}

/**
 * 이미지의 용도.
 *
 * 한 파일이 화면 썸네일과 og:image 를 겸하면 요구사항이 충돌한다 —
 * 화면은 가벼운 WebP 가 좋고, 소셜 크롤러(카카오·네이버)는 WebP 를
 * 처리하지 못하는 것이 있다. 그래서 같은 소스에서 두 파생을 만들고
 * 호출부가 용도를 밝히게 한다.
 *
 * - "display": 화면 <img src>. og.webp 우선.
 * - "social":  og:image 메타 + JSON-LD image. 항상 og.png.
 */
export type ImagePurpose = "display" | "social";

/**
 * 글 카드·og:image·JSON-LD 가 쓸 이미지 경로.
 *
 * 파생 OG(1200x630) 가 있으면 그것을 쓰고, 없으면 원본 썸네일, 그것도 없으면
 * 호출측이 넘긴 카테고리 대표 OG 로 폴백한다.
 *
 * purpose 로 화면용(WebP)과 소셜용(PNG)을 가른다. 기본값은 "social" —
 * 실수로 빠뜨렸을 때 크롤러가 깨지는 쪽이 아니라 안전한 쪽으로 떨어진다.
 */
export function postImagePath(
  /** 글의 파일 ID (LocalBlogPost.id). 슬러그를 넘기지 말 것 */
  id: string,
  thumbnail: string,
  fallback: string,
  purpose: ImagePurpose = "social"
): string {
  // display 는 WebP 파생이 실제로 있을 때만 쓴다 — 과거 글에 og.webp 가
  // 없어도 조용히 깨지지 않도록 png 로 폴백한다.
  if (purpose === "display" && hasOgWebp(id)) return ogWebpPath(id);
  if (hasOgImage(id)) return ogImagePath(id);
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
  /** 글의 파일 ID (LocalBlogPost.id) */
  id: string,
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

  const dir = path.join(PUBLIC_DIR, "blog-images", id);
  if (fs.existsSync(dir)) {
    const first = fs
      .readdirSync(dir)
      .filter((f) => /^(img-\d+|thumbnail)\.(png|jpe?g|webp)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))[0];
    if (first) {
      return { rel: `/blog-images/${id}/${first}`, via: "이미지 폴더 폴백" };
    }
  }

  return null;
}
