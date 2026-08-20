/**
 * JSON-LD 참조 무결성 검증기.
 *
 * 사용법:
 *   npm run build && npm run start   (다른 터미널)
 *   npm run verify:jsonld            (기본 http://localhost:3000)
 *   BASE=http://localhost:3001 npm run verify:jsonld
 *
 * 검사 항목
 *  1. 페이지당 <script type="application/ld+json"> 이 정확히 1개
 *  2. 최상위가 @context + @graph 하나
 *  3. 한 그래프 안에 중복된 @id 가 없다
 *  4. 참조({"@id": ...} 만 있는 객체)가 가리키는 노드가 같은 그래프에 존재한다
 *     — 단, @type + @id + 최소 속성을 갖춘 "교차 페이지 스텁"은 정상으로 본다.
 *       (목록 페이지의 Article 은 그 글 상세 페이지에 정의된 엔티티의 스텁이다)
 *  5. 모든 최상위 노드가 @id 를 가진다 (100%)
 *  6. 한 URL 에 페이지 노드(#webpage)는 하나뿐이다
 *  7. BreadcrumbList 가 존재하고, 모든 항목이 item URL 을 가진다
 *  8. 회귀 확인: MedicalClinic·LocalBusiness / WebSite / sameAs 4개
 *  9. 신선도 가드 — 검사 대상이 정말 최신 빌드인가
 * 10. 파생 OG 쌍 — 발행된 글마다 og.png 와 og.webp 가 둘 다 있는가
 * 11. 슬러그 규칙 — 허용 문자 · 길이 · 예약어 · NFC 정규형
 * 12. URL 일관성 — canonical / og:url / JSON-LD @id 가 같은 문자열인가
 * 13. 슬러그 변경 감지 — 프로덕션 사이트맵에 있던 글 URL 이 사라졌는데
 *     리다이렉트가 없으면 실패. 필요한 리다이렉트 규칙을 출력한다.
 * 14. FAQ 파싱 가드 — 본문에 "자주 묻는 질문" 섹션이 있는데 한 쌍도
 *     못 뽑히면 실패. 본문 파싱 방식의 약점을 조용한 실패가 아니라
 *     요란한 실패로 바꾸는 장치다.
 *
 * 슬러그 규칙(11)과 FAQ 가드(14)는 **미발행 글도 검사한다.**
 * 발행 전에 잡는 것이 검사의 목적인데 미발행을 건너뛰면 앞뒤가 안 맞는다.
 *
 * 9번이 있는 이유: 이전 개발 서버가 :3000 을 물고 있으면 새 서버가
 * EADDRINUSE 로 죽고, 검증기는 예데로 응답하는 옛 빌드를 검사해
 * 통과를 낸다. "검사 대상이 최신인가"를 검사하지 않는 검증기는
 * 언제든 같은 방식으로 거짓 통과를 낸다.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  RESERVED_BY_CATEGORY,
  normalizeSlug,
  postPath,
  validateSlug,
} from "../src/lib/slug.ts";
import { hasFaqSection, parsePostFaq } from "../src/lib/post-faq.ts";
import { CLINIC } from "../src/lib/clinic.ts";
import { DOCTOR_SLUGS } from "../src/lib/schema.ts";

/**
 * 좌표가 들어 있어야 할 범위 — 고양시를 넉넉히 감싼다.
 *
 * **이 범위 검사가 핵심이다.** clinic.ts 값과 JSON-LD 출력을 대조하는 것만으로는
 * clinic.ts 자체가 틀렸을 때 사이좋게 통과한다. 실제로 그런 일이 있었다 —
 * 2026-03-29 에 들어온 37.7636/126.7735 가 실제 위치에서 10km 벗어난 채
 * 144일간 살아 있었고, 그동안 이 검증기의 모든 검사가 통과였다.
 *
 * "출력이 존재하는가"가 아니라 "값이 맞는가"를 보는 검사가 없으면
 * 구조화 데이터가 정교할수록 오류가 오래 살아남는다.
 */
const GEO_BOUNDS = { latMin: 37.6, latMax: 37.72, lngMin: 126.72, lngMax: 126.92 };

