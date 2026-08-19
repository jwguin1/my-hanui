import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { normalizeSlug, postPath, readSlugParam } from "@/lib/slug";

const CONTENT_DIR = path.join(process.cwd(), "content");

export const CATEGORIES = ["pain", "diet", "autonomic", "skin"] as const;
export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABEL: Record<Category, string> = {
  pain: "통증",
  diet: "다이어트",
  autonomic: "자율신경",
  skin: "피부",
};

export const CATEGORY_DESCRIPTION: Record<Category, string> = {
  pain: "근골격계 통증, 신경포착증후군, 초음파 유도 치료 등 통증 관련 최신 의학정보를 다룹니다.",
  diet: "체중 관리, 대사 질환, 인크레틴 등 다이어트와 관련된 의학 연구를 소개합니다.",
  autonomic: "자율신경 기능, 스트레스, 수면 등 자율신경계 관련 건강정보를 전합니다.",
  skin: "피부 질환, 피부 노화, 한의학적 접근 등 피부 관련 정보를 제공합니다.",
};

export interface LocalBlogPost {
  /**
   * 파일 ID — 확장자를 뗀 파일명. **자산 키**다.
   *
   * `public/blog-images/{id}/` 폴더와 프론트매터 thumbnail 경로가 이 값에 묶여 있다.
   * 슬러그와 분리해 둔 이유는, 슬러그를 고칠 때마다 폴더를 옮기면
   * og.png/og.webp 쌍 대조와 소셜 크롤러 캐시가 함께 깨지기 때문이다.
   * URL 을 만들 때 id 를 쓰지 말 것 — 그건 slug 의 일이다.
   */
  id: string;
  /**
   * URL 슬러그. 프론트매터 `slug` 가 있으면 그 값(NFC), 없으면 id 로 폴백한다.
   * 폴백 덕분에 기존 글은 프론트매터를 건드리지 않아도 URL 이 그대로 유지된다.
   *
   * **발행 후 불변으로 취급한다.** 제목을 고쳐도 재계산하지 않는다.
   */
  slug: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
  content: string;
  category: string; // "blog" (uncategorized/공지) | Category
  /**
   * 작성 한의사 실명 (선택). 의료 콘텐츠는 YMYL 이라 작성자 귀속이
   * 평가에 반영된다. 값이 있고 lib/schema.ts 의 DOCTOR_SLUGS 에 등록된
   * 이름이면 Article.author 가 Physician 노드(/doctor#{슬러그})로 연결되고,
   * 비어 있으면 병원 노드(#clinic)로 폴백한다.
   */
  author?: string;
}

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function extractFirstImage(content: string): string {
  const m = content.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  return m ? m[1].trim() : "";
}

function resolveThumbnail(data: Record<string, unknown>, content: string): string {
  const fromFm = (data.thumbnail || data.image || "") as string;
  if (fromFm && fromFm.trim()) return fromFm.trim();
  return extractFirstImage(content);
}

function readPostFile(filePath: string, id: string, category: string): LocalBlogPost | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  // 프론트매터 슬러그는 선택 필드다. 없으면 파일 ID 로 폴백한다.
  // 읽는 시점에 정규화한다 — NFD 가 섞인 파일이 들어와도 여기서 걸러진다.
  const fmSlug = normalizeSlug((data.slug as string) || "");
  return {
    id,
    slug: fmSlug || id,
    title: (data.title as string) || id,
    description: (data.description as string) || "",
    date: (data.date as string) || "",
    thumbnail: resolveThumbnail(data, content),
    tags: (data.tags as string[]) || [],
    published: data.published !== false,
    author: ((data.author as string) || "").trim() || undefined,
    content,
    category,
  };
}

function listPostsInDir(dir: string, category: string): LocalBlogPost[] {
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  return files
    .map((file) => readPostFile(path.join(dir, file), file.replace(/\.md$/, ""), category))
    .filter((p): p is LocalBlogPost => p !== null);
}

/**
 * 모든 글 또는 특정 카테고리 글을 반환.
 * - category 미지정: blog(공지) + 모든 카테고리 폴더 종합 (아카이브용).
 * - category 지정: 해당 폴더만.
 */
export function getAllPosts(category?: Category): LocalBlogPost[] {
  let posts: LocalBlogPost[];
  if (category) {
    posts = listPostsInDir(path.join(CONTENT_DIR, category), category);
  } else {
    posts = [
      ...listPostsInDir(path.join(CONTENT_DIR, "blog"), "blog"),
      ...CATEGORIES.flatMap((cat) =>
        listPostsInDir(path.join(CONTENT_DIR, cat), cat)
      ),
    ];
  }
  return posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * 슬러그로 글 조회.
 * - category 지정 시 해당 폴더에서만 검색.
 * - 미지정 시 blog + 모든 카테고리 폴더에서 순차 검색.
 */
export function getPostBySlug(
  slug: string,
  category?: Category
): LocalBlogPost | null {
  // 슬러그로 파일 경로를 조립하지 않는다. 프론트매터 슬러그는 파일명과
  // 다를 수 있으므로 폴더를 훑어 슬러그로 매칭한다.
  // (getAllPosts 가 이미 매 요청 전 파일을 읽으므로 새로 생기는 비용은 아니다)
  //
  // readSlugParam 은 퍼센트 디코드까지 한다 — Next 는 params.slug 를
  // URL 세그먼트 원문(인코딩된 상태)으로 넘기기 때문이다.
  const wanted = readSlugParam(slug);
  if (!wanted) return null;

  const dirs = category ? [category] : ["blog", ...CATEGORIES];
  for (const cat of dirs) {
    const post = listPostsInDir(path.join(CONTENT_DIR, cat), cat).find(
      (p) => p.slug === wanted
    );
    if (post) return post;
  }
  return null;
}

export function toISO8601KST(dateStr: string): string {
  if (!dateStr) return "";
  if (/T\d{2}:\d{2}/.test(dateStr)) return dateStr;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return `${dateStr}T00:00:00+09:00`;
  }
  return dateStr;
}

