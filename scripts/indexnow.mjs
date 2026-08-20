/**
 * IndexNow 제출 — 사이트맵의 URL 전체를 색인 엔진에 알린다.
 *
 * ## 왜 필요한가
 *
 * noindex 를 읽히는 것과 반대 방향의 문제다. 새 글은 크롤러가 **찾아올 때까지**
 * 색인되지 않고, 색인 안 된 페이지는 AI 가 읽을 방법이 없다.
 * IndexNow 는 "이 URL 이 바뀌었다"고 먼저 알리는 프로토콜이다.
 *
 * ## 의도적으로 하지 않는 것
 *
 * - **변경 감지를 하지 않는다.** 사이트맵 전체(현재 40개)를 통째로 보낸다.
 *   이 규모는 한 번에 보내도 되고, 변경 감지를 넣으면 디버깅할 표면만 늘어난다.
 * - **배포에 자동 연동하지 않는다.** `npm run indexnow` 로 사람이 실행한다.
 *   빌드 파이프라인에 네트워크 의존을 넣지 않는다 — 색인 제출이 실패했다고
 *   배포가 깨지면 안 된다.
 *
 * ## 지원 범위
 *
 * 네이버 서치어드바이저 · Bing 이 받는다. **구글은 IndexNow 를 지원하지 않는다** —
 * 구글은 Search Console 의 URL 검사로 따로 요청해야 한다.
 *
 * ## 키
 *
 * `public/{KEY}.txt` 에 키 문자열만 담긴 파일이 있어야 소유 증명이 된다.
 * 키를 바꾸면 파일도 함께 바꿀 것. 한 번 정하면 고정이다.
 *
 * 사용:
 *   npm run indexnow                 # 프로덕션 사이트맵 기준
 *   BASE=http://localhost:3000 npm run indexnow --  --dry   # 제출 없이 목록만
 */
import fs from "node:fs";
import path from "node:path";

const KEY = "4b40e15983157813d81df2a736350aac";
const HOST = "www.ilsanhan.com";
const BASE = process.env.BASE || `https://${HOST}`;
const DRY = process.argv.includes("--dry");

/** IndexNow 는 아무 엔드포인트에나 보내면 참여 엔진끼리 공유한다. 대표 2곳에 보낸다. */
const ENDPOINTS = [
  { name: "IndexNow(공용)", url: "https://api.indexnow.org/indexnow" },
  { name: "Bing", url: "https://www.bing.com/indexnow" },
];

function fail(msg) {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
}

// 키 파일이 없으면 제출해도 401 이 온다. 보내기 전에 잡는다.
const keyFile = path.join(process.cwd(), "public", `${KEY}.txt`);
if (!fs.existsSync(keyFile)) fail(`키 파일이 없다: public/${KEY}.txt`);
if (fs.readFileSync(keyFile, "utf-8").trim() !== KEY)
  fail(`키 파일 내용이 키와 다르다: public/${KEY}.txt`);

const res = await fetch(`${BASE}/sitemap.xml`);
if (!res.ok) fail(`사이트맵을 못 읽었다 — HTTP ${res.status} (${BASE}/sitemap.xml)`);
const xml = await res.text();

const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) fail("사이트맵에 URL 이 없다");

// 제출 대상은 항상 프로덕션 호스트다. 로컬 사이트맵으로 목록만 뽑는 경우를 위해 치환한다.
const urls = urlList.map((u) => u.replace(/^https?:\/\/[^/]+/, `https://${HOST}`));

console.log(`IndexNow — ${urls.length}개 URL (출처: ${BASE}/sitemap.xml)`);
console.log(`  키 파일: public/${KEY}.txt ✓`);

if (DRY) {
  console.log("\n--dry — 제출하지 않는다. 대상 목록:");
  urls.forEach((u) => console.log("  " + decodeURIComponent(u)));
  process.exit(0);
}

const body = JSON.stringify({
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: urls,
});

let ok = 0;
for (const ep of ENDPOINTS) {
  try {
    const r = await fetch(ep.url, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
    });
    // 200 = 접수, 202 = 접수(키 검증 대기). 나머지는 이유를 그대로 보여준다.
    const text = await r.text().catch(() => "");
    const mark = r.status === 200 || r.status === 202 ? "✓" : "✗";
    console.log(`  ${mark} ${ep.name.padEnd(16)} HTTP ${r.status}${text ? ` — ${text.slice(0, 120)}` : ""}`);
    if (mark === "✓") ok += 1;
  } catch (e) {
    console.log(`  ✗ ${ep.name.padEnd(16)} ${e.message}`);
  }
}

console.log(`\n${ok}/${ENDPOINTS.length} 엔드포인트 접수`);
console.log("구글은 IndexNow 미지원 — Search Console URL 검사로 따로 요청할 것.");
if (ok === 0) process.exit(1);