/**
 * JSON-LD 에 절대 나오면 안 되는 문자열.
 *
 * Phase 1 에서 전부 걷어낸 표현들이다. 지금은 누가 다시 넣어도 아무것도
 * 잡히지 않는다 — 좌표가 144일 살아남은 것과 같은 구조다.
 * 값 검사는 어렵지만 금지어 검사는 비용이 거의 없다.
 *
 *   전문의·인증의   일산한의원에 해당 자격 보유자가 없다 (의료법 제56조)
 *   초음파사        RMSK 는 의사 자격이고 sonographer 등급은 ARDMS 의 RMSKS 다
 *   RMDS           APCA 가 발급하지 않는 조합 — 존재하지 않는 자격
 *   대학병원급      검증 불가능한 비교 표현
 */
const FORBIDDEN_IN_JSONLD = ["전문의", "인증의", "초음파사", "RMDS", "대학병원급"];

/** "HH:MM" → 분. 형식이 아니면 null. */
function toMinutes(hhmm) {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm ?? "");
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

const BASE = process.env.BASE || "http://localhost:3000";
/**
 * 슬러그 변경 감지용 기준. 이미 색인된 URL 이 무엇인지 아는 곳은 프로덕션뿐이다.
 * PROD=off 로 끄면 그 검사만 건너뛴다 (오프라인 작업용).
 */
const PROD = process.env.PROD || "https://www.ilsanhan.com";
const CONTENT_DIR = path.join(process.cwd(), "content");
const CATEGORIES = ["pain", "diet", "autonomic", "skin"];

/**
 * 이 문자열이 응답에 없으면 검사 대상이 구버전이다 — 즉시 실패시킨다.
 * @graph 개편 이후에만 존재할 수 있는 값으로 고를 것.
 */
const FRESHNESS_MARKERS = [
  '"@graph"', // 페이지당 단일 @graph 블록
  '"knowsAbout"', // 한의학 자유텍스트 필드
  "추나요법", // knowsAbout 내용까지 실제로 실렸는지
  '"Musculoskeletal"', // 열거형으로 교체된 medicalSpecialty
  'rel="icon"', // App Router 파일 규칙이 붙이는 파비콘 링크
];

const EXPECTED_SAME_AS = [
  "https://naver.me/IItclnGB",
  "https://blog.naver.com/jwguin",
  "https://www.youtube.com/@%EC%9D%BC%EC%82%B0%ED%95%9C%EC%9D%98%EC%9B%90",
  "https://pf.kakao.com/_eXXun",
];

/**
 * 발행된 글의 목록. 프론트매터 slug 가 있으면 그것이 URL 이고, 없으면 파일명이다.
 * (lib/blog-local.ts 의 폴백 규칙과 같아야 한다 — 어긋나면 아래 검사가 바로 잡는다)
 */
function listPosts() {
  const out = [];
  for (const category of [...CATEGORIES, "blog"]) {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const { data, content } = matter(
        fs.readFileSync(path.join(dir, file), "utf-8")
      );
      const id = file.replace(/\.md$/, "");
      const rawSlug = typeof data.slug === "string" ? data.slug : "";
      const slug = normalizeSlug(rawSlug) || id;
      // 미발행 글도 담는다. URL 목록은 published 로 거르지만, 슬러그 규칙과
      // FAQ 가드는 발행 **전에** 잡아야 의미가 있다.
      out.push({
        category,
        id,
        rawSlug,
        slug,
        published: data.published !== false,
        // "under_review" 는 URL 을 살려 둔 채 노출만 끊은 상태다.
        // published:false 와 달리 200 이므로 URL·JSON-LD 검사 대상에는 남고,
        // 사이트맵에서는 빠지는 것이 정상이다.
        status: typeof data.status === "string" ? data.status : "",
        path: postPath(category, slug),
        faqSection: hasFaqSection(content),
        faqCount: parsePostFaq(content).length,
      });
    }
  }
  return out;
}

