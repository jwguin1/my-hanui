/**
 * 네이버 하위링크 카드(캐러셀) 대응 상태 검증.
 *
 * `next build` 산출물(.next/server/app/*.html)을 파싱해 대표이미지·라벨 일치를
 * 확인하고, 순위 방어를 위해 "건드리면 안 되는 것"이 실제로 안 건드려졌는지
 * git diff 로 확인한다. 후자가 하나라도 깨지면 즉시 중단한다.
 *
 * 실행: npm run build && npm run verify:carousel
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, ".next", "server", "app");
const SITE_URL = "https://www.ilsanhan.com";

/** 순위를 만든 자산 — 이번 작업으로 절대 바뀌면 안 되는 값들 */
const FROZEN = {
  homeTitle: "일산한의원 | 이마트풍산점 – 고양시 일산 한의원",
  ogImage: {
    "/": `${SITE_URL}/og-image.jpg`,
    "/pain": `${SITE_URL}/images/pain-og.jpg`,
    "/diet": `${SITE_URL}/images/diet-og.jpg`,
    "/skin": `${SITE_URL}/images/skin-og.jpg`,
    "/doctor": `${SITE_URL}/images/doctor-og.jpg`,
    "/about": `${SITE_URL}/og-image.jpg`,
    "/contact": `${SITE_URL}/og-image.jpg`,
  },
  /** 이 경로들이 diff 에 뜨면 실패 */
  untouchable: ["src/app/robots.ts", "public/robots.txt"],
  /**
   * 사이트맵에서 절대 사라지면 안 되는 URL — 순위를 만든 페이지들.
   *
   * 예전에는 src/app/sitemap.ts 를 통째로 "수정 금지"로 묶었는데, 그건
   * 파일을 못 고치게 할 뿐 **출력이 맞는지는 보지 않는 검사**였다.
   * 한글 슬러그 도입으로 sitemap.ts 는 고쳐야 했고(인코딩을 canonical 과
   * 맞춰야 한다), 그래서 파일 동결을 출력 동결로 바꿨다.
   * 이쪽이 원래 지키려던 것 — "URL 이 사라지지 않는다" — 을 실제로 지킨다.
   *
   * 글 URL 의 사라짐 감지는 validate-jsonld.mjs 의 "슬러그 변경" 검사가
   * 프로덕션 사이트맵과 대조해서 담당한다.
   */
  sitemapMustContain: [
    SITE_URL,
    `${SITE_URL}/pain`,
    `${SITE_URL}/diet`,
    `${SITE_URL}/skin`,
    `${SITE_URL}/doctor`,
    `${SITE_URL}/about`,
    `${SITE_URL}/contact`,
    `${SITE_URL}/pain/acute`,
    `${SITE_URL}/pain/chronic`,
    `${SITE_URL}/diet/program`,
    `${SITE_URL}/skin/spot`,
    `${SITE_URL}/accident`,
    `${SITE_URL}/autonomic/care`,
    `${SITE_URL}/internal/dyspepsia`,
  ],
};

/**
 * carousel-targets.ts 의 사본.
 * .ts 를 그냥 import 할 수 없어 문자열만 옮겨 둔다 — 어긋나면 라벨 검사에서
 * 바로 FAIL 이 나므로 조용히 썩지 않는다.
 */
/**
 * 캐러셀 준비 상태를 검사할 페이지들.
 *
 * **홈(`/`)이 오래 빠져 있었다.** 그래서 홈 대표 이미지가 1916x479(비율 4.0)인
 * 채로 73 PASS 가 나왔다 — 「일산한의원」 검색에서 우리만 캐러셀이 안 붙는데
 * 검증기는 아무 말이 없었다. 좌표가 144일 살아남은 것과 같은 구조다.
 *
 * 홈은 title·canonical·푸터 앵커 규칙이 다른 페이지들과 다르고 그 세 가지는
 * 아래 홈 전용 블록에서 이미 검사한다. 여기서 또 보면 규칙이 달라 **무관한
 * FAIL 이 섞여** 진짜 문제를 가린다. 그래서 해당 검사는 `skip` 으로 끈다.
 *
 *   heroSrc  히어로 이미지 경로. 생략하면 `/images/hero/{key}-hero.jpg`
 *   skip     이 타깃에서 건너뛸 검사 (title | footerAnchor | frozen)
 */
