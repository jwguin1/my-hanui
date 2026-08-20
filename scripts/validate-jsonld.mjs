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
import {
  PAIN_GROUP_HUB,
  PAIN_GROUP_ORDER,
  PAIN_GROUP_POSTS,
  painGroupSlugs,
} from "../src/lib/pain-groups.ts";
import {
  SPOT_PRICE_ROWS,
  AFTERCARE_PRODUCTS,
  allowedSkinAmounts,
  perSpot,
  won,
} from "../src/lib/pricing.ts";

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
const FORBIDDEN_IN_JSONLD = [
  "전문의",
  "인증의",
  "초음파사",
  "RMDS",
  "대학병원급",
  /* 2026-08-21 추가 — 「최다」는 있는데 「가장 많은」이 없어서 같은 뜻의 표현이
     그대로 통과할 수 있었다. 금지어는 **뜻이 아니라 문자열**로 걸리므로
     같은 주장을 하는 다른 표기를 함께 막아야 한다. */
  "가장 많은",
  "가장 많이",
  "최다",
  "1위",
  /* 2026-08-21 추가 — 초음파 장비 표기에 딸려 올 수 있는 제조사 마케팅 문구.
     우리가 인용하면 그대로 최상급 표현이 된다. 「대학병원급」과 같은 이유다. */
  "프리미엄",
  "최상위",
  "고사양",
  "최고급",
];

/* 화면에서도 막는다. JSON-LD 만 보면 본문·컴포넌트에 그대로 남는다 —
   장비 상세 문안은 화면에만 있으므로 여기서 걸러야 의미가 있다. */
const FORBIDDEN_ON_SCREEN = ["프리미엄", "최상위", "고사양", "최고급", "대학병원급"];

/**
 * 지역명 + 최상급 조합. 개별 단어로는 잡히지 않는 주장을 잡는다.
 *
 * 「고양시에서 가장 많은 처방 경험」처럼 지역을 한정하면 검증 가능해 보이지만,
 * 실제로는 고양시 전체 통계를 가진 곳이 없어 **확인할 수 없는 주장**이다.
 */
const REGION_SUPERLATIVE = /(고양시|일산|파주|덕양구|일산동구|일산서구)[^.\n]{0,20}(최다|가장\s*많|1위|최고|유일|최대)/;

/**
 * 실적 숫자에 기준이 붙어 있는가 — **경고(WARN)** 로 낸다.
 *
 * 「9,000건」처럼 숫자만 크게 띄우면 기간도 근거도 없는 광고 문구로 읽힌다.
 * 실제로 다이어트 실적이 「누적 9,000건」으로만 있다가 나중에
 * 「개원 이래 누적 9,000건 이상 (원내 진료기록 기준)」으로 고쳐졌다.
 * 다른 숫자가 추가될 때 같은 누락이 반복되므로 자동으로 잡는다.
 *
 * FAIL 이 아니라 WARN 인 이유: 「연 20회까지」(보험 한도)나 「3~5회」(치료 횟수)처럼
 * 실적이 아닌 숫자도 「회/건」을 쓴다. 기계적으로 막으면 정상 문구를 잡는다.
 * 사람이 보고 판단하도록 목록만 띄운다.
 */
const PERIOD_BASIS = /(누적|연간|개원\s*이래|올해|월평균|일평균)/;
const SOURCE_BASIS = /(진료기록|EMR|건강보험|청구|실인원)/;
/** 실적으로 읽히는 규모의 숫자만 본다 — 1,000 이상 */
const PERF_NUMBER = /(?<![\d,.])(\d{1,3},\d{3}|\d{4,})\s*(건|명|회)/g;

/**
 * schema.org 가 인정하는 요일 문자열. 이 목록에 없는 값(「Sun」·「일요일」 등)은
 * 파서가 조용히 버린다 — 그러면 그 요일은 휴진으로 읽힌다.
 */
const SCHEMA_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

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
/**
 * 마크다운 원문에 GFM 표가 있는가.
 * 헤더 행 다음 줄이 구분선(|---|---|)인 형태만 표로 본다.
 *
 * 이 검사가 있는 이유: react-markdown 에 remark-gfm 이 빠져 있어
 * 표 24편이 파이프 문자 그대로 <p> 안에 박힌 채 배포돼 있었다.
 * JSON-LD 도 사이트맵도 전부 통과했다 — 「우리가 출력했는가」가 아니라
 * 「환자가 실제로 보는가」를 봐야 잡히는 유형이다. 좌표·진료시간과 같다.
 */