function listPaths() {
  const staticPaths = [
    "/",
    "/about",
    "/doctor",
    "/column",
    "/media",
    "/treatment",
    "/contact",
    "/blog",
    "/pain",
    "/pain/acute",
    "/pain/chronic",
    "/accident",
    "/internal/dyspepsia",
    "/autonomic",
    "/autonomic/care",
    "/diet",
    "/diet/program",
    "/skin",
    "/skin/spot",
  ];

  // 발행된 글만 — published:false 는 404 가 정상이라 검사 대상이 아니다.
  // 경로는 lib/blog-local 과 같은 규칙으로 직접 열거한다. 사이트맵을 근거로
  // 쓰면 사이트맵이 빼먹은 페이지를 영원히 못 잡는다.
  // 발행분만 URL 검사 대상이다 (published:false 는 404 가 정상)
  return [
    ...staticPaths,
    ...listPosts().filter((p) => p.published).map((p) => p.path),
  ];
}

const SCRIPT_RE =
  /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;

function extractBlocks(html) {
  const blocks = [];
  let m;
  while ((m = SCRIPT_RE.exec(html)) !== null) blocks.push(m[1]);
  SCRIPT_RE.lastIndex = 0;
  return blocks;
}

/** 그래프를 훑어 정의된 @id 와 순수 참조를 모은다. */
function walk(node, defined, references, trail) {
  if (Array.isArray(node)) {
    node.forEach((child) => walk(child, defined, references, trail));
    return;
  }
  if (!node || typeof node !== "object") return;

  const keys = Object.keys(node);
  if (keys.length === 1 && keys[0] === "@id") {
    references.push({ id: node["@id"], at: trail });
    return;
  }
  if (typeof node["@id"] === "string") {
    defined.push({ id: node["@id"], type: node["@type"], at: trail });
  }
  for (const [key, value] of Object.entries(node)) {
    walk(value, defined, references, `${trail}.${key}`);
  }
}