const TARGETS = [
  {
    key: "home",
    path: "/",
    // 홈 title 은 "…| 일산한의원" 형태가 아니고 FROZEN.homeTitle 로 따로 동결돼 있다.
    // canonical·og:image 도 홈 전용 블록에서 본다. 푸터 캐러셀 6개에도 홈은 없다.
    skip: ["title", "footerAnchor", "frozen"],
  },
  { key: "pain", path: "/pain", title: "통증 · 근골격 – 추나, 초음파약침" },
  { key: "diet", path: "/diet", title: "다이어트 – 일산감비환 한방 체질 처방" },
  { key: "skin", path: "/skin", title: "피부 · 레이저 – CO₂, 점·편평사마귀" },
  { key: "doctor", path: "/doctor", title: "의료진 – 한의사 6인 협진" },
  { key: "about", path: "/about", title: "병원 소개 – 이마트 풍산점 3층" },
  {
    key: "contact",
    path: "/contact",
    title: "오시는 길 – 경의중앙선 풍산역 2번출구",
  },
];

/** 홈에서 이 6개 + 아래 허용 목록 밖으로 나가는 내부 링크는 "직행"으로 센다 */
const HOME_ALLOWED_DEEP = [
  // 절충안: 진료 카드 7개와 최신 글 카드는 전환 동선·기존 ItemList 를 위해 남긴다.
  // (지우기로 했다면 이 배열을 비우고 다시 돌릴 것)
  "/pain/acute",
  "/pain/chronic",
  "/accident",
  "/internal/dyspepsia",
  "/autonomic/care",
  "/diet/program",
  "/skin/spot",
];

const results = [];
const fatal = [];

function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  return ok;
}

function readHtml(routePath) {
  const file = path.join(
    APP_DIR,
    routePath === "/" ? "index.html" : `${routePath.slice(1)}.html`
  );
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf-8");
}

/** <img ...> 를 전부 뽑아 속성 맵으로 */
function parseImgs(html) {
  const out = [];
  for (const m of html.matchAll(/<img\b([^>]*)>/gi)) {
    const attrs = {};
    for (const a of m[1].matchAll(/([a-zA-Z-]+)\s*=\s*"([^"]*)"/g)) {
      attrs[a[1].toLowerCase()] = a[2];
    }
    out.push(attrs);
  }
  return out;
}

function metaContent(html, prop) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]*)"`,
    "i"
  );
  const m = html.match(re);
  if (m) return m[1];
  // content 가 앞에 오는 순서도 있다
  const re2 = new RegExp(
    `<meta[^>]+content="([^"]*)"[^>]+(?:property|name)="${prop}"`,
    "i"
  );
  return html.match(re2)?.[1] ?? null;
}

function titleOf(html) {
  return html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? null;
}

function canonicalOf(html) {
  return (
    html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)?.[1] ??
    html.match(/<link[^>]+href="([^"]*)"[^>]+rel="canonical"/i)?.[1] ??
    null
  );
}

