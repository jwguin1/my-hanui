import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

function readPostFile(filePath: string, slug: string, category: string): LocalBlogPost | null {
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: (data.title as string) || slug,
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
  if (category) {
    return readPostFile(
      path.join(CONTENT_DIR, category, `${slug}.md`),
      slug,
      category
    );
  }
  const candidates = ["blog", ...CATEGORIES];
  for (const cat of candidates) {
    const post = readPostFile(
      path.join(CONTENT_DIR, cat, `${slug}.md`),
      slug,
      cat
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
        next = next.replace(re, `[${keyword}](/${category}/${slug})`);
        linkedKeywords.add(keyword);
        linked++;
      }
    }
    return next;
  });

  return out.join("\n");
}

export function createPost(
  slug: string,
  frontmatter: {
    title: string;
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
  const data = {
    title: frontmatter.title,
    description: frontmatter.description || "",
    date,
    thumbnail: frontmatter.thumbnail || "",
    tags: frontmatter.tags || [],
    published: frontmatter.published !== false,
    ...(frontmatter.author ? { author: frontmatter.author } : {}),
  };

  const fileContent = matter.stringify(content, data);
  fs.writeFileSync(path.join(dir, `${slug}.md`), fileContent, "utf-8");

  return { slug, ...data, content, category };
}