function validate(pagePath, html) {
  const errors = [];
  const warnings = [];
  const blocks = extractBlocks(html);

  if (blocks.length !== 1) {
    errors.push(`ld+json 블록이 ${blocks.length}개 (1개여야 함)`);
    if (blocks.length === 0) return { errors, warnings, stats: null };
  }

  let parsed;
  try {
    parsed = JSON.parse(blocks[0]);
  } catch (e) {
    errors.push(`JSON 파싱 실패: ${e.message}`);
    return { errors, warnings, stats: null };
  }

  if (parsed["@context"] !== "https://schema.org")
    errors.push("@context 가 https://schema.org 가 아님");
  if (!Array.isArray(parsed["@graph"]))
    errors.push("@graph 배열이 없음");

  const graph = parsed["@graph"] || [];

  // (c) 모든 최상위 노드가 @id 를 가진다
  const missingId = graph.filter((n) => typeof n["@id"] !== "string");
  if (missingId.length)
    errors.push(
      `@id 없는 최상위 노드 ${missingId.length}개: ` +
        missingId.map((n) => JSON.stringify(n["@type"])).join(", ")
    );

  // (a) 최상위 @id 중복
  const topIds = graph.map((n) => n["@id"]).filter(Boolean);
  const dupes = topIds.filter((id, i) => topIds.indexOf(id) !== i);
  if (dupes.length) errors.push(`중복 @id: ${[...new Set(dupes)].join(", ")}`);

  // (b) 끊긴 참조
  const defined = [];
  const references = [];
  walk(graph, defined, references, "@graph");
  const definedIds = new Set(defined.map((d) => d.id));
  const dangling = references.filter((r) => !definedIds.has(r.id));
  if (dangling.length)
    errors.push(
      `끊긴 참조 ${dangling.length}건: ` +
        dangling.map((d) => `${d.id} (${d.at})`).join(", ")
    );

  // 페이지 노드는 하나뿐
  const webpages = graph.filter((n) => String(n["@id"]).endsWith("#webpage"));
  if (webpages.length !== 1)
    errors.push(`#webpage 노드가 ${webpages.length}개 (1개여야 함)`);

  // 이동경로
  const crumb = graph.find((n) => n["@type"] === "BreadcrumbList");
  if (!crumb) errors.push("BreadcrumbList 없음");
  else {
    const items = crumb.itemListElement || [];
    const noItem = items.filter((i) => !i.item);
    if (noItem.length)
      errors.push(`item URL 없는 이동경로 항목 ${noItem.length}개`);
    if (items[0]?.name !== "홈") warnings.push("이동경로 첫 항목이 '홈' 이 아님");
  }

  // 회귀 확인
  const clinic = graph.find((n) =>
    String(n["@id"]).endsWith("/#clinic")
  );
  if (!clinic) errors.push("병원 노드(#clinic) 없음");
  else {
    const types = [].concat(clinic["@type"]);
    for (const t of ["MedicalClinic", "LocalBusiness"])
      if (!types.includes(t)) errors.push(`병원 노드에 ${t} 없음`);
    const sameAs = clinic.sameAs || [];
    for (const link of EXPECTED_SAME_AS)
      if (!sameAs.includes(link)) errors.push(`sameAs 누락: ${link}`);
    if (sameAs.length !== 4)
      errors.push(`sameAs 가 ${sameAs.length}개 (4개여야 함)`);

    /* ── NAP 값 대조 ── 존재 여부가 아니라 **값이 맞는가**를 본다 ── */

    // (4) 좌표가 아예 없거나 숫자가 아니면 실패
    const geo = clinic.geo;
    if (!geo || typeof geo.latitude !== "number" || typeof geo.longitude !== "number") {
      errors.push("병원 노드에 geo 좌표가 없거나 숫자가 아니다");
    } else {
      // (1) clinic.ts 정본과 출력이 일치하는가
      if (geo.latitude !== CLINIC.geo.latitude || geo.longitude !== CLINIC.geo.longitude)
        errors.push(
          `좌표가 clinic.ts 와 다르다 — 출력 ${geo.latitude}/${geo.longitude}, 정본 ${CLINIC.geo.latitude}/${CLINIC.geo.longitude}`
        );
      // (2) 고양시 범위를 벗어나는가 — clinic.ts 자체가 틀린 경우를 잡는 유일한 검사
      const { latMin, latMax, lngMin, lngMax } = GEO_BOUNDS;
      if (
        geo.latitude < latMin || geo.latitude > latMax ||
        geo.longitude < lngMin || geo.longitude > lngMax
      )
        errors.push(
          `좌표가 고양시 범위 밖이다 — ${geo.latitude}/${geo.longitude} (허용 ${latMin}~${latMax} / ${lngMin}~${lngMax})`
        );
    }

    // (3) 주소·전화도 정본과 대조
    const addr = clinic.address || {};
    const expectedAddr = {
      streetAddress: `${CLINIC.streetAddress}, ${CLINIC.building}`,
      addressLocality: CLINIC.addressLocality,
      addressRegion: CLINIC.addressRegion,
      postalCode: CLINIC.postalCode,
    };
    for (const [k, want] of Object.entries(expectedAddr))
      if (addr[k] !== want)
        errors.push(`address.${k} 가 clinic.ts 와 다르다 — 출력 "${addr[k]}", 정본 "${want}"`);

    if (clinic.telephone !== CLINIC.telIntl)
      errors.push(
        `telephone 이 clinic.ts 와 다르다 — 출력 "${clinic.telephone}", 정본 "${CLINIC.telIntl}"`
      );

    /* ── 진료시간 ── 「지금 진료하나요」류 질의에 직접 쓰이는 값이다 ── */
    const specs = clinic.openingHoursSpecification || [];
    const WANT = [
      { key: "weekday", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] },
      { key: "weekend", days: ["Saturday", "Sunday"] },
    ];
    for (const { key, days } of WANT) {
      const spec = specs.find((s) =>
        days.every((d) => [].concat(s.dayOfWeek || []).includes(d))
      );
      if (!spec) {
        errors.push(`openingHours 에 ${key}(${days[0]}…) 항목이 없다`);
        continue;
      }
      const wantHours = CLINIC.hours[key];
      // 정본 대조
      if (spec.opens !== wantHours.opens || spec.closes !== wantHours.closes)
        errors.push(
          `openingHours(${key}) 가 clinic.ts 와 다르다 — 출력 ${spec.opens}~${spec.closes}, 정본 ${wantHours.opens}~${wantHours.closes}`
        );
      // 타당성 — 정본 자체가 틀린 경우를 잡는다 (좌표 범위 검사와 같은 역할)
      const o = toMinutes(spec.opens);
      const c = toMinutes(spec.closes);
      if (o === null || c === null)
        errors.push(`openingHours(${key}) 시각 형식이 HH:MM 이 아니다 — ${spec.opens}~${spec.closes}`);
      else if (c <= o)
        errors.push(`openingHours(${key}) 종료가 시작보다 빠르거나 같다 — ${spec.opens}~${spec.closes}`);
      else if (c - o > 24 * 60)
        errors.push(`openingHours(${key}) 진료시간이 24시간을 넘는다 — ${spec.opens}~${spec.closes}`);
    }

    /* ── 인원 ──
       schema.ts 가 numberOfEmployees 를 DOCTOR_SLUGS 에서 세므로 그 둘의 대조는
       동어반복이다. 의미 있는 교차 검사는 **다른 소스**와 맞춰 보는 것이다:
       /doctor 페이지의 Physician 노드는 app/doctor/page.tsx 의 doctors[] 에서
       나오므로, 그 개수가 DOCTOR_SLUGS 와 갈리면 여기서 잡힌다.
       (아래 pagePath === "/doctor" 분기) */
    const emp = clinic.numberOfEmployees;
    if (!emp || typeof emp.value !== "number" || emp.value < 1)
      errors.push("numberOfEmployees 가 없거나 유효한 숫자가 아니다");
  }

  // /doctor 에서만: doctors[] → Physician 노드 수 vs DOCTOR_SLUGS vs numberOfEmployees
  if (pagePath === "/doctor") {
    const physicians = graph.filter((n) => n["@type"] === "Physician");
    const slugCount = Object.keys(DOCTOR_SLUGS).length;
    if (physicians.length !== slugCount)
      errors.push(
        `/doctor 의 Physician 노드가 ${physicians.length}개 — DOCTOR_SLUGS 는 ${slugCount}명 (doctors[] 와 갈렸다)`
      );
    const empValue = clinic?.numberOfEmployees?.value;
    if (typeof empValue === "number" && empValue !== physicians.length)
      errors.push(
        `numberOfEmployees(${empValue}) 가 /doctor 의 Physician ${physicians.length}명과 다르다`
      );
  }

  /* ── 금지 문자열 ── 구조가 아니라 내용을 본다 ── */
  for (const word of FORBIDDEN_IN_JSONLD) {
    if (blocks[0].includes(word))
      errors.push(`JSON-LD 에 금지 표현 "${word}" 가 있다`);
  }

  if (!graph.some((n) => n["@type"] === "WebSite"))
    errors.push("WebSite 노드 없음");

  /**
   * URL 일관성 — canonical / og:url / JSON-LD #webpage @id 가 같은 문자열인가.
   *
   * 한 글자만 달라도(퍼센트 인코딩 유무, 후행 슬래시) 엔티티 병합이 조용히 실패한다.
   * 한글 슬러그를 쓰면 인코딩 표기가 갈릴 여지가 커지므로 이 검사가 필요하다.
   *
   * 홈만 예외다 — `@id` 는 `https://.../#webpage`(슬래시 있음), canonical 은
   * 슬래시 없음이 의도된 표기다(lib/schema.ts pageId 주석). 그래서 비교 전에
   * 후행 슬래시 하나만 떼고 맞춘다.
   */
  const trimSlash = (u) => (u ? u.replace(/\/$/, "") : u);
  const canonical = trimSlash(
    html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)?.[1] ??
      html.match(/<link[^>]+href="([^"]*)"[^>]+rel="canonical"/i)?.[1] ??
      null
  );
  const ogUrl = trimSlash(
    html.match(/<meta[^>]+property="og:url"[^>]+content="([^"]*)"/i)?.[1] ??
      html.match(/<meta[^>]+content="([^"]*)"[^>]+property="og:url"/i)?.[1] ??
      null
  );
  const webpageUrl = trimSlash(
    webpages[0] ? String(webpages[0]["@id"]).replace(/#webpage$/, "") : null
  );

  if (!canonical) errors.push("canonical 없음");
  if (canonical && webpageUrl && canonical !== webpageUrl)
    errors.push(`canonical != @id: ${canonical} vs ${webpageUrl}`);
  // og:url 은 선언하지 않는 페이지가 있을 수 있어 있을 때만 본다
  if (ogUrl && canonical && ogUrl !== canonical)
    errors.push(`og:url != canonical: ${ogUrl} vs ${canonical}`);

  const faqPage = graph.find((n) =>
    [].concat(n["@type"]).includes("FAQPage")
  );

  return {
    errors,
    warnings,
    stats: {
      nodes: graph.length,
      withId: graph.length - missingId.length,
      refs: references.length,
      faq: faqPage ? (faqPage.mainEntity || []).length : 0,
      bytes: blocks[0].length,
    },
  };
}

