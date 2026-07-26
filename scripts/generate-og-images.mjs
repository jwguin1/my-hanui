/**
 * 글별 OG/캐러셀 전용 파생 이미지 일괄 생성.
 *
 *   public/blog-images/{slug}/og.png  (1200x630, 흰 여백, crop 없음)
 *
 * 실제 생성 로직은 src/lib/og-render.ts 에 있고 발행 API 와 공유한다.
 * 이 스크립트는 content/ 를 훑어 기존 글에 일괄 적용하는 역할만 한다.
 *
 * 사용법:
 *   node scripts/generate-og-images.mjs --dry-run   대상 목록만 출력
 *   node scripts/generate-og-images.mjs             없는 것만 생성
 *   node scripts/generate-og-images.mjs --force     이미 있어도 재생성
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { resolveOgSource } from "../src/lib/og-image.ts";
import { generateOgImageForPost } from "../src/lib/og-render.ts";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const CATEGORIES = ["pain", "diet", "autonomic", "skin"];

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const FORCE = argv.includes("--force");

/** src/lib/blog-local.ts 의 resolveThumbnail 과 동일한 규칙 */
function resolveThumbnail(data, content) {
  const fromFm = data.thumbnail || data.image || "";
  if (fromFm && String(fromFm).trim()) return String(fromFm).trim();
  const m = content.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
  return m ? m[1].trim() : "";
}

function collectPosts() {
  const posts = [];
  for (const category of CATEGORIES) {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      if (data.published === false) continue;
      posts.push({
        slug: file.replace(/\.md$/, ""),
        category,
        thumbnail: resolveThumbnail(data, content),
        content,
      });
    }
  }
  return posts.sort((a, b) => a.slug.localeCompare(b.slug));
}

async function main() {
  const posts = collectPosts();
  const rows = [];

  for (const post of posts) {
    if (DRY_RUN) {
      const source = resolveOgSource(post.slug, post.thumbnail, post.content);
      const dest = path.join(ROOT, "public", "blog-images", post.slug, "og.png");
      const exists = fs.existsSync(dest);
      rows.push({
        ...post,
        status: !source
          ? "SKIP: 자사 이미지 없음"
          : exists && !FORCE
            ? "SKIP: 이미 존재"
            : "WOULD-CREATE",
        detail: source ? `${source.rel} · ${source.via}` : "",
      });
      continue;
    }

    const r = await generateOgImageForPost(post.slug, post.thumbnail, post.content, {
      force: FORCE,
    });
    rows.push({
      ...post,
      status:
        r.status === "created"
          ? "CREATED"
          : r.status === "exists"
            ? "SKIP: 이미 존재"
            : `SKIP: ${r.reason}`,
      detail:
        r.status === "created"
          ? `${r.render.srcW}x${r.render.srcH} → 내부 ${r.render.innerW}x${r.render.innerH} · ${Math.round(r.render.bytes / 1024)}KB · ${r.render.mode} · ${r.via}`
          : "",
    });
  }

  const pad = (s, n) => String(s).padEnd(n);
  console.log(`\n${DRY_RUN ? "[DRY RUN] " : ""}대상 ${rows.length}건\n`);
  for (const r of rows) {
    console.log(
      `${pad(r.category, 10)} ${pad(r.slug, 20)} ${pad(r.status, 20)} ${r.detail}`
    );
  }

  const made = rows.filter((r) => r.status === "CREATED" || r.status === "WOULD-CREATE");
  console.log(
    `\n요약: ${DRY_RUN ? "생성 예정" : "생성"} ${made.length} / 건너뜀 ${rows.length - made.length}`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
