import {
  CATEGORIES,
  CATEGORY_LABEL,
  type Category,
  getAllPosts,
  toISO8601KST,
} from "@/lib/blog-local";
import { CATEGORY_META, SITE_URL } from "@/lib/categories";
import { OG_HEIGHT, OG_WIDTH, postImagePath } from "@/lib/og-image";
import { imageSize } from "@/lib/image-size";
import { postPath } from "@/lib/slug";
import { articleStub, itemListNode, type SchemaNode } from "@/lib/schema";

/**
 * 홈 "의학칼럼" 섹션의 단일 소스.
 *
 * 화면 카드와 ItemList JSON-LD 가 반드시 같은 배열에서 생성되어야 하므로
 * (개수·순서·제목 불일치 시 네이버가 캐러셀 후보에서 제외) 이 모듈이 유일한 출처다.
 *
 * 카테고리 필터 없이 4개 분과 전체를 최신순으로 섞는다 — 앞으로 diet/autonomic/skin 에
 * 글이 쌓이면 자동으로 함께 노출된다. content/blog/ 의 미분류 공지글은 제외한다.
 */

export interface LatestPostCard {
  slug: string;
  category: Category;
  categoryLabel: string;
  /** 자사 내부 상세 경로 (`/pain/{slug}`) */
  href: string;
  /** 절대 URL — JSON-LD 용 */
  url: string;
  title: string;
  description: string;
  date: string;
  /** 화면 <img> 용 상대경로. 파생 og.webp → og.png → 원본 썸네일 → 카테고리 대표 OG */
  imagePath: string;
  /** imagePath 파일의 실제 픽셀 크기 — <img width/height> 용 (CLS 방지) */
  imageWidth: number;
  imageHeight: number;
  /**
   * JSON-LD image / og:image 용 절대 URL. 항상 PNG 계열(social) 이다.
   * 화면용 WebP 와 파일이 갈리는데, 이는 의도된 분리다 —
   * 카카오·네이버 크롤러 중 WebP 를 처리하지 못하는 것이 있다.
   */
  image: string;
  tags: string[];
  /** 프론트매터 author (선택) — Article.author 귀속용 */
  author?: string;
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function getLatestPostCards(limit: number = 5): LatestPostCard[] {
  return getAllPosts()
    .filter((post) => isCategory(post.category))
    .slice(0, limit)
    .map((post) => {
      const category = post.category as Category;
      const fallback = CATEGORY_META[category].ogImage;
      // 이미지 폴더 키는 파일 ID 다 (슬러그가 아니다)
      const imagePath = postImagePath(
        post.id,
        post.thumbnail,
        fallback,
        "display"
      );
      const socialPath = postImagePath(
        post.id,
        post.thumbnail,
        fallback,
        "social"
      );
      // 파생 OG 가 없는 글은 원본 썸네일을 그대로 쓰므로 1200x630 이 아니다.
      // 실측값을 넣지 않으면 종횡비가 어긋나 CLS 가 생긴다.
      const size = imageSize(imagePath);
      const href = postPath(category, post.slug);
      return {
        slug: post.slug,
        category,
        categoryLabel: CATEGORY_LABEL[category],
        href,
        url: `${SITE_URL}${href}`,
        title: post.title,
        description: post.description,
        date: post.date,
        imagePath,
        imageWidth: size?.width ?? OG_WIDTH,
        imageHeight: size?.height ?? OG_HEIGHT,
        image: toAbsoluteUrl(socialPath),
        tags: post.tags,
        author: post.author,
      };
    });
}

/**
 * 위 카드 배열과 1:1 대응하는 ItemList 노드.
 * 반드시 화면에 렌더링한 것과 동일한 배열을 넘길 것.
 *
 * itemListElement 의 Article 은 각 글 상세 페이지에 정의된 엔티티의
 * 스텁이다 — @id 가 같아야 같은 글로 인식된다.
 */
export function latestPostsListNode(cards: LatestPostCard[]): SchemaNode {
  return itemListNode("/", "recent-posts", "일산한의원 의학칼럼", cards.map((card) => ({
    url: card.url,
    name: card.title,
    image: card.image,
    item: articleStub({
      path: card.href,
      headline: card.title,
      description: card.description,
      datePublished: toISO8601KST(card.date),
      image: card.image,
      author: card.author,
    }),
  })));
}
