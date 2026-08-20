/**
 * 글 제목 카드(OG 이미지) 생성.
 *
 *   public/blog-images/{id}/og.png   1200x630  ← og:image · JSON-LD image (social)
 *   public/blog-images/{id}/og.webp  1200x630  ← 화면 <img> (display)
 *
 * 사용법:
 *   node scripts/generate-title-cards.mjs --dry-run       대상만 출력
 *   node scripts/generate-title-cards.mjs --only=<파일ID>  한 편만
 *   node scripts/generate-title-cards.mjs                 없는 것만
 *   node scripts/generate-title-cards.mjs --force         이미 있어도 재생성
 *
 * ## 대상
 *
 * **프론트매터 slug 를 가진 글만** 만든다. 기존 연구 글 23편은 원본 사진을
 * 쓰고 있고 이미 og.png/og.webp 쌍이 있으므로 건드리지 않는다.
 * (slug 필드 유무가 "환자 질문 기반 새 글"과 "기존 연구 글"을 가르는 유일한
 *  기계적 표식이다 — 새 글에는 전부 있고 기존 글에는 하나도 없다)
 *
 * ## 폰트를 따로 두지 않는 이유
 *
 * next 가 번들한 @vercel/og 렌더러는 글리프가 없으면 폰트를 알아서 받아 쓴다.
 * NotoSerifKR woff2 는 3종 합계 2.9MB 인데다 satori 가 woff2 를 읽지 못해
 * 변환까지 필요하다. 렌더러 기본값을 쓰면 **폰트 파일을 하나도 안 늘리고**
 * 기존 진료 페이지 OG 7장과 같은 서체로 맞출 수 있다.
 * 대신 생성 시점에 네트워크가 필요하다 — 결과 PNG 는 커밋되므로 빌드에는 영향 없다.
 *
 * ## 파생 OG 쌍
 *
 * og.png 와 og.webp 는 **반드시 함께** 만든다. 한쪽만 있으면
 * validate-jsonld 의 "파생 OG 쌍" 검사가 실패한다.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import sharp from "sharp";

const { ImageResponse } = await import(
  "next/dist/compiled/@vercel/og/index.node.js"
);

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content");
const PUBLIC_DIR = path.join(ROOT, "public");
const CATEGORIES = ["pain", "diet", "autonomic", "skin", "blog"];

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING = 84;
/** 로고와 같은 도장 바탕색 — 여기서 색을 새로 정하지 않는다 */
const BG = "#1A1A1A";
const FG = "#FFFFFF";
const MUTED = "rgba(255,255,255,0.62)";
/** 산 마크의 높이(px). 브랜드 글자와 눈높이를 맞춘 값 */
const LOGO_MARK_HEIGHT = 58;

const argv = process.argv.slice(2);
const DRY_RUN = argv.includes("--dry-run");
const FORCE = argv.includes("--force");
const ONLY = argv.find((a) => a.startsWith("--only="))?.slice(7);
/**
 * 진료 안내 카드 모드 — 홈 `#treatment-list` ItemList 용.
 *
 * 홈의 진료 카드 7개가 카테고리 대표 OG 4장을 나눠 쓰고 있었다
 * (pain-og 3회 · autonomic-og 2회 중복). 카드 7장 중 3장이 같은 그림이면
 * 네이버가 캐러셀로 보지 않는다 — 경쟁사는 6개 전부 다른 이미지를 쓴다.
 *
 * 사진을 새로 찍는 대신 **글 카드와 같은 방식**으로 제목 카드를 만든다.
 * Line B 21편 OG 가 이미 이 디자인이라 톤이 맞고, 중복 해소가 목적이라면
 * 사진이 꼭 필요하지 않다.
 *
 *   node scripts/generate-title-cards.mjs --clinic-cards
 *   → public/images/cards/{key}.png (+ .webp)
 */
const CLINIC_CARDS_MODE = argv.includes("--clinic-cards");

/**
 * src/app/page.tsx 의 CLINIC_CARDS 사본.
 * .tsx 를 그대로 읽을 수 없어 heading 만 옮겨 둔다 —
 * 어긋나면 아래 검증에서 파일 수가 맞지 않아 드러난다.
 */
