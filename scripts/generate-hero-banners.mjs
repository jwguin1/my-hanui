/**
 * 네이버 캐러셀 대응 — 카테고리 6종 히어로 배너(1080x1080) 생성.
 *
 *   public/images/hero/{slug}-hero.png
 *
 * 네이버는 og:image 가 아니라 "본문 최상단의 페이지 내 최대 이미지"를 카드
 * 썸네일로 쓴다. 그래서 각 타깃 페이지 최상단에 1:1 배너를 하나씩 깔아준다.
 *
 * 사진 소스 우선순위:
 *   1) scripts/banner-sources/{slug}.{jpg,jpeg,png,webp}   ← 나중에 실사로 교체할 자리
 *   2) SOURCES[slug].fallback (기존 OG 실사 사진)
 *   3) 둘 다 없으면 사진 없이 그라디언트만
 *
 * 텍스트는 SVG 로 얹고 시스템 한글 폰트(Malgun Gothic)를 쓴다. 즉 이 스크립트는
 * "로컬에서 돌려 PNG 를 커밋하는" 빌드 전 단계다 — 배포 호스트(리눅스)에서
 * 실행되지 않으므로 폰트 유무를 신경 쓸 필요가 없다.
 *
 * 실행: npm run banners
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "images", "hero");
const SRC_DIR = path.join(ROOT, "scripts", "banner-sources");

const SIZE = 1080;
const PHOTO_H = 648; // 상단 60% 는 사진, 하단 40% 는 카피
const TEXT_TOP = PHOTO_H;

const COLOR = {
  bg: "#fdfbf7",
  surface: "#f7f2ea",
  line: "#efe7db",
  ink: "#2a211a",
  primary: "#6b4226",
  tanSoft: "#b99b72",
  muted: "#857c73",
};

const FONT = "Malgun Gothic, Apple SD Gothic Neo, Noto Sans KR, sans-serif";

/**
 * slug 별 카피와 사진 소스.
 * title 은 페이지 title / 네비 앵커의 앞부분과 같은 문구를 쓴다 —
 * 네이버가 라벨을 어디서 뽑든 같은 말이 나오게 하기 위함.
 */
const BANNERS = [
  {
    slug: "pain",
    title: "통증 · 근골격",
    sub: "추나 · 초음파 유도 약침",
    foot: "이마트 풍산점 3층 · 031-976-7706",
    fallback: "public/images/pain-og.jpg",
    position: "centre",
  },
  {
    slug: "diet",
    title: "한방 다이어트",
    sub: "일산감비환 · 체질 처방",
    foot: "연간 8,000건 이상 처방",
    fallback: "public/images/diet-og.jpg",
    position: "centre",
  },
  {
    slug: "skin",
    title: "피부 · 레이저",
    sub: "CO₂ 레이저 · 점 · 편평사마귀",
    foot: "부위별 비용 전체 공개",
    fallback: "public/images/skin-og.jpg",
    position: "centre",
  },
  {
    slug: "doctor",
    title: "의료진",
    sub: "한의사 6인 협진",
    foot: "근골격 · 내과 · 다이어트 · 피부",
    fallback: "public/images/doctor-og.jpg",
    position: "centre",
  },
  {
    slug: "about",
    title: "병원 소개",
    sub: "이마트 풍산점 3층",
    foot: "건강보험 우선 진료 · 초음파 진단",
    fallback: "public/og-image.jpg",
    position: "centre",
  },
  {
    slug: "contact",
    title: "오시는 길",
    sub: "경의중앙선 풍산역 2번출구",
    foot: "도보 1분 · 무료주차 3시간",
    fallback: "public/og-image.jpg",
    // 소스가 4:3(1448x1086) 이마트 외관이라 가로 기준으로 맞추면 세로가 남는다.
    // centre 로 잘라 위쪽 하늘과 아래쪽 도로를 균등하게 덜어낸다 —
    // emart 간판(상단 14%)과 매장입구(하단 80%)가 둘 다 살아남는 지점이다.
    position: "centre",
  },
];