const paths = listPaths();
let failed = 0;
let totalNodes = 0;
let totalWithId = 0;
let totalRefs = 0;
let totalDangling = 0;
const failures = [];

console.log(`검증 대상 ${paths.length}개 URL — ${BASE}\n`);

for (const p of paths) {
  let html;
  try {
    const res = await fetch(`${BASE}${p}`, { redirect: "follow" });
    if (!res.ok) {
      console.log(`  FAIL ${p} — HTTP ${res.status}`);
      failed += 1;
      failures.push(`${p}: HTTP ${res.status}`);
      continue;
    }
    html = await res.text();
  } catch (e) {
    console.log(`  FAIL ${p} — ${e.message}`);
    failed += 1;
    failures.push(`${p}: ${e.message}`);
    continue;
  }

  const stale = FRESHNESS_MARKERS.filter((m) => !html.includes(m));
  if (stale.length) {
    failed += 1;
    const msg = `구버전 응답 — 누락된 표식: ${stale.join(", ")}`;
    failures.push(`${p}: ${msg}`);
    console.log(`  FAIL ${p}`);
    console.log(`       ${msg}`);
    console.log(
      "       빌드한 서버가 아닌 예전 프로세스가 응답하고 있을 수 있다 (EADDRINUSE)."
    );
    continue;
  }

  const { errors, warnings, stats } = validate(p, html);
  if (stats) {
    totalNodes += stats.nodes;
    totalWithId += stats.withId;
    totalRefs += stats.refs;
  }
  for (const e of errors) if (e.startsWith("끊긴 참조")) totalDangling += 1;

  if (errors.length) {
    failed += 1;
    failures.push(`${p}: ${errors.join(" / ")}`);
    console.log(`  FAIL ${p}`);
    for (const e of errors) console.log(`       ${e}`);
  } else {
    const w = warnings.length ? `  (경고 ${warnings.length})` : "";
    console.log(
      `  ok   ${p}  노드 ${stats.nodes} · 참조 ${stats.refs}` +
        (stats.faq ? ` · FAQ ${stats.faq}` : "") +
        w
    );
  }
}