const CLINIC_CARDS = [
  { key: "pain-acute", heading: "급성 통증" },
  { key: "pain-chronic", heading: "만성 통증" },
  { key: "accident", heading: "교통사고" },
  { key: "internal-dyspepsia", heading: "소화불량" },
  { key: "autonomic-care", heading: "이명·어지럼·두통" },
  { key: "diet-program", heading: "다이어트 처방" },
  { key: "skin-spot", heading: "잡티 제거" },
];

/* ────────────────────────────────────────────────────────────
 * 레이아웃 계산
 * ────────────────────────────────────────────────────────── */

/** 한글은 1칸, 나머지는 반칸으로 세는 시각적 길이 */
function visualLength(text) {
  let n = 0;
  for (const ch of text) n += ch.codePointAt(0) > 0x2000 ? 1 : 0.5;
  return n;
}

/**
 * 제목 길이에 따른 글자 크기 3단계.
 *
 * 21편 제목이 17~29칸으로 제각각이라 한 크기로는 짧은 제목이 허전하고
 * 긴 제목이 넘친다. 카톡·네이버 피드에서 작게 표시되므로 큰 쪽에 여유를 둔다.
 */
function fontSizeFor(text) {
  const v = visualLength(text);
  if (v <= 20) return 78;
  if (v <= 26) return 66;
  return 56;
}

/**
 * 줄바꿈. 단어(공백) 경계에서 끊고, 공백 없는 긴 덩어리는 그 안에서 자른다.
 */
function wrapTitle(text, fontSize) {
  const budget = (WIDTH - PADDING * 2) / fontSize; // 한 줄에 들어가는 칸 수
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? line + " " + word : word;
    if (visualLength(candidate) <= budget || !line) {
      line = candidate;
      continue;
    }
    lines.push(line);
    line = word;
  }
  if (line) lines.push(line);

  const out = [];
  for (const l of lines) {
    if (visualLength(l) <= budget) {
      out.push(l);
      continue;
    }
    let buf = "";
    for (const ch of l) {
      if (visualLength(buf + ch) > budget && buf) {
        out.push(buf);
        buf = "";
      }
      buf += ch;
    }
    if (buf) out.push(buf);
  }
  return out;
}

/* ────────────────────────────────────────────────────────────
 * 카드
 * ────────────────────────────────────────────────────────── */

/**
 * 카드에 쓸 로고 마크.
 *
 * logo.png 는 512x512 도장이고 그 안에서 산 마크는 가운데 절반 정도만
 * 차지한다. 도장 바탕색이 카드 배경과 같아서 그대로 넣으면 마크가 실제
 * 크기의 절반으로 보인다.
 *
 * 그래서 배경색으로 한 번 깔고 그 색을 잘라낸다 — 도장 바탕이 배경과 같은
 * 색이므로 잘리고 **산 마크의 경계상자만** 남는다. 좌표를 이 파일에 옮겨
 * 적지 않아도 되고, 로고가 바뀌면 자동으로 따라간다.
 */
async function buildLogoMark() {
  // 한 파이프라인에 이어 붙이면 sharp 가 trim 을 flatten 보다 **먼저** 적용해
  // 아무것도 잘리지 않는다. 반드시 flatten 을 버퍼로 확정한 뒤 잘라야 한다.
  const flattened = await sharp(path.join(PUBLIC_DIR, "logo.png"))
    .flatten({ background: BG })
    .png()
    .toBuffer();
  const buf = await sharp(flattened)
    .trim({ background: BG, threshold: 12 })
    .png()
    .toBuffer();
  const meta = await sharp(buf).metadata();
  return {
    uri: "data:image/png;base64," + buf.toString("base64"),
    width: meta.width,
    height: meta.height,
  };
}