function hasMarkdownTable(markdown) {
  const lines = markdown.split(String.fromCharCode(10));
  for (let i = 0; i < lines.length - 1; i += 1) {
    const head = lines[i].trim();
    const sep = lines[i + 1].trim();
    if (!head.startsWith("|") || (head.match(/\|/g) || []).length < 3) continue;
    if (/^\|(\s*:?-{3,}:?\s*\|)+$/.test(sep)) return true;
  }
  return false;
}

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
        hasMarkdownTable: hasMarkdownTable(content),
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

/**
 * ── 가격 일관성 ──────────────────────────────────────────────
 *
 * 좌표·NAP·진료시간에서 정본이 갈려 문제가 났던 것과 같은 구조를 막는다.
 * 금액은 src/lib/pricing.ts 하나에서만 나온다. 페이지·블록은 거기서 파생하지만
 * 마크다운 본문은 TS 를 import 할 수 없어 파생이 불가능하다 — 그래서 여기서
 * 「환자가 실제로 보는 HTML」을 훑어 대조한다. 소스가 아니라 출력을 본다.
 *
 * 세 겹으로 본다.
 *   A. 화이트리스트 — skin 페이지에 pricing.ts 에 없는 금액이 보이면 FAIL
 *   B. 표 행 대조   — <tr> 첫 칸이 정본 항목명이면 나머지 칸이 정본과 일치해야 한다
 *                     (마크다운 표도 <tr> 로 렌더되므로 본문 가격표가 여기 걸린다)
 *   C. 문장 대조    — 항목명이 든 문장의 금액이 그 항목의 금액이어야 한다
 *                     (「얼굴 전체 … 22만 원」 같은 뒤섞임을 잡는다)
 */
const PRICE_SCOPE_RE = /^\/skin(\/|$)/;

/** "110,000원" / "1,100원" */
const WON_COMMA_RE = /(\d{1,3}(?:,\d{3})+)\s*원/g;
/** "11만 원", "16만 5천 원", "27만5천원" */
const WON_KOREAN_RE = /(\d{1,4})\s*만(?:\s*(\d)\s*천)?\s*원/g;

/** 텍스트에서 금액을 원 단위 숫자로 뽑는다 */
function moneyTokens(text) {
  const out = [];
  let m;
  WON_COMMA_RE.lastIndex = 0;
  while ((m = WON_COMMA_RE.exec(text)) !== null) {
    out.push({ raw: m[0], value: Number(m[1].replace(/,/g, "")) });
  }
  WON_KOREAN_RE.lastIndex = 0;
  while ((m = WON_KOREAN_RE.exec(text)) !== null) {
    const value = Number(m[1]) * 10000 + (m[2] ? Number(m[2]) * 1000 : 0);
    out.push({ raw: m[0], value });
  }
  return out;
}

/** 태그를 줄바꿈으로 바꾼다 — 셀·문단이 서로 섞이지 않게 */
function visibleText(html) {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, (block) =>
      // ld+json 안의 FAQ 답변에도 금액이 있다. 태그만 걷어내고 내용은 남긴다
      block.startsWith("<script type=\"application/ld+json\"") ? block.replace(/<[^>]+>/g, "\n") : "\n"
    )
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\u[0-9a-fA-F]{4}/g, (esc) =>
      String.fromCharCode(parseInt(esc.slice(2), 16))
    );
}

/**
 * 표의 행을 셀 배열로 뽑는다.
 *
 * 두 형태를 모두 본다.
 *   1. <tr><td>…  — PriceTable 같은 컴포넌트 표
 *   2. "| 얼굴 전체 | 110,000원 |" — 마크다운 파이프 표
 *
 * 2번을 굳이 보는 이유: 지금 react-markdown 에 remark-gfm 이 없어서
 * 마크다운 표가 <table> 로 렌더되지 않고 파이프 문자 그대로 <p> 에 박힌다.
 * 그 상태에서도 금액 대조는 되어야 한다. GFM 을 붙인 뒤에는 1번으로 잡힌다.
 */
