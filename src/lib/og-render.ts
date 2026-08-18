import fs from "fs";
import path from "path";
import sharp from "sharp";
import {
  OG_HEIGHT,
  OG_WIDTH,
  ogImagePath,
  ogWebpPath,
  resolveOgSource,
} from "./og-image.ts";

/**
 * 파생 OG 이미지(1200x630) 생성기.
 *
 * 원본 img-N.png 는 본문에 삽입된 이미지와 같은 파일이므로 절대 변형하지 않는다.
 * 초음파·논문 figure 는 잘리면 정보가 손실되므로 crop 없이(contain) 흰 여백을 채우고,
 * 원본이 캔버스보다 작으면 확대하지 않아 화질을 보존한다.
 */

const PUBLIC_DIR = path.join(process.cwd(), "public");
const OG_BACKGROUND = { r: 255, g: 255, b: 255, alpha: 1 };
const SIZE_BUDGET_BYTES = 300 * 1024;

export interface RenderResult {
  bytes: number;
  /** 화면용 WebP 파생의 바이트 수 */
  webpBytes: number;
  srcW: number;
  srcH: number;
  innerW: number;
  innerH: number;
  mode: string;
}

export async function renderOgImage(
  srcAbs: string,
  destAbs: string,
  webpDestAbs?: string
): Promise<RenderResult> {
  const meta = await sharp(srcAbs).metadata();

  // 1) 캔버스 안에 들어가도록 축소 (확대는 하지 않음)
  const inner = await sharp(srcAbs)
    .resize(OG_WIDTH, OG_HEIGHT, { fit: "inside", withoutEnlargement: true })
    .flatten({ background: OG_BACKGROUND })
    .toBuffer({ resolveWithObject: true });

  const innerW = inner.info.width;
  const innerH = inner.info.height;

  // 2) 정확히 1200x630 인 흰 캔버스에 중앙 합성 (resize 반올림에 영향받지 않음)
  const base = sharp({
    create: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      channels: 3,
      background: OG_BACKGROUND,
    },
  }).composite([
    {
      input: inner.data,
      left: Math.floor((OG_WIDTH - innerW) / 2),
      top: Math.floor((OG_HEIGHT - innerH) / 2),
    },
  ]);

  // 300KB 예산: 무손실 PNG → 팔레트 양자화 → 색상수 축소 순으로 단계적 재인코딩
  const tiers: Array<[string, sharp.PngOptions]> = [
    ["png", { compressionLevel: 9 }],
    ["png(palette)", { compressionLevel: 9, palette: true, quality: 85, effort: 10 }],
    [
      "png(palette,64)",
      { compressionLevel: 9, palette: true, quality: 70, colours: 64, effort: 10 },
    ],
  ];

  let buf: Buffer = Buffer.alloc(0);
  let mode = "";
  for (const [name, opts] of tiers) {
    buf = await base.clone().png(opts).toBuffer();
    mode = name;
    if (buf.length <= SIZE_BUDGET_BYTES) break;
  }

  fs.mkdirSync(path.dirname(destAbs), { recursive: true });
  fs.writeFileSync(destAbs, buf);

  // 화면용 WebP 파생.
  //
  // og.png 를 대체하는 게 아니라 나란히 둔다 — og.png 는 og:image 메타와
  // JSON-LD image 가 계속 가리키고(카카오·네이버 크롤러 호환), og.webp 는
  // 화면 <img src> 전용이다. 같은 캔버스에서 나오므로 두 파일은 항상 같은
  // 그림, 같은 1200x630 이다.
  let webpBytes = 0;
  if (webpDestAbs) {
    const webp = await base.clone().webp({ quality: 82, effort: 5 }).toBuffer();
    fs.mkdirSync(path.dirname(webpDestAbs), { recursive: true });
    fs.writeFileSync(webpDestAbs, webp);
    webpBytes = webp.length;
  }

  return {
    bytes: buf.length,
    webpBytes,
    srcW: meta.width ?? 0,
    srcH: meta.height ?? 0,
    innerW,
    innerH,
    mode,
  };
}

export type GenerateOutcome =
  | { status: "created"; rel: string; source: string; via: string; render: RenderResult }
  | { status: "exists"; rel: string }
  | { status: "skipped"; reason: string };

/**
 * 글 1건의 og.png 를 생성한다. 소스가 없거나 이미 존재하면 건너뛴다.
 */
export async function generateOgImageForPost(
  slug: string,
  thumbnail: string,
  content: string,
  opts: { force?: boolean } = {}
): Promise<GenerateOutcome> {
  const destRel = ogImagePath(slug);
  const destAbs = path.join(PUBLIC_DIR, destRel.replace(/^\//, ""));
  const webpAbs = path.join(PUBLIC_DIR, ogWebpPath(slug).replace(/^\//, ""));

  // 둘 다 있을 때만 건너뛴다. png 만 있는 과거 글은 webp 를 채워야 한다.
  if (fs.existsSync(destAbs) && fs.existsSync(webpAbs) && !opts.force) {
    return { status: "exists", rel: destRel };
  }

  const source = resolveOgSource(slug, thumbnail, content);
  if (!source) return { status: "skipped", reason: "자사 이미지 없음" };

  const srcAbs = path.join(PUBLIC_DIR, source.rel.replace(/^\//, ""));
  if (!fs.existsSync(srcAbs)) {
    return { status: "skipped", reason: `원본 파일 없음 (${source.rel})` };
  }

  const render = await renderOgImage(srcAbs, destAbs, webpAbs);
  return { status: "created", rel: destRel, source: source.rel, via: source.via, render };
}
