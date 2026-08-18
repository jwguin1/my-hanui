import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  CATEGORIES,
  type Category,
  createPost,
  getPostBySlug,
} from "@/lib/blog-local";
import { generateOgImageForPost } from "@/lib/og-render";

const DATA_URL_RE =
  /data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,([A-Za-z0-9+/=]+)/g;

function normalizeExt(mime: string): string {
  if (mime === "jpeg") return "jpg";
  if (mime === "svg+xml") return "svg";
  return mime;
}

function todayYYYYMMDD(): string {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function slugifyTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function saveImage(dir: string, filename: string, b64: string): void {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, filename), Buffer.from(b64, "base64"));
}

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  const expected = process.env.BLOG_API_KEY;
  if (!expected || apiKey !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    title?: string;
    content?: string;
    description?: string;
    tags?: string[];
    thumbnail?: string;
    published?: boolean;
    author?: string;
    category?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, content } = body;
  if (!title || !content) {
    return NextResponse.json(
      { error: "title and content are required" },
      { status: 400 }
    );
  }

  const rawCategory = (body.category || "").trim();
  if (!rawCategory) {
    return NextResponse.json(
      { error: `category is required (one of: ${CATEGORIES.join(", ")})` },
      { status: 400 }
    );
  }
  if (!isCategory(rawCategory)) {
    return NextResponse.json(
      { error: `Invalid category. Allowed: ${CATEGORIES.join(", ")}` },
      { status: 400 }
    );
  }
  const category: Category = rawCategory;

  const titleSlug = slugifyTitle(title);
  const slug = `${todayYYYYMMDD()}-${titleSlug || `post-${Date.now()}`}`;

  if (getPostBySlug(slug)) {
    return NextResponse.json(
      { error: "Post with this slug already exists", slug },
      { status: 409 }
    );
  }

  const imagesDir = path.join(process.cwd(), "public", "blog-images", slug);
  const publicPrefix = `/blog-images/${slug}`;

  let counter = 0;
  const processedContent = content.replace(
    DATA_URL_RE,
    (_m: string, mime: string, b64: string) => {
      counter += 1;
      const filename = `img-${counter}.${normalizeExt(mime)}`;
      saveImage(imagesDir, filename, b64);
      return `${publicPrefix}/${filename}`;
    }
  );

  let thumbnail = body.thumbnail || "";
  const thumbMatch =
    /^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,([A-Za-z0-9+/=]+)$/.exec(
      thumbnail
    );
  if (thumbMatch) {
    const filename = `thumbnail.${normalizeExt(thumbMatch[1])}`;
    saveImage(imagesDir, filename, thumbMatch[2]);
    thumbnail = `${publicPrefix}/${filename}`;
  }

  const post = createPost(
    slug,
    {
      title,
      description: body.description,
      date: todayISO(),
      thumbnail,
      tags: body.tags,
      published: body.published !== false,
      // 선택 필드 — 한의사 실명을 넣으면 Article.author 가
      // Physician 노드(/doctor#{슬러그})로 연결된다 (lib/schema.ts DOCTOR_SLUGS)
      author: body.author,
    },
    processedContent,
    category
  );

  // OG/캐러셀용 파생 이미지(1200x630) 생성. 실패해도 발행 자체는 성공 처리한다.
  let ogImage: string | null = null;
  try {
    const og = await generateOgImageForPost(slug, thumbnail, processedContent);
    if (og.status === "created" || og.status === "exists") ogImage = og.rel;
  } catch (e) {
    console.error(`[publish-blog] og.png 생성 실패 (${slug}):`, e);
  }

  return NextResponse.json(
    {
      success: true,
      slug: post.slug,
      category,
      url: `/${category}/${post.slug}`,
      ogImage,
    },
    { status: 201 }
  );
}