function card(title, mark) {
  const fontSize = fontSizeFor(title);
  const lines = wrapTitle(title, fontSize);

  return {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: BG,
        padding: PADDING + "px",
        fontFamily: "sans-serif",
      },
      children: [
        // 위쪽 빈 칸 — 제목이 세로 중앙에 오도록 아래 빈 칸과 균형을 잡는다
        { type: "div", props: { style: { display: "flex", flex: 1 } } },

        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              color: FG,
              fontSize,
              fontWeight: 700,
              lineHeight: 1.34,
              letterSpacing: -1.5,
            },
            children: lines.map((l) => ({
              type: "div",
              props: { style: { display: "flex" }, children: l },
            })),
          },
        },

        {
          type: "div",
          props: {
            style: { display: "flex", flex: 1, alignItems: "flex-end" },
            children: {
              type: "div",
              props: {
                style: { display: "flex", alignItems: "center" },
                children: [
                  {
                    type: "img",
                    props: {
                      src: mark.uri,
                      height: LOGO_MARK_HEIGHT,
                      width: Math.round(
                        (mark.width / mark.height) * LOGO_MARK_HEIGHT
                      ),
                    },
                  },
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        marginLeft: 18,
                        fontSize: 30,
                        color: MUTED,
                        letterSpacing: 1,
                      },
                      children: "일산한의원",
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  };
}

async function renderCard(title, mark) {
  const res = new ImageResponse(card(title, mark), {
    width: WIDTH,
    height: HEIGHT,
  });
  return Buffer.from(await res.arrayBuffer());
}

/* ────────────────────────────────────────────────────────────
 * 대상 수집
 * ────────────────────────────────────────────────────────── */

function collect() {
  const out = [];
  for (const category of CATEGORIES) {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
      // 프론트매터 slug 가 없는 글(기존 연구 글)은 대상이 아니다
      if (!data.slug) continue;
      out.push({
        id: file.replace(/\.md$/, ""),
        category,
        title: String(data.title || ""),
      });
    }
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

/* ────────────────────────────────────────────────────────────
 * 실행
 * ────────────────────────────────────────────────────────── */

/** 진료 안내 카드 7장. 글 카드와 같은 렌더러를 쓴다. */
async function generateClinicCards() {
  const outDir = path.join(PUBLIC_DIR, "images", "cards");
  fs.mkdirSync(outDir, { recursive: true });

  const mark = await buildLogoMark();
  console.log(
    "로고 마크 " + mark.width + "x" + mark.height + " (logo.png 에서 잘라냄)\n"
  );

  const pad = (s, n) => String(s).padEnd(n);
  for (const c of CLINIC_CARDS) {
    const png = path.join(outDir, c.key + ".png");
    const webp = path.join(outDir, c.key + ".webp");
    const exists = fs.existsSync(png);
    if (exists && !FORCE) {
      console.log("  " + pad("건너뜀", 8) + pad(c.key, 20) + "이미 있음 (--force 로 재생성)");
      continue;
    }
    const buf = await renderCard(c.heading, mark);
    fs.writeFileSync(png, buf);
    await sharp(buf).webp({ quality: 82 }).toFile(webp);
    console.log(
      "  " + pad(exists ? "재생성" : "생성", 8) + pad(c.key, 20) +
      c.heading + " · png " + Math.round(fs.statSync(png).size / 1024) + "KB"
    );
  }

  /* 검증 — 쓴 파일을 다시 읽는다. 중복 제거가 목적이므로
     **치수뿐 아니라 파일 내용이 서로 다른지**까지 본다. */
  console.log("\n검증 (파일을 다시 읽어 확인)");
  const hashes = new Map();
  let bad = 0;
  for (const c of CLINIC_CARDS) {
    const png = path.join(outDir, c.key + ".png");
    const webp = path.join(outDir, c.key + ".webp");
    if (!fs.existsSync(png) || !fs.existsSync(webp)) {
      console.log("  FAIL " + c.key + " — 쌍이 갖춰지지 않음");
      bad += 1;
      continue;
    }
    const m = await sharp(png).metadata();
    const ok = m.width === WIDTH && m.height === HEIGHT;
    if (!ok) bad += 1;
    const hash = (await import("node:crypto"))
      .createHash("sha1")
      .update(fs.readFileSync(png))
      .digest("hex")
      .slice(0, 10);
    if (hashes.has(hash)) {
      console.log(`  FAIL ${c.key} — ${hashes.get(hash)} 와 내용이 같다 (중복)`);
      bad += 1;
    } else {
      hashes.set(hash, c.key);
    }
    console.log(
      "  " + (ok ? "PASS" : "FAIL") + " " + pad(c.key, 20) + m.width + "x" + m.height + " · " + hash
    );
  }
  console.log(`\n고유 이미지 ${hashes.size}종 / ${CLINIC_CARDS.length}개`);
  if (bad) {
    console.error("검증 실패 " + bad + "건.");
    process.exit(1);
  }
  console.log("전부 통과.");
}

async function main() {
  if (CLINIC_CARDS_MODE) return generateClinicCards();

  let targets = collect();
  if (ONLY) targets = targets.filter((t) => t.id === ONLY);
  if (!targets.length) {
    console.error(ONLY ? "대상 없음: " + ONLY : "대상 글이 없습니다.");
    process.exit(1);
  }

  const pad = (s, n) => String(s).padEnd(n);
  const rows = [];
  const mark = DRY_RUN ? null : await buildLogoMark();
  if (mark) {
    console.log(
      "로고 마크 " + mark.width + "x" + mark.height + " (logo.png 에서 잘라냄)"
    );
  }

  for (const t of targets) {
    const dir = path.join(PUBLIC_DIR, "blog-images", t.id);
    const png = path.join(dir, "og.png");
    const webp = path.join(dir, "og.webp");
    const exists = fs.existsSync(png) && fs.existsSync(webp);
    const size = fontSizeFor(t.title);
    const lineCount = wrapTitle(t.title, size).length;

    if (exists && !FORCE) {
      rows.push({ id: t.id, status: "skip (이미 있음)", detail: "" });
      continue;
    }
    if (DRY_RUN) {
      rows.push({ id: t.id, status: "would-create", detail: size + "px · " + lineCount + "줄" });
      continue;
    }

    const buf = await renderCard(t.title, mark);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(png, buf);
    // 화면용 WebP 는 같은 원본에서 파생한다 — 한쪽만 생기면 쌍 대조가 실패한다
    await sharp(buf).webp({ quality: 82 }).toFile(webp);

    rows.push({
      id: t.id,
      status: exists ? "재생성" : "생성",
      detail:
        size + "px · " + lineCount + "줄 · png " +
        Math.round(fs.statSync(png).size / 1024) + "KB · webp " +
        Math.round(fs.statSync(webp).size / 1024) + "KB",
    });
  }

  console.log("\n" + (DRY_RUN ? "[DRY RUN] " : "") + "대상 " + rows.length + "편\n");
  for (const r of rows) console.log("  " + pad(r.status, 16) + " " + pad(r.id, 18) + " " + r.detail);

  if (DRY_RUN) return;

  // 검증: 쓴 파일을 다시 읽어 치수와 쌍을 확인한다
  console.log("\n검증 (파일을 다시 읽어 확인)");
  let bad = 0;
  for (const t of targets) {
    const dir = path.join(PUBLIC_DIR, "blog-images", t.id);
    const png = path.join(dir, "og.png");
    const webp = path.join(dir, "og.webp");
    if (!fs.existsSync(png) || !fs.existsSync(webp)) {
      console.log("  FAIL " + t.id + " — 쌍이 갖춰지지 않음");
      bad += 1;
      continue;
    }
    const p = await sharp(png).metadata();
    const w = await sharp(webp).metadata();
    const ok =
      p.width === WIDTH && p.height === HEIGHT && w.width === WIDTH && w.height === HEIGHT;
    if (!ok) bad += 1;
    console.log(
      "  " + (ok ? "PASS" : "FAIL") + " " + pad(t.id, 18) +
      " png " + p.width + "x" + p.height + " · webp " + w.width + "x" + w.height
    );
  }
  if (bad) {
    console.error("\n검증 실패 " + bad + "건.");
    process.exit(1);
  }
  console.log("\n전부 통과.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
