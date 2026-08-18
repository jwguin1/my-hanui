import fs from "fs";
import path from "path";

/**
 * 이미지 파일의 실제 픽셀 크기를 헤더만 읽어 알아낸다.
 *
 * sharp 를 쓰지 않는다 — og-image.ts 와 같은 이유로, 페이지 렌더링 경로에서
 * 호출되므로 가볍게 유지한다. 필요한 건 width/height 두 숫자뿐이라
 * PNG/JPEG/WebP 헤더 파싱으로 충분하다.
 *
 * 쓰는 곳: PostCard 의 width/height 속성. 파생 OG(1200x630)가 없는 글은
 * 원본 썸네일을 그대로 쓰는데, 여기에 1200x630 을 박아두면 종횡비가 틀린다.
 */

const PUBLIC_DIR = path.join(process.cwd(), "public");

export interface ImageSize {
  width: number;
  height: number;
}

/** PNG: 8바이트 시그니처 뒤 IHDR 청크에 폭·높이가 빅엔디안 4바이트씩 들어 있다. */
function readPng(buf: Buffer): ImageSize | null {
  if (buf.length < 24) return null;
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** JPEG: SOF0~SOF15 마커(C0~CF, C4/C8/CC 제외)의 페이로드 앞부분에 높이·폭이 있다. */
function readJpeg(buf: Buffer): ImageSize | null {
  if (buf.length < 4 || buf.readUInt16BE(0) !== 0xffd8) return null;
  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buf[offset + 1];
    const isSof =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;
    const length = buf.readUInt16BE(offset + 2);
    if (isSof) {
      return {
        height: buf.readUInt16BE(offset + 5),
        width: buf.readUInt16BE(offset + 7),
      };
    }
    offset += 2 + length;
  }
  return null;
}

/** WebP: RIFF 컨테이너. VP8/VP8L/VP8X 세 형식마다 크기 위치가 다르다. */
function readWebp(buf: Buffer): ImageSize | null {
  if (buf.length < 30) return null;
  if (buf.toString("ascii", 0, 4) !== "RIFF") return null;
  if (buf.toString("ascii", 8, 12) !== "WEBP") return null;

  const format = buf.toString("ascii", 12, 16);
  if (format === "VP8 ") {
    return {
      width: buf.readUInt16LE(26) & 0x3fff,
      height: buf.readUInt16LE(28) & 0x3fff,
    };
  }
  if (format === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  if (format === "VP8X") {
    const w = buf[24] | (buf[25] << 8) | (buf[26] << 16);
    const h = buf[27] | (buf[28] << 8) | (buf[29] << 16);
    return { width: w + 1, height: h + 1 };
  }
  return null;
}

/**
 * public/ 기준 절대경로(`/images/foo.png`)의 실제 크기.
 * 외부 URL이거나 파일이 없거나 형식을 못 읽으면 null.
 */
export function imageSize(publicPath: string): ImageSize | null {
  if (!publicPath || /^https?:\/\//.test(publicPath)) return null;
  const abs = path.join(PUBLIC_DIR, publicPath.replace(/^\//, ""));
  // JPEG 는 EXIF 세그먼트가 앞에 붙어 SOF 마커가 한참 뒤에 오므로
  // 64바이트로는 부족하다. 64KB 면 실무상 충분하고 여전히 싸다.
  let buf: Buffer;
  try {
    const fd = fs.openSync(abs, "r");
    const chunk = Buffer.alloc(65536);
    const read = fs.readSync(fd, chunk, 0, 65536, 0);
    fs.closeSync(fd);
    buf = chunk.subarray(0, read);
  } catch {
    return null;
  }
  const size = readPng(buf) ?? readJpeg(buf) ?? readWebp(buf);
  if (!size || !size.width || !size.height) return null;
  return size;
}
