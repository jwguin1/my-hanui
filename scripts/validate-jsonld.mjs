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
 */
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BASE || "http://localhost:3000";
const CONTENT_DIR = path.join(process.cwd(), "content");
const CATEGORIES = ["pain", "diet", "autonomic", "skin"];

const EXPECTED_SAME_AS = [
  "https://naver.me/IItclnGB",
  "https://blog.naver.com/jwguin",
  "https://www.youtube.com/@%EC%9D%BC%EC%82%B0%ED%95%9C%EC%9D%98%EC%9B%90",
  "https://pf.kakao.com/_eXXun",
];

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

  const postPaths = [];
  for (const category of [...CATEGORIES, "blog"]) {
    const dir = path.join(CONTENT_DIR, category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".md")) continue;
      postPaths.push(`/${category}/${file.replace(/\.md$/, "")}`);
    }
  }
  return [...staticPaths, ...postPaths];
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
  }

  if (!graph.some((n) => n["@type"] === "WebSite"))
    errors.push("WebSite 노드 없음");

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

if (failed) {
  console.log("\n실패 목록:");
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log("\n전부 통과.");