const EXTS = [".jpg", ".jpeg", ".png", ".webp"];

function resolveSource(banner) {
  for (const ext of EXTS) {
    const p = path.join(SRC_DIR, `${banner.slug}${ext}`);
    if (fs.existsSync(p)) return { file: p, via: "banner-sources" };
  }
  if (banner.fallback) {
    const p = path.join(ROOT, banner.fallback);
    if (fs.existsSync(p)) return { file: p, via: "fallback" };
  }
  return null;
}

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** 사진이 없을 때 쓰는 배경 (그라디언트만) */
function gradientSvg() {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${PHOTO_H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${COLOR.surface}"/>
      <stop offset="100%" stop-color="${COLOR.tanSoft}"/>
    </linearGradient>
  </defs>
  <rect width="${SIZE}" height="${PHOTO_H}" fill="url(#g)"/>
</svg>`);
}

/** 카피 블록 + 사진 하단 페이드 */
function textSvg({ title, sub, foot }) {
  const cx = SIZE / 2;
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}">
  <defs>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${COLOR.bg}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${COLOR.bg}" stop-opacity="1"/>
    </linearGradient>
  </defs>

  <!-- 사진 하단을 크림 배경으로 흘려보내 경계선을 없앤다 -->
  <rect x="0" y="${PHOTO_H - 110}" width="${SIZE}" height="110" fill="url(#fade)"/>

  <text x="${cx}" y="${TEXT_TOP + 78}" text-anchor="middle"
        font-family="${FONT}" font-size="30" font-weight="600"
        letter-spacing="6" fill="${COLOR.tanSoft}">일산한의원</text>

  <text x="${cx}" y="${TEXT_TOP + 186}" text-anchor="middle"
        font-family="${FONT}" font-size="76" font-weight="700"
        fill="${COLOR.ink}">${esc(title)}</text>

  <text x="${cx}" y="${TEXT_TOP + 258}" text-anchor="middle"
        font-family="${FONT}" font-size="38" font-weight="500"
        fill="${COLOR.primary}">${esc(sub)}</text>

  <line x1="${cx - 60}" y1="${TEXT_TOP + 306}" x2="${cx + 60}" y2="${TEXT_TOP + 306}"
        stroke="${COLOR.line}" stroke-width="3"/>

  <text x="${cx}" y="${TEXT_TOP + 364}" text-anchor="middle"
        font-family="${FONT}" font-size="30" font-weight="400"
        fill="${COLOR.muted}">${esc(foot)}</text>
</svg>`);
}

async function build(banner) {
  const source = resolveSource(banner);

  const photo = source
    ? await sharp(source.file)
        .resize(SIZE, PHOTO_H, { fit: "cover", position: banner.position })
        .toBuffer()
    : await sharp(gradientSvg()).png().toBuffer();

  // 최상단 비-lazy 이미지라 용량이 곧 LCP 다. 같은 배너가 PNG 로는 0.4~1.3MB,
  // mozjpeg q84 로는 100~200KB — 육안 차이 없이 8배 가볍다.
  const out = path.join(OUT_DIR, `${banner.slug}-hero.jpg`);
  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: COLOR.bg,
    },
  })
    .composite([
      { input: photo, top: 0, left: 0 },
      { input: textSvg(banner), top: 0, left: 0 },
    ])
    .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(out);

  const kb = (fs.statSync(out).size / 1024).toFixed(1);
  return { out, via: source ? `${source.via}: ${path.relative(ROOT, source.file)}` : "gradient", kb };
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`히어로 배너 ${SIZE}x${SIZE} 생성\n`);

  for (const banner of BANNERS) {
    const r = await build(banner);
    console.log(
      `  ${banner.slug.padEnd(8)} ${String(r.kb).padStart(7)} KB   ${r.via}`
    );
  }

  console.log(
    `\n완료 — ${path.relative(ROOT, OUT_DIR)}/*.jpg\n` +
      `실사 교체: scripts/banner-sources/{slug}.jpg 를 넣고 npm run banners`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
