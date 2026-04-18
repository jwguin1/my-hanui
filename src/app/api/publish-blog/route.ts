import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { createPost, getPostBySlug } from "@/lib/blog-local";

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
    },
    processedContent
  );

  return NextResponse.json(
    {
      success: true,
      slug: post.slug,
      url: `/health-info/${post.slug}`,
    },
    { status: 201 }
  );
}
