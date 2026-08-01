/**
 * 히어로 하단 풀블리드 밴드용 한의사 6인 단체사진 에셋 생성.
 *
 * 원본(1916x821)은 배경이 #CECBCE 계열 회색이라 사이트 크림 배경(#fdfbf7)과
 * 맞닿으면 경계가 그대로 보인다. 여기서 밝기를 올려 델타를 줄이고,
 * 밴드 비율에 맞춰 미리 크롭해 CSS 쪽 object-position 추측을 없앤다.
 *
 * 실행: node scripts/generate-hero-team.mjs
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
// 원본은 public/ 밖에 둔다 — 1.6MB 원본이 배포에 실려나가지 않게.
const SRC = path.join(ROOT, "assets", "hero-team-src.png");
const OUT_DIR = path.join(ROOT, "public", "images");

// 원본 좌표 기준 얼굴 위치: 머리 상단 y≈110, 턱 y≈300.
// 데스크톱은 4:1 밴드 — 머리 위 여백을 남겨 상단 페이드가 이마를 먹지 않게 한다.
const DESKTOP = { left: 0, top: 43, width: 1916, height: 479 };
// 모바일은 가운데 3인 중심 크롭. 파노라마를 그대로 쓰면 얼굴이 뭉개진다.
const MOBILE = { left: 560, top: 40, width: 960, height: 505 };

// 회색 배경을 크림 쪽으로 끌어올린다. 가운 하이라이트가 약간 클리핑되지만
// 흰 가운이라 육안상 손실이 없고, 배경 델타는 47 → 26 수준으로 줄어든다.
const BRIGHTNESS = 1.1;

async function emit(name, region, width) {
  const base = sharp(SRC)
    .extract(region)
    .resize({ width, withoutEnlargement: true })
    .modulate({ brightness: BRIGHTNESS });

  await base.clone().webp({ quality: 82 }).toFile(path.join(OUT_DIR, `${name}.webp`));
  await base.clone().avif({ quality: 58 }).toFile(path.join(OUT_DIR, `${name}.avif`));

  for (const ext of ["webp", "avif"]) {
    const p = path.join(OUT_DIR, `${name}.${ext}`);
    const kb = (fs.statSync(p).size / 1024).toFixed(1);
    console.log(`  ${name}.${ext.padEnd(4)} ${String(width).padStart(4)}w  ${kb} KB`);
  }
}

async function main() {
  if (!fs.existsSync(SRC)) {
    console.error(`원본이 없습니다: ${SRC}`);
    process.exit(1);
  }
  console.log("hero-team 에셋 생성");
  await emit("hero-team", DESKTOP, 1920);
  await emit("hero-team-mobile", MOBILE, 960);
}

main();
