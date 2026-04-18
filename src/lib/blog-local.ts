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