export function getRelatedPosts(
  slug: string,
  maxCount: number = 3,
  category?: Category
): LocalBlogPost[] {
  const all = category ? getAllPosts(category) : getAllPosts();
  const current = all.find((p) => p.slug === slug);
  if (!current) return [];

  const others = all.filter((p) => p.slug !== slug);
  const currentTags = new Set(current.tags);

  const withOverlap = others
    .map((p) => ({
      post: p,
      overlap: p.tags.filter((t) => currentTags.has(t)).length,
    }))
    .filter((s) => s.overlap > 0)
    .sort(
      (a, b) =>
        b.overlap - a.overlap ||
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    )
    .map((s) => s.post);

  if (withOverlap.length >= maxCount) return withOverlap.slice(0, maxCount);

  const picked = new Set(withOverlap.map((p) => p.slug));
  const fillers = others.filter((p) => !picked.has(p.slug));
  return [...withOverlap, ...fillers].slice(0, maxCount);
}

/**
 * 본문에서 다른 글 키워드를 자동으로 링크화.
 * 링크 대상은 항상 카테고리 URL (/{category}/{slug}). 분류되지 않은 글은 링크 대상에서 제외.
 */
export function autoLinkMarkdown(
  content: string,
  currentSlug: string,
  maxLinks: number = 3
): string {
  const others = getAllPosts().filter(
    (p) => p.slug !== currentSlug && isCategory(p.category)
  );

  const keywordMap: Array<{ keyword: string; slug: string; category: string }> = [];
  const seen = new Set<string>();
  for (const post of others) {
    for (const tag of post.tags) {
      const k = tag.trim();
      if (k.length >= 3 && !seen.has(k)) {
        keywordMap.push({ keyword: k, slug: post.slug, category: post.category });
        seen.add(k);
      }
    }
  }
  keywordMap.sort((a, b) => b.keyword.length - a.keyword.length);

  const lines = content.split("\n");
  let linked = 0;
  const linkedKeywords = new Set<string>();
  let inFence = false;

  const out = lines.map((line) => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return line;
    }
    if (inFence) return line;
    if (linked >= maxLinks) return line;
    if (/^\s*#/.test(line)) return line;
    if (/^\s*!\[/.test(line)) return line;
    if (/\[[^\]]+\]\(/.test(line)) return line;

    let next = line;
    for (const { keyword, slug, category } of keywordMap) {
      if (linked >= maxLinks) break;
      if (linkedKeywords.has(keyword)) continue;
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(escaped);
      if (re.test(next)) {
        next = next.replace(re, `[${keyword}](${postPath(category, slug)})`);
        linkedKeywords.add(keyword);
        linked++;
      }
    }
    return next;
  });

  return out.join("\n");
}

export function createPost(
  /** 파일 ID — 파일명이자 이미지 폴더 키가 된다 */
  id: string,
  frontmatter: {
    title: string;
    /** URL 슬러그. 생략하면 id 가 그대로 URL 이 된다 */
    slug?: string;
    description?: string;
    date?: string;
    thumbnail?: string;
    tags?: string[];
    published?: boolean;
    /** 작성 한의사 실명 (선택) */
    author?: string;
  },
  content: string,
  category: Category | "blog" = "blog"
): LocalBlogPost {
  const dir = path.join(CONTENT_DIR, category);
  ensureDir(dir);

  const date = frontmatter.date || new Date().toISOString().split("T")[0];
  const slug = normalizeSlug(frontmatter.slug || "") || id;
  const data = {
    title: frontmatter.title,
    // 슬러그는 발행 시점에 한 번 적고 이후 재계산하지 않는다.
    // id 와 같으면 굳이 적지 않는다 — 기존 글과 같은 모양을 유지한다.
    ...(slug !== id ? { slug } : {}),
    description: frontmatter.description || "",
    date,
    thumbnail: frontmatter.thumbnail || "",
    tags: frontmatter.tags || [],
    published: frontmatter.published !== false,
    ...(frontmatter.author ? { author: frontmatter.author } : {}),
  };

  const fileContent = matter.stringify(content, data);
  fs.writeFileSync(path.join(dir, `${id}.md`), fileContent, "utf-8");

  return { id, ...data, slug, content, category };
}
