import {
  CATEGORIES,
  CATEGORY_LABEL,
  type Category,
  getAllPosts,
  toISO8601KST,
} from "@/lib/blog-local";
import { CATEGORY_META, SITE_URL } from "@/lib/categories";
import { postImagePath } from "@/lib/og-image";
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
  /** 화면 <img> 용 상대경로. 파생 og.png → 원본 썸네일 → 카테고리 대표 OG 순 */
  imagePath: string;
  /** 위와 같은 파일의 절대 URL — JSON-LD 용 (크롤러가 따라갈 수 있어야 함) */
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
      const imagePath = postImagePath(
        post.slug,
        post.thumbnail,
        CATEGORY_META[category].ogImage
      );
      return {
        slug: post.slug,
        category,
        categoryLabel: CATEGORY_LABEL[category],
        href: `/${category}/${post.slug}`,
        url: `${SITE_URL}/${category}/${post.slug}`,
        title: post.title,
        description: post.description,
        date: post.date,
        imagePath,
        image: toAbsoluteUrl(imagePath),
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