console.log("\n─────────────────────────────────────────");
console.log(`URL          ${paths.length}개 중 ${paths.length - failed}개 통과`);
console.log(
  `@id 부여율   ${totalWithId}/${totalNodes} (` +
    `${totalNodes ? ((totalWithId / totalNodes) * 100).toFixed(1) : 0}%)`
);
console.log(`참조 총계    ${totalRefs}건`);
console.log(`끊긴 참조    ${totalDangling}건`);

/**
 * 파생 OG 쌍 대조 — 발행된 글마다 og.png 와 og.webp 가 둘 다 있는가.
 *
 * og.png 는 og:image 메타와 JSON-LD image 가, og.webp 는 화면 <img src> 가
 * 가리킨다. 한쪽만 생기면 화면이나 공유 미리보기 중 하나가 조용히 깨진다
 * (postImagePath 가 png 로 폴백하므로 눈에 잘 안 띈다).
 */
{
  const missingPairs = [];
  for (const category of [...CATEGORIES, "blog"]) {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
      if (data.published === false) continue;
      const slug = file.replace(/\.md$/, "");
      const base = path.join(process.cwd(), "public", "blog-images", slug);
      const hasPng = fs.existsSync(path.join(base, "og.png"));
      const hasWebp = fs.existsSync(path.join(base, "og.webp"));
      // 둘 다 없는 글은 파생 OG 자체가 없는 것(원본 썸네일 사용) — 정상이다.
      if (hasPng !== hasWebp) {
        missingPairs.push(`${slug}(${hasPng ? "webp 없음" : "png 없음"})`);
      }
    }
  }
  console.log(`파생 OG 쌍    불일치 ${missingPairs.length}건`);
  if (missingPairs.length) {
    failed += 1;
    console.log(`  ! ${missingPairs.join(", ")}`);
    console.log("    복구: node scripts/generate-og-images.mjs");
    failures.push(`파생 OG 쌍 불일치: ${missingPairs.join(", ")}`);
  }
}

