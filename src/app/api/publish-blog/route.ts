import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import {
  CATEGORIES,
  type Category,
  createPost,
  getAllPosts,
} from "@/lib/blog-local";
import { generateOgImageForPost } from "@/lib/og-render";
import {
  SLUG_MAX_LENGTH,
  SLUG_RECOMMENDED_LENGTH,
  normalizeSlug,
  postPath,
  slugCandidates,
  slugify,
  validateSlug,
} from "@/lib/slug";

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

/**
 * 파일 ID 용 제목 슬러그화. **URL 슬러그와 다르다.**
 *
 * 파일 ID 는 정렬·고유성·이미지 폴더 키로만 쓰이므로 길어도 상관없다.
 * URL 로 나가는 슬러그는 slugCandidates() 가 따로 만든다.
 */
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
    /** URL 슬러그 (선택). 주면 검증해서 그대로 쓰고, 없으면 제목에서 후보를 만든다 */
    slug?: string;
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

  // ── 파일 ID — 파일명이자 이미지 폴더 키. URL 과는 무관하다.
  const titleSlug = slugifyTitle(title);
  const id = `${todayYYYYMMDD()}-${titleSlug || `post-${Date.now()}`}`;

  if (fs.existsSync(path.join(process.cwd(), "content", category, `${id}.md`))) {
    return NextResponse.json(
      { error: "Post with this file id already exists", id },
      { status: 409 }
    );
  }

  // ── URL 슬러그 — 발행 후 불변이다. 여기서 정해 프론트매터에 적고 다시 계산하지 않는다.
  const candidates = slugCandidates(title);
  const provided = normalizeSlug(body.slug || "");
  const slug = provided ? slugify(provided) : candidates[0] || "";

  const problems = validateSlug(slug, {
    category,
    existing: getAllPosts(category).map((p) => p.slug),
  });
  if (problems.length) {
    // 길이 초과든 중복이든 **자동으로 고치지 않는다.** 슬러그는 불변이라
    // 조용히 -2 를 붙이면 의도하지 않은 URL 이 영구히 박힌다.
    return NextResponse.json(
      {
        error: "Invalid slug",
        slug,
        slugSource: provided ? "provided" : "auto",
        problems: problems.map((p) => `${p.code}: ${p.message}`),
        candidates,
        hint: `slug 를 직접 지정해 다시 요청하세요 (한글·숫자·영문 소문자·하이픈, 최대 ${SLUG_MAX_LENGTH}자, 권장 ${SLUG_RECOMMENDED_LENGTH}자)`,
      },
      { status: 409 }
    );
  }

  const imagesDir = path.join(process.cwd(), "public", "blog-images", id);
  const publicPrefix = `/blog-images/${id}`;

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
    id,
    {
      title,
      slug,
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
    const og = await generateOgImageForPost(id, thumbnail, processedContent);
    if (og.status === "created" || og.status === "exists") ogImage = og.rel;
  } catch (e) {
    console.error(`[publish-blog] og.png 생성 실패 (${id}):`, e);
  }

  return NextResponse.json(
    {
      success: true,
      id: post.id,
      slug: post.slug,
      slugSource: provided ? "provided" : "auto",
      // 자동 슬러그를 썼다면 사람이 검토할 수 있게 나머지 후보도 함께 돌려준다.
      // 슬러그는 불변이므로 고칠 거면 발행 직후가 마지막 기회다.
      candidates,
      category,
      url: postPath(category, post.slug),
      ogImage,
    },
    { status: 201 }
  );
}