function tableRows(html) {
  const rows = [];
  const trRe = /<tr\b[^>]*>([\s\S]*?)<\/tr>/g;
  let m;
  while ((m = trRe.exec(html)) !== null) {
    const cells = [];
    const cellRe = /<(td|th)\b[^>]*>([\s\S]*?)<\/\1>/g;
    let c;
    while ((c = cellRe.exec(m[1])) !== null) {
      cells.push(c[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
    }
    if (cells.length) rows.push(cells);
  }
  // 파이프 표 (미렌더 상태)
  for (const line of visibleText(html).split(String.fromCharCode(10))) {
    const t = line.trim();
    if (!t.startsWith("|") || !t.endsWith("|")) continue;
    const cells = t
      .slice(1, -1)
      .split("|")
      .map((c) => c.replace(/\s+/g, " ").trim());
    if (cells.some((c) => /^-+$/.test(c))) continue; // 구분선
    if (cells.length) rows.push(cells);
  }
  return rows;
}

function checkPrices(pagePath, html, errors) {
  if (!PRICE_SCOPE_RE.test(decodeURIComponent(pagePath))) return 0;

  const allowed = new Set(allowedSkinAmounts());
  const text = visibleText(html);
  const tokens = moneyTokens(text);

  // A. 화이트리스트
  const seen = new Set();
  for (const t of tokens) {
    if (allowed.has(t.value) || seen.has(t.value)) continue;
    seen.add(t.value);
    errors.push(
      `가격 정본에 없는 금액 "${t.raw}" — pricing.ts 허용치: ${allowedSkinAmounts()
        .map((n) => won(n))
        .join(", ")}`
    );
  }

  // B. 표 행 대조
  for (const cells of tableRows(html)) {
    const row = SPOT_PRICE_ROWS.find((r) => cells[0] === r.name);
    if (!row) continue;
    const want = [won(row.upTo100), won(row.unlimited)];
    const got = cells.slice(1);
    if (got.length !== want.length || want.some((w, i) => got[i] !== w)) {
      errors.push(
        `가격표 "${row.name}" 행이 정본과 다르다 — 출력 [${got.join(", ")}], 정본 [${want.join(", ")}]`
      );
    }
  }

  // C. 문장 대조
  for (const row of SPOT_PRICE_ROWS) {
    const ok = new Set([row.upTo100, row.unlimited, perSpot(row)]);
    for (const chunk of text.split(/[.!?\n]/)) {
      if (!chunk.includes(row.name)) continue;
      for (const t of moneyTokens(chunk)) {
        if (ok.has(t.value)) continue;
        errors.push(
          `"${row.name}" 문장에 다른 항목의 금액 "${t.raw}" 이 섞였다 — 이 항목은 ${won(
            row.upTo100
          )} / ${won(row.unlimited)}`
        );
      }
    }
  }

  // 제품 금액이 한 번이라도 어긋나면 A 에서 걸린다. 여기서는 존재만 세어 돌려준다.
  void AFTERCARE_PRODUCTS;
  return tokens.length;
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
    // clinic.ts 의 구간 정의를 그대로 순회한다. 평일은 점심을 비우느라 두 구간이다.
    const WANT = Object.entries(CLINIC.hours).map(([key, h]) => ({
      key,
      days: [...h.days],
      opens: h.opens,
      closes: h.closes,
    }));

    /* dayOfWeek 값 검증 — 시각만 보고 요일을 안 보면 「일요일도 하나요」에
       틀린 답이 나간다. 좌표 검사와 같은 구조로 (표준값·중복·누락)까지 본다.
       요일 구성 자체는 clinic.ts 가 정본이다. */
    const allDays = specs.flatMap((s) => [].concat(s.dayOfWeek || []));
    if (specs.some((s) => [].concat(s.dayOfWeek || []).length === 0))
      errors.push("openingHoursSpecification 항목에 dayOfWeek 가 비어 있다");

    const nonStandard = allDays.filter((d) => !SCHEMA_DAYS.includes(d));
    if (nonStandard.length)
      errors.push(
        `dayOfWeek 가 schema.org 표준 문자열이 아니다 — ${[...new Set(nonStandard)]
          .map((d) => JSON.stringify(d))
          .join(", ")} (허용: ${SCHEMA_DAYS.join(", ")})`
      );

    /* 한 요일이 여러 구간에 나오는 것은 정상이다 — 평일은 점심을 비우느라
       오전·오후 두 구간으로 나뉜다. 문제가 되는 것은 **구간이 겹치는 경우**다.
       겹치면 그 시각에 어느 쪽이 읽힐지 알 수 없다. */
    for (const day of SCHEMA_DAYS) {
      const ranges = specs
        .filter((s) => [].concat(s.dayOfWeek || []).includes(day))
        .map((s) => [toMinutes(s.opens), toMinutes(s.closes)])
        .filter(([o, c]) => o !== null && c !== null)
        .sort((a, b) => a[0] - b[0]);
      for (let i = 1; i < ranges.length; i += 1) {
        if (ranges[i][0] < ranges[i - 1][1]) {
          errors.push(
            `openingHours 구간이 겹친다 — ${day} 에 ${ranges[i - 1][0]}분~${ranges[i - 1][1]}분과 ${ranges[i][0]}분~${ranges[i][1]}분이 중첩`
          );
          break;
        }
      }
    }

    const missingDays = SCHEMA_DAYS.filter((d) => !allDays.includes(d));
    if (missingDays.length)
      errors.push(
        `openingHoursSpecification 에 빠진 요일이 있다 — ${missingDays.join(", ")} (빠진 요일은 휴진으로 읽힌다)`
      );

    for (const { key, days, opens, closes } of WANT) {
      // 같은 요일 구성이 둘(평일 오전·오후) 있으므로 시각까지 맞춰 찾는다
      const spec = specs.find(
        (s) =>
          days.every((d) => [].concat(s.dayOfWeek || []).includes(d)) &&
          s.opens === opens &&
          s.closes === closes
      );
      if (!spec) {
        errors.push(
          `openingHours 에 ${key}(${days[0]}… ${opens}~${closes}) 항목이 없다`
        );
        continue;
      }
      // 요일 구성 정본 대조 — 정본에 없는 요일이 끼어든 경우까지 잡는다
      const gotDays = [].concat(spec.dayOfWeek || []);
      const extra = gotDays.filter((d) => !days.includes(d));
      if (extra.length)
        errors.push(
          `openingHours(${key}) 에 정본에 없는 요일이 있다 — ${extra.join(", ")}, 정본 ${days.join(", ")}`
        );

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

    /* ── 진료 권역 ──
       「파주시 운정」 같은 시(市)+지구 결합 문자열은 실재하는 행정구역명이 아니라
       장소 엔티티로 매칭되지 않는다. 2026-08-20 측정에서 파주 운정 질의만
       ChatGPT·Gemini 양쪽 공통 X 였고, 그 표기가 원인 후보였다. */
    const areas = clinic.areaServed || [];
    if (areas.length !== CLINIC.areaServed.length)
      errors.push(
        `areaServed 가 ${areas.length}개 — clinic.ts 는 ${CLINIC.areaServed.length}개`
      );
    for (const want of CLINIC.areaServed) {
      const got = areas.find((a) => a.name === want.name);
      if (!got) {
        errors.push(`areaServed 에 "${want.name}" 이 없다`);
        continue;
      }
      if (got["@type"] !== want.type)
        errors.push(
          `areaServed "${want.name}" 의 타입이 ${got["@type"]} — clinic.ts 는 ${want.type}`
        );
    }
    for (const a of areas) {
      const name = a.name ?? "";
      // 「시」로 끝나는 토큰 뒤에 다른 토큰이 붙으면 결합 문자열이다
      if (/(시|군|구)\s+\S/.test(name))
        errors.push(
          `areaServed "${name}" 이 결합 문자열이다 — 실재하는 행정구역명 하나만 쓸 것`
        );
      /* 타당성 — 정본 대조만으로는 **정본 자체가 틀린 경우**를 못 잡는다.
         (좌표에서 겪은 것과 같다: clinic.ts 와 출력이 사이좋게 틀려 있었다)
         접미사로 기대되는 타입을 정해 두고 어긋나면 잡는다. */
      // 「신도시」를 「시」보다 **먼저** 본다 — 운정신도시는 시(市)가 아니다
      const wantType = /(신도시|구|동|읍|면)$/.test(name)
        ? "AdministrativeArea"
        : /시$/.test(name)
          ? "City"
          : null;
      if (wantType && a["@type"] !== wantType)
        errors.push(
          `areaServed "${name}" 은 ${wantType} 여야 한다 — 지금 ${a["@type"]}`
        );
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

  /* 화면에도 같은 잣대를 댄다. 장비 상세 문안처럼 JSON-LD 에 없고
     화면에만 있는 문장이 있어서, 스키마만 보면 그냥 통과한다. */
  {
    const screen = visibleText(html);
    for (const word of FORBIDDEN_ON_SCREEN) {
      if (screen.includes(word))
        errors.push(`화면에 금지 표현 "${word}" 가 있다`);
    }
  }
  /* ── 개원 연도 ── 화면과 스키마가 갈리지 않게 ──
     진료시간 요일·실적 산출 근거·좌표에서 반복해서 갈렸던 자리다.
     스키마의 foundingDate 와 화면의 「2023년 개원 이래」를 양쪽에서 본다. */
  if (clinic) {
    const want = String(CLINIC.foundingYear);
    const got = clinic.foundingDate;
    if (!got) {
      errors.push("병원 노드에 foundingDate 가 없다");
    } else if (String(got) !== want) {
      errors.push(
        `foundingDate 가 clinic.ts 와 다르다 — 출력 "${got}", 정본 "${want}"`
      );
    }
  }
  {
    /* 화면에 「개원 이래」를 쓰면서 연도를 안 붙인 곳이 있으면 잡는다.
       스키마에만 연도가 있고 화면에는 없으면 읽는 사람에게는 없는 것이다. */
    const screen = visibleText(html).replace(/\s+/g, " ");
    const prefix = `${CLINIC.foundingYear}년 개원 이래`;
    let from = 0;
    for (;;) {
      const at = screen.indexOf("개원 이래", from);
      if (at === -1) break;
      from = at + 1;
      const head = screen.slice(Math.max(0, at - prefix.length), at + 5);
      if (!head.includes(prefix)) {
        errors.push(
          `화면의 "개원 이래" 에 연도가 없다 — "${screen.slice(Math.max(0, at - 12), at + 24).trim()}" (정본 "${prefix}")`
        );
        break;
      }
    }
  }

  const regionSup = blocks[0].match(REGION_SUPERLATIVE);
  if (regionSup)
    errors.push(
      `JSON-LD 에 지역 한정 최상급이 있다 — "${regionSup[0]}" (확인할 수 없는 주장이다)`
    );

  /* ── 실적 숫자 기준 ── WARN. 판단은 사람이 한다 ── */
  PERF_NUMBER.lastIndex = 0;
  for (const m of blocks[0].matchAll(PERF_NUMBER)) {
    /* 기준은 **문장 단위**로 본다. 고정 폭(±40자)으로 자르면
       「… 9,000건 이상 (원내 진료기록 기준).」처럼 문장 끝에 붙은 근거를
       창 밖으로 놓친다 — 실제로 그렇게 오탐이 났다.
       문장 경계는 마침표와 JSON 문자열 경계(")로 잡는다. */
    const head = blocks[0].slice(0, m.index);
    const tail = blocks[0].slice(m.index + m[0].length);
    const start = Math.max(head.lastIndexOf("."), head.lastIndexOf('"')) + 1;
    const endRel = tail.search(/[."]/);
    const around =
      head.slice(start) + m[0] + (endRel < 0 ? tail : tail.slice(0, endRel + 1));
    const hasPeriod = PERIOD_BASIS.test(around);
    const hasSource = SOURCE_BASIS.test(around);
    if (hasPeriod && hasSource) continue;
    const missing = [!hasPeriod && "기간 기준(누적/연간)", !hasSource && "산출 근거(원내 진료기록 등)"]
      .filter(Boolean)
      .join(" · ");
    warnings.push(
      `실적 숫자 "${m[0]}" 에 ${missing} 가 없다 — …${around.replace(/\s+/g, " ").slice(0, 70)}…`
    );
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

  const priceTokens = checkPrices(pagePath, html, errors);

  return {
    errors,
    warnings,
    stats: {
      nodes: graph.length,
      withId: graph.length - missingId.length,
      refs: references.length,
      faq: faqPage ? (faqPage.mainEntity || []).length : 0,
      bytes: blocks[0].length,
      priceTokens,
    },
  };
}

const paths = listPaths();
let failed = 0;
/** 경고 본문 → { 발생 페이지 수, 첫 페이지 }. 중복을 접어 요약에 띄운다 */
const warnSummary = new Map();
let totalNodes = 0;
let totalWithId = 0;
let totalRefs = 0;
let totalDangling = 0;
let totalPriceTokens = 0;
let pricePages = 0;
/* 원문에 표가 있는 글의 경로 → 파일. 렌더 결과에 <table> 이 없으면 FAIL 시킨다. */
const TABLE_POSTS = new Map(
  listPosts()
    .filter((p) => p.hasMarkdownTable && p.published)
    .map((p) => [p.path, `${p.category}/${p.id}`])
);
let tableOk = 0;
const tableBroken = [];
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

  /* 원문에 표가 있으면 렌더 결과에도 <table> 이 있어야 한다.
     remark-gfm 이 빠지면 여기서 걸린다. */
  const tableSource = TABLE_POSTS.get(p);
  if (tableSource) {
    if (/<table[\s>]/.test(html)) {
      tableOk += 1;
    } else {
      errors.push(
        `본문에 표 문법이 있는데 렌더 결과에 <table> 이 없다 (${tableSource}) — remark-gfm 을 확인하라`
      );
      tableBroken.push(tableSource);
    }
  }
  if (stats) {
    totalNodes += stats.nodes;
    totalWithId += stats.withId;
    totalRefs += stats.refs;
    if (stats.priceTokens > 0) {
      pricePages += 1;
      totalPriceTokens += stats.priceTokens;
    }
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
  /* 경고는 건수만 찍히면 아무도 안 본다. 내용을 모아 아래 요약에 띄운다.
     같은 문구가 51개 페이지에 반복되므로 중복은 접고 발생 페이지 수만 센다. */
  for (const w of warnings) {
    const hit = warnSummary.get(w);
    if (hit) hit.count += 1;
    else warnSummary.set(w, { count: 1, first: p });
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

/* 경고 요약 — 건수만 찍히면 아무도 안 본다. 내용을 띄우고 사람이 판단하게 한다.
   같은 문구가 수십 개 페이지에 반복되므로 중복은 접고 발생 페이지 수만 센다. */
if (warnSummary.size) {
  console.log(`경고         ${warnSummary.size}종 (실패는 아니다 — 사람이 판단할 것)`);
  for (const [msg, { count }] of warnSummary) {
    console.log(`  ! ${msg}  (${count}개 페이지)`);
  }
} else {
  console.log("경고         0건");
}

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

/* ── /pain 부위 그룹 양방향 대조 ────────────────────────────
   자동 분류를 쓰지 않고 명시 배열로 두는 대신, 배열과 실제 글 목록이
   갈리지 않는지 양쪽에서 본다.
     ① 배열에 있는데 발행된 글이 없다  (죽은 링크가 허브에 뜬다)
     ② 발행된 글인데 배열에 없다        (inbound 0 인 글이 생긴다)
     ③ 같은 슬러그가 두 그룹에 있다
   예외를 조용히 넘기지 않는다 — 건수를 항상 출력한다. */
{
  const published = listPosts().filter(
    (p) => p.category === "pain" && p.published && p.status !== "under_review"
  );
  const publishedSlugs = new Set(published.map((p) => p.slug));
  const listed = painGroupSlugs();

  const dangling = listed.filter((slug) => !publishedSlugs.has(slug));
  const orphan = published
    .map((p) => p.slug)
    .filter((slug) => !listed.includes(slug));
  const dupes = listed.filter((slug, i) => listed.indexOf(slug) !== i);

  console.log(
    `/pain 그룹     ${PAIN_GROUP_ORDER.length}그룹 · 배열 ${listed.length}건 · 발행 ${published.length}편 · ` +
      `배열에만 ${dangling.length} · 글에만 ${orphan.length} · 중복 ${dupes.length}`
  );
  for (const name of PAIN_GROUP_ORDER) {
    console.log(`  · ${name} — ${(PAIN_GROUP_POSTS[name] ?? []).length}편`);
  }
  /* 허브 ↔ 글 양방향. 허브가 글을 링크하는 것만으로는 한쪽이다.
     전역 내비게이션의 링크는 모든 페이지에 똑같이 있어 신호가 되지 않으므로
     본문 블록의 앵커 라벨로 센다. */
  const hubMisses = [];
  for (const [group, hub] of Object.entries(PAIN_GROUP_HUB)) {
    const slugs = PAIN_GROUP_POSTS[group] ?? [];
    let hubHtml = "";
    try {
      const res = await fetch(`${BASE}${hub.href}`);
      hubHtml = res.ok ? await res.text() : "";
    } catch {
      hubHtml = "";
    }
    if (!hubHtml) {
      hubMisses.push(`${hub.href} 응답 없음`);
      continue;
    }
    for (const slug of slugs) {
      if (!hubHtml.includes(encodeURIComponent(slug)))
        hubMisses.push(`${hub.href} → ${slug} 링크 없음`);
      let postHtml = "";
      try {
        const res = await fetch(`${BASE}${postPath("pain", slug)}`);
        postHtml = res.ok ? await res.text() : "";
      } catch {
        postHtml = "";
      }
      if (!postHtml.includes(hub.label))
        hubMisses.push(`${slug} → ${hub.href} 역링크 없음`);
    }
  }
  console.log(
    `  허브 양방향   ${Object.keys(PAIN_GROUP_HUB).length}그룹 · 누락 ${hubMisses.length}건`
  );
  if (hubMisses.length) {
    failed += 1;
    for (const m of hubMisses) console.log(`  ! ${m}`);
    failures.push(`허브 양방향 누락 ${hubMisses.length}건`);
  }

  if (dangling.length || orphan.length || dupes.length) {
    failed += 1;
    if (dangling.length)
      console.log(`  ! 배열에 있으나 발행된 글이 없다: ${dangling.join(", ")}`);
    if (orphan.length)
      console.log(`  ! 발행됐으나 어느 그룹에도 없다: ${orphan.join(", ")}`);
    if (dupes.length)
      console.log(`  ! 두 그룹에 중복: ${[...new Set(dupes)].join(", ")}`);
    failures.push(
      `pain 그룹 불일치 — 배열에만 ${dangling.length} · 글에만 ${orphan.length} · 중복 ${dupes.length}`
    );
  }
}

console.log(
  `표 렌더링      원문에 표 있는 글 ${TABLE_POSTS.size}편 · <table> 생성 ${tableOk}편 · 미생성 ${tableBroken.length}편`
);
if (tableBroken.length) {
  console.log(`  ! 미생성: ${tableBroken.join(", ")}`);
}
if (TABLE_POSTS.size === 0) {
  failed += 1;
  const msg = "표 검사 대상이 0편이다 — hasMarkdownTable 을 확인하라";
  console.log(`  ! ${msg}`);
  failures.push(msg);
}

/* 가격 정본 대조 결과. 건수만 찍으면 아무도 안 보므로 정본 표 자체를 같이 띄운다.
   검사 대상이 0페이지면 스코프 정규식이 깨진 것이다 — 조용히 통과시키지 않는다. */
console.log(
  `가격 일관성    skin ${pricePages}페이지 · 금액 ${totalPriceTokens}건 대조 · 정본 ${SPOT_PRICE_ROWS.length}행`
);
for (const r of SPOT_PRICE_ROWS) {
  console.log(`  · ${r.name} — 100개까지 ${won(r.upTo100)} / 무제한 ${won(r.unlimited)}`);
}
for (const p of AFTERCARE_PRODUCTS) {
  console.log(`  · ${p.name} ${p.volume} — ${won(p.price)}`);
}
if (pricePages === 0) {
  failed += 1;
  const msg = "가격 검사가 한 페이지도 돌지 않았다 — PRICE_SCOPE_RE 를 확인하라";
  console.log(`  ! ${msg}`);
  failures.push(msg);
}

if (failed) {
  console.log("\n실패 목록:");
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log("\n전부 통과.");
