/**
 * public/logo.svg → 파비콘 · 앱 아이콘 · 스키마용 로고 일괄 생성.
 *
 *   public/logo.png         512x512  ← JSON-LD #logo(ImageObject) 가 참조
 *   src/app/icon.png        512x512  ← App Router 파일 규칙 (rel="icon")
 *   src/app/apple-icon.png  180x180  ← 〃 (rel="apple-touch-icon")
 *   src/app/favicon.ico     32 + 48  ← 〃 (rel="icon" type=image/x-icon)
 *
 * 사용법:
 *   node scripts/build-icons.mjs             없는 것만 생성
 *   node scripts/build-icons.mjs --force     이미 있어도 재생성
 *   node scripts/build-icons.mjs --dry-run   대상 목록만 출력
 *
 * 주의
 * - metadata.icons 를 layout.tsx 에 손으로 쓰지 않는다. 파일 규칙과 충돌해
 *   <head> 에 중복 <link rel="icon"> 이 생긴다. 이 스크립트가 놓는 파일만이
 *   아이콘의 단일 소스다.
 * - apple-icon 만 배경을 불투명하게 채운다. iOS 는 투명 픽셀을 검게 칠하는데,
 *   원본은 40px 바깥 여백이 투명이라 그대로 두면 도장 모서리가 뭉갠다.
 *   채우는 색은 로고가 이미 쓰고 있는 도장 바탕색이다(새 색을 만들지 않는다).
 * - .ico 는 sharp 로 못 만든다. png-to-ico 로 32/48 두 장을 묶는다.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, "public", "logo.svg");

/** logo.svg 의 도장 바탕(rect fill)과 같은 값 — 여기서 색을 새로 정하지 않는다. */
const OPAQUE_BG = "#1A1A1A";

const argv = process.argv.slice(2);
const FORCE = argv.includes("--force");
const DRY_RUN = argv.includes("--dry-run");

/** PNG 산출물. ico 는 크기가 여럿이라 아래에서 따로 만든다. */
const PNG_TARGETS = [
  { out: "public/logo.png", size: 512, flatten: false },
  { out: "src/app/icon.png", size: 512, flatten: false },
  { out: "src/app/apple-icon.png", size: 180, flatten: true },
];

/** favicon.ico 에 묶을 크기들 */
const ICO_OUT = "src/app/favicon.ico";
const ICO_SIZES = [32, 48];

/**
 * SVG → PNG 버퍼.
 * density 를 올려야 벡터가 목표 크기에서 래스터화된다 — 기본값으로 두면
 * 72dpi 로 그린 뒤 확대해 가장자리가 뭉갠다.
 */