/**
 * 슬러그 규칙 검사 — 허용 문자 · 길이 · 예약어 · NFC 정규형 · 카테고리 내 중복.
 *
 * 프론트매터 slug 가 없는 글(기존 32편)은 파일명이 곧 슬러그다. 그 값도 같은
 * 규칙으로 본다 — 다만 예약어/문자셋은 이미 발행된 URL 이라 되돌릴 수 없으므로
 * 실패가 아니라 경고로 남긴다. 새로 적은 slug 만 실패시킨다.
 */
{
  const posts = listPosts();
  const byCategory = new Map();
  for (const p of posts) {
    if (!byCategory.has(p.category)) byCategory.set(p.category, []);
    byCategory.get(p.category).push(p);
  }

  const hard = [];
  const soft = [];
  const draftCount = posts.filter((p) => !p.published).length;
  for (const p of posts) {
    const siblings = byCategory
      .get(p.category)
      .filter((o) => o !== p)
      .map((o) => o.slug);
    const problems = validateSlug(p.slug, {
      category: p.category,
      existing: siblings,
    });
    if (!problems.length) continue;
    const line = `${p.category}/${p.slug}${p.published ? "" : " (미발행)"} — ${problems.map((x) => `${x.code}: ${x.message}`).join(" / ")}`;
    // 프론트매터에 직접 적은 슬러그는 고칠 수 있으므로 실패시킨다.
    // 파일명 폴백은 이미 색인된 기존 URL 이라 경고로만 남긴다.
    (p.rawSlug ? hard : soft).push(line);
  }

  console.log(
    `슬러그 규칙    ${posts.length}건 검사(미발행 ${draftCount} 포함) · 위반 ${hard.length}건` +
      (soft.length ? ` · 기존 URL 경고 ${soft.length}건` : "")
  );
  for (const line of soft) console.log(`  (경고) ${line}`);
  if (hard.length) {
    failed += 1;
    for (const line of hard) console.log(`  ! ${line}`);
    failures.push(`슬러그 규칙 위반: ${hard.join(" | ")}`);
  }

  // NFC 는 validateSlug 안에서도 보지만, 원문이 NFD 인 파일을 짚어 주기 위해 따로 출력한다
  const nfd = posts.filter((p) => p.rawSlug && p.rawSlug !== p.rawSlug.normalize("NFC"));
  console.log(`NFC 정규형     불일치 ${nfd.length}건`);
  if (nfd.length) {
    for (const p of nfd) {
      console.log(`  ! ${p.category}/${p.id} — 프론트매터 slug 가 NFD 다`);
      console.log(`    고치기: slug: "${p.rawSlug.normalize("NFC")}"`);
    }
  }
}

/**
 * 슬러그 변경 감지 — 이번 작업의 안전장치.
 *
 * 지금은 리다이렉트가 필요 없다(기존 글을 옮기지 않으므로). 하지만 앞으로
 * 누군가 이미 발행된 글의 슬러그를 고치면 그 순간 옛 URL 이 조용히 404 가 된다.
 * 색인된 URL 이 무엇인지 아는 곳은 프로덕션 사이트맵뿐이므로 그걸 기준으로 삼는다.
 *
 * 프로덕션에 못 닿으면 실패가 아니라 경고다 — 오프라인에서 검증기를 못 돌리게
 * 만들면 아무도 안 돌리게 된다. 대신 "검사 못 했다"고 분명히 말한다.
 */
