import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface LocalBlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  thumbnail: string;
  tags: string[];
  published: boolean;
  content: string;
}

function ensureBlogDir() {
  if (!fs.existsSync(BLOG_DIR)) {
    fs.mkdirSync(BLOG_DIR, { recursive: true });
  }
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

export function getAllPosts(): LocalBlogPost[] {
  ensureBlogDir();

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  const posts = files
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
      const { data, content } = matter(raw);

      return {
        slug,
        title: data.title || slug,
        description: data.description || "",
        date: data.date || "",
        thumbnail: resolveThumbnail(data, content),
        tags: data.tags || [],
        published: data.published !== false,
        content,
      };
    })
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getPostBySlug(slug: string): LocalBlogPost | null {
  ensureBlogDir();

  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || "",
    thumbnail: resolveThumbnail(data, content),
    tags: data.tags || [],
    published: data.published !== false,
    content,
  };
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
  maxCount: number = 3
): LocalBlogPost[] {
  const all = getAllPosts();
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

export function autoLinkMarkdown(
  content: string,
  currentSlug: string,
  maxLinks: number = 3
): string {
  const others = getAllPosts().filter((p) => p.slug !== currentSlug);

  const keywordMap: Array<{ keyword: string; slug: string }> = [];
  const seen = new Set<string>();
  for (const post of others) {
    for (const tag of post.tags) {
      const k = tag.trim();
      if (k.length >= 3 && !seen.has(k)) {
        keywordMap.push({ keyword: k, slug: post.slug });
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
    for (const { keyword, slug } of keywordMap) {
      if (linked >= maxLinks) break;
      if (linkedKeywords.has(keyword)) continue;
      const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const re = new RegExp(escaped);
      if (re.test(next)) {
        next = next.replace(re, `[${keyword}](/health-info/${slug})`);
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
  },
  content: string
): LocalBlogPost {
  ensureBlogDir();

  const date = frontmatter.date || new Date().toISOString().split("T")[0];
  const data = {
    title: frontmatter.title,
    description: frontmatter.description || "",
    date,
    thumbnail: frontmatter.thumbnail || "",
    tags: frontmatter.tags || [],
    published: frontmatter.published !== false,
  };

  const fileContent = matter.stringify(content, data);
  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.md`), fileContent, "utf-8");

  return { slug, ...data, content };
}