async function render(size, flatten) {
  const density = Math.max(72, Math.round((size / 512) * 72 * 8));
  let img = sharp(SOURCE, { density }).resize(size, size, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (flatten) img = img.flatten({ background: OPAQUE_BG });
  return img.png({ compressionLevel: 9 }).toBuffer();
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`원본이 없습니다: ${path.relative(ROOT, SOURCE)}`);
    process.exit(1);
  }

  const rows = [];

  for (const t of PNG_TARGETS) {
    const abs = path.join(ROOT, t.out);
    const exists = fs.existsSync(abs);
    if (exists && !FORCE) {
      rows.push({ out: t.out, status: "skip (이미 있음)", detail: "" });
      continue;
    }
    if (DRY_RUN) {
      rows.push({ out: t.out, status: "would-create", detail: `${t.size}x${t.size}` });
      continue;
    }
    const buf = await render(t.size, t.flatten);
    ensureDir(abs);
    fs.writeFileSync(abs, buf);
    rows.push({
      out: t.out,
      status: exists ? "재생성" : "생성",
      detail: `${t.size}x${t.size}${t.flatten ? ` · 배경 ${OPAQUE_BG}` : " · 투명"}`,
    });
  }

  // favicon.ico — 멀티 사이즈
  {
    const abs = path.join(ROOT, ICO_OUT);
    const exists = fs.existsSync(abs);
    if (exists && !FORCE) {
      rows.push({ out: ICO_OUT, status: "skip (이미 있음)", detail: "" });
    } else if (DRY_RUN) {
      rows.push({ out: ICO_OUT, status: "would-create", detail: ICO_SIZES.join(" + ") });
    } else {
      const buffers = [];
      for (const size of ICO_SIZES) buffers.push(await render(size, false));
      const ico = await pngToIco(buffers);
      ensureDir(abs);
      fs.writeFileSync(abs, ico);
      rows.push({
        out: ICO_OUT,
        status: exists ? "재생성" : "생성",
        detail: ICO_SIZES.map((s) => `${s}x${s}`).join(" + "),
      });
    }
  }

  const pad = (s, n) => String(s).padEnd(n);
  console.log(`\n${DRY_RUN ? "[DRY RUN] " : ""}원본 ${path.relative(ROOT, SOURCE)}\n`);
  for (const r of rows) {
    console.log(`  ${pad(r.status, 16)} ${pad(r.out, 24)} ${r.detail}`);
  }

  if (DRY_RUN) return;

  // ── 검증: 쓴 파일을 다시 읽어 실제 픽셀 크기를 확인한다 ─────────────
  console.log("\n검증 (파일을 다시 읽어 확인)");
  let bad = 0;

  for (const t of PNG_TARGETS) {
    const abs = path.join(ROOT, t.out);
    if (!fs.existsSync(abs)) {
      console.log(`  FAIL ${t.out} — 파일 없음`);
      bad += 1;
      continue;
    }
    const meta = await sharp(abs).metadata();
    const sizeOk = meta.width === t.size && meta.height === t.size;
    // apple-icon 은 알파가 남아 있으면 iOS 에서 검게 나온다
    const alphaOk = t.flatten ? !meta.hasAlpha : true;
    const ok = sizeOk && alphaOk;
    if (!ok) bad += 1;
    console.log(
      `  ${ok ? "PASS" : "FAIL"} ${pad(t.out, 24)} ${meta.width}x${meta.height} · ${meta.format}` +
        ` · alpha=${meta.hasAlpha ? "yes" : "no"}` +
        (sizeOk ? "" : ` (기대 ${t.size}x${t.size})`) +
        (alphaOk ? "" : " (불투명이어야 함)")
    );
  }

  {
    const abs = path.join(ROOT, ICO_OUT);
    if (!fs.existsSync(abs)) {
      console.log(`  FAIL ${ICO_OUT} — 파일 없음`);
      bad += 1;
    } else {
      // ICO 헤더를 직접 읽는다 — sharp 는 ico 를 못 읽는다.
      // 0x00: reserved(0) / 0x02: type(1=icon) / 0x04: count
      // 이후 16바이트 디렉터리 엔트리마다 [0]=width, [1]=height (0 은 256 을 뜻함)
      const buf = fs.readFileSync(abs);
      const count = buf.readUInt16LE(4);
      const entries = [];
      for (let i = 0; i < count; i += 1) {
        const off = 6 + i * 16;
        entries.push(`${buf[off] || 256}x${buf[off + 1] || 256}`);
      }
      const expected = ICO_SIZES.map((s) => `${s}x${s}`);
      const ok =
        buf.readUInt16LE(0) === 0 &&
        buf.readUInt16LE(2) === 1 &&
        expected.every((e) => entries.includes(e));
      if (!ok) bad += 1;
      console.log(
        `  ${ok ? "PASS" : "FAIL"} ${pad(ICO_OUT, 24)} ${entries.join(" + ")}` +
          (ok ? "" : ` (기대 ${expected.join(" + ")})`)
      );
    }
  }

  if (bad) {
    console.error(`\n검증 실패 ${bad}건.`);
    process.exit(1);
  }
  console.log("\n전부 통과.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