if (PROD === "off") {
  console.log(`슬러그 변경    건너뜀 (PROD=off)`);
} else {
  const isPostPath = (p) => {
    const seg = p.split("/").filter(Boolean);
    if (seg.length !== 2) return false;
    if (![...CATEGORIES, "blog"].includes(seg[0])) return false;
    // 형제 정적 라우트(/pain/acute 등)는 글이 아니다
    return !(RESERVED_BY_CATEGORY[seg[0]] ?? []).includes(decodeURIComponent(seg[1]));
  };

  try {
    const xml = await (await fetch(`${PROD}/sitemap.xml`)).text();
    const live = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => new URL(m[1]).pathname.replace(/\/$/, ""))
      .filter(isPostPath);
    const current = new Set(
      listPosts().filter((p) => p.published).map((p) => p.path)
    );
    const gone = live.filter((p) => !current.has(p));

    console.log(
      `슬러그 변경    프로덕션 글 ${live.length}건 대조 · 사라진 URL ${gone.length}건`
    );
    if (gone.length) {
      failed += 1;
      console.log("  ! 이미 색인된 글 URL 이 이번 빌드에 없다. 리다이렉트 없이 배포하면 404 다.");
      console.log("    next.config.ts 의 redirects() 에 아래를 추가하고 다시 돌릴 것:");
      for (const p of gone) {
        console.log(`      { source: "${p}", destination: "<새 URL>", permanent: true },`);
      }
      failures.push(`슬러그 변경으로 사라진 URL ${gone.length}건: ${gone.join(", ")}`);
    }
  } catch (e) {
    console.log(`슬러그 변경    확인 실패 — 검사하지 못했다 (${e.message})`);
  }
}

/**
 * FAQ 파싱 가드.
 *
 * 본문 파싱 방식의 유일한 약점은 마크다운 형식 의존이다. 글쓴이가 형식을
 * 조금만 달리 쓰면 FAQ 가 **조용히 0쌍이 되고** 아무도 모른 채 넘어간다.
 * 그래서 "섹션은 있는데 한 쌍도 못 뽑힘" 을 실패로 못박는다.
 *
 * 미발행 글도 검사한다 — 발행 버튼을 누르기 전에 알아야 고칠 수 있다.
 */
{
  const posts = listPosts();
  const withSection = posts.filter((p) => p.faqSection);
  const broken = withSection.filter((p) => p.faqCount === 0);
  const pairs = withSection.reduce((n, p) => n + p.faqCount, 0);

  console.log(
    `FAQ 파싱      섹션 ${withSection.length}건 · ${pairs}쌍 · 파싱 실패 ${broken.length}건`
  );
  if (broken.length) {
    failed += 1;
    for (const p of broken) {
      console.log(`  ! ${p.category}/${p.id} — "자주 묻는 질문" 섹션은 있는데 Q/A 를 못 뽑았다`);
    }
    console.log('    형식: `**Q. 질문?**` 한 줄 뒤 빈 줄, 그다음 답변 문단');
    failures.push(
      `FAQ 파싱 실패 ${broken.length}건: ${broken.map((p) => `${p.category}/${p.id}`).join(", ")}`
    );
  }
}

/**
 * 사이트맵 대조 — 색인 가능한 페이지가 사이트맵에도 있는가.
 *
 * sitemap.ts 가 content/blog/ 을 통째로 빼먹었던 버그를 잡았을 검사다.
 * 발행 경로를 늘릴 때마다 조용히 같은 일이 반복될 수 있다.
 */
try {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const inSitemap = new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/"
    )
  );
  // 심사 중인 글은 사이트맵에서 빠지는 것이 의도된 동작이다.
  // 조용히 빼면 "사이트맵이 글을 빼먹는" 진짜 버그와 구분이 안 되므로,
  // 몇 건을 왜 제외했는지 항상 함께 출력한다.
  const underReview = new Set(
    listPosts()
      .filter((p) => p.published && p.status === "under_review")
      .map((p) => p.path)
  );
  const missing = paths.filter((p) => !inSitemap.has(p) && !underReview.has(p));
  console.log(
    `사이트맵      ${inSitemap.size}개 등재 / 검사 대상 ${paths.length}개` +
      (underReview.size ? ` (심사중 ${underReview.size}건 제외)` : "")
  );
  if (missing.length) {
    failed += 1;
    console.log(`  ! 사이트맵 누락 ${missing.length}건: ${missing.join(", ")}`);
    failures.push(`sitemap 누락: ${missing.join(", ")}`);
  }
} catch (e) {
  console.log(`사이트맵      확인 실패 (${e.message})`);
}

if (failed) {
  console.log("\n실패 목록:");
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log("\n전부 통과.");