/** 태그 제거 후 앵커 텍스트만 */
function anchorTexts(html, href) {
  const out = [];
  const re = new RegExp(`<a\\b[^>]*href="${href}"[^>]*>([\\s\\S]*?)</a>`, "gi");
  for (const m of html.matchAll(re)) {
    out.push(m[1].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
  }
  return out;
}

function internalHrefs(html) {
  const out = new Set();
  for (const m of html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"/gi)) out.add(m[1]);
  return [...out];
}

// ── 0. 순위 방어: 손대면 안 되는 파일 ───────────────────────────────
function gitChangedFiles() {
  try {
    return execFileSync("git", ["diff", "main", "--name-only"], {
      cwd: ROOT,
      encoding: "utf-8",
    })
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return null;
  }
}

const changed = gitChangedFiles();
if (changed === null) {
  check("git diff main 실행", false, "main 브랜치를 찾을 수 없음");
  fatal.push("git diff 불가");
} else {
  const hits = FROZEN.untouchable.filter((p) => changed.includes(p));
  if (!check("robots 미변경", hits.length === 0, hits.join(", ")))
    fatal.push("robots 변경됨");
}

// ── 1~6. 타깃 6개 페이지 ─────────────────────────────────────────────
if (!fs.existsSync(APP_DIR)) {
  console.error(
    `빌드 산출물이 없습니다: ${path.relative(ROOT, APP_DIR)}\n먼저 npm run build 를 실행하세요.`
  );
  process.exit(1);
}

for (const t of TARGETS) {
  const html = readHtml(t.path);
  if (!html) {
    check(`${t.path} 빌드 산출물`, false, "html 없음");
    continue;
  }

  const skip = t.skip ?? [];
  const imgs = parseImgs(html);
  const heroSrc = t.heroSrc ?? `/images/hero/${t.key}-hero.jpg`;
  const hero = imgs.find((i) => i.src === heroSrc);

  check(`${t.path} 히어로 <img> 존재`, !!hero, hero ? "" : heroSrc);
  if (!hero) {
    /* 히어로가 없으면 나머지 검사는 의미가 없다. 다만 그냥 넘어가면
       「그럼 지금 대표 이미지가 뭔데」를 알 수 없다 — 캐러셀 썸네일은
       본문 최상단 최대 이미지에서 나오므로 그것을 그대로 보여 준다. */
    const first = imgs[0];
    results.push({
      name: `${t.path} 현재 본문 최상단 이미지`,
      ok: null,
      detail: first ? `${first.src} (${first.width ?? "?"}x${first.height ?? "?"})` : "이미지 없음",
    });
    continue;
  }

  // next/image 로 변환되면 src 가 /_next/image?url=... 이 된다
  check(`${t.path} 일반 <img> (next/image 아님)`, !hero.src.includes("/_next/image"));
  check(`${t.path} alt 비어있지 않음`, !!hero.alt?.trim(), hero.alt ?? "");
  check(`${t.path} loading="lazy" 없음`, hero.loading !== "lazy", hero.loading ?? "");

  // 문서 내 첫 이미지여야 한다
  check(`${t.path} 본문 최상단(첫 이미지)`, imgs[0]?.src === heroSrc, imgs[0]?.src ?? "");

  // 실제 파일 비율 1:1 ±2%
  const file = path.join(ROOT, "public", heroSrc);
  if (fs.existsSync(file)) {
    const meta = await sharp(file).metadata();
    const ratio = meta.width / meta.height;
    check(
      `${t.path} 히어로 비율 1:1 (±2%)`,
      Math.abs(ratio - 1) <= 0.02,
      `${meta.width}x${meta.height}`
    );
  } else {
    check(`${t.path} 히어로 파일 존재`, false, file);
  }

  // 페이지 내 최대 렌더 이미지 — 히어로는 680px, 나머지 카드 썸네일은 360px 이하 유지
  const bigger = imgs
    .filter((i) => i.src !== heroSrc)
    .filter((i) => Number(i.width) > 1080);
  check(
    `${t.path} 히어로가 최대 이미지`,
    bigger.length === 0,
    bigger.map((i) => `${i.src}(${i.width})`).join(", ")
  );

  // 라벨 일치: <title> = "{title} | 일산한의원", 푸터 앵커 = title 전체
  // 홈은 title 형식이 다르고(FROZEN.homeTitle) 푸터 캐러셀 6개에도 없어 건너뛴다.
  if (!skip.includes("title")) {
    const expectedTitle = `${t.title} | 일산한의원`;
    check(`${t.path} title`, titleOf(html) === expectedTitle, titleOf(html) ?? "");
  }

  if (!skip.includes("footerAnchor")) {
    const anchors = anchorTexts(html, t.path);
    check(
      `${t.path} 푸터 앵커 = title`,
      anchors.includes(t.title),
      anchors.join(" / ")
    );
  }

  // 순위 방어: canonical / og:image 불변 — 홈은 아래 홈 전용 블록에서 본다
  if (skip.includes("frozen")) continue;

  if (
    !check(
      `${t.path} canonical 불변`,
      canonicalOf(html) === `${SITE_URL}${t.path}`,
      canonicalOf(html) ?? ""
    )
  )
    fatal.push(`${t.path} canonical 변경됨`);

  if (
    !check(
      `${t.path} og:image 불변`,
      metaContent(html, "og:image") === FROZEN.ogImage[t.path],
      metaContent(html, "og:image") ?? ""
    )
  )
    fatal.push(`${t.path} og:image 변경됨`);
}

// ── 7. 홈 ────────────────────────────────────────────────────────────
const home = readHtml("/");
if (home) {
  if (
    !check(`/ 홈 title 불변`, titleOf(home) === FROZEN.homeTitle, titleOf(home) ?? "")
  )
    fatal.push("홈 title 변경됨");

  if (
    !check(`/ canonical 불변`, canonicalOf(home) === SITE_URL, canonicalOf(home) ?? "")
  )
    fatal.push("홈 canonical 변경됨");

  if (
    !check(
      `/ og:image 불변`,
      metaContent(home, "og:image") === FROZEN.ogImage["/"],
      metaContent(home, "og:image") ?? ""
    )
  )
    fatal.push("홈 og:image 변경됨");

  // 타깃 6개가 홈 본문에서 전부 링크되는가
  const hrefs = internalHrefs(home);
  const missing = TARGETS.filter((t) => !hrefs.includes(t.path)).map((t) => t.path);
  check(`/ 타깃 6개 전부 링크됨`, missing.length === 0, missing.join(", "));

  // 하위뎁스 직행 링크 — 허용 목록 밖은 경고
  const deep = hrefs.filter(
    (h) => h.split("/").filter(Boolean).length >= 2 && !HOME_ALLOWED_DEEP.includes(h)
  );
  results.push({
    name: `/ 하위뎁스 직행 링크 (허용 외)`,
    ok: null,
    detail: `${deep.length}건 — ${deep.slice(0, 8).join(", ")}${deep.length > 8 ? " …" : ""}`,
  });
} else {
  check("/ 빌드 산출물", false, "index.html 없음");
}

// ── 8. 사이트맵 출력 동결 ────────────────────────────────────────────
{
  const body = path.join(APP_DIR, "sitemap.xml.body");
  if (!fs.existsSync(body)) {
    check("사이트맵 산출물", false, "sitemap.xml.body 없음");
    fatal.push("사이트맵 산출물 없음");
  } else {
    const xml = fs.readFileSync(body, "utf-8");
    const locs = new Set(
      [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/\/$/, ""))
    );
    const missing = FROZEN.sitemapMustContain.filter((u) => !locs.has(u));
    if (
      !check(
        `사이트맵 핵심 URL ${FROZEN.sitemapMustContain.length}개 유지`,
        missing.length === 0,
        missing.join(", ")
      )
    )
      fatal.push("사이트맵에서 핵심 URL 이 사라짐");

    // 글 URL 은 전부 퍼센트 인코딩된 ASCII 여야 한다 — canonical 과 같은 표기.
    // 한글이 날것으로 나가면 canonical 과 문자열이 갈려 엔티티 병합이 실패한다.
    const nonAscii = [...locs].filter((u) =>
      [...u].some((ch) => ch.codePointAt(0) > 127)
    );
    check(
      "사이트맵 URL 이 전부 ASCII (인코딩 일관)",
      nonAscii.length === 0,
      nonAscii.slice(0, 3).join(", ")
    );
  }
}

// ── 출력 ─────────────────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
const width = Math.max(...results.map((r) => r.name.length)) + 2;

console.log("");
for (const r of results) {
  const mark = r.ok === null ? "INFO" : r.ok ? "PASS" : "FAIL";
  console.log(`  ${pad(mark, 6)} ${pad(r.name, width)} ${r.detail}`);
}

const failed = results.filter((r) => r.ok === false);
console.log(
  `\n요약: PASS ${results.filter((r) => r.ok === true).length} · FAIL ${failed.length} · INFO ${results.filter((r) => r.ok === null).length}`
);

if (fatal.length) {
  console.error(
    `\n중단 — 순위 방어 항목이 깨졌습니다:\n  ${fatal.join("\n  ")}\n되돌린 뒤 다시 실행하세요.`
  );
  process.exit(2);
}
process.exit(failed.length ? 1 : 0);
