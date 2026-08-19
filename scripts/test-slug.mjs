/**
 * lib/slug.ts 단위 테스트 — 서버를 띄우지 않고 돌린다.
 *   npm run test:slug
 *
 * 가장 중요한 두 가지
 * 1. **기존 32편의 URL 이 한 글자도 바뀌지 않는다.** 이번 작업의 최우선 회귀 검사다.
 * 2. NFD 로 들어온 한글이 NFC 와 같게 매칭된다. 안 그러면 라우트가 조용히 404 가 난다.
 */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const {
  RESERVED_BY_CATEGORY,
  RESERVED_SLUGS,
  SLUG_MAX_LENGTH,
  encodeSlug,
  normalizeSlug,
  postPath,
  readSlugParam,
  slugCandidates,
  slugify,
  validateSlug,
} = await import("../src/lib/slug.ts");

const { absoluteUrl, pageId } = await import("../src/lib/schema.ts");

/* ── 회귀: 기존 URL 불변 ────────────────────────────────────────── */

test("기존 ASCII 슬러그는 인코딩을 거쳐도 값이 변하지 않는다", () => {
  assert.equal(postPath("pain", "20260726-post-1"), "/pain/20260726-post-1");
  assert.equal(postPath("diet", "20260726-post-2"), "/diet/20260726-post-2");
  assert.equal(postPath("blog", "welcome"), "/blog/welcome");
  assert.equal(encodeSlug("20260419-post-2"), "20260419-post-2");
});

test("content/ 의 모든 발행 글이 파일명과 같은 URL 을 유지한다", () => {
  // 프론트매터 slug 를 새로 적기 전까지는 URL 이 파일명 그대로여야 한다.
  // 이 테스트가 깨지면 기존 32편의 색인 URL 이 움직인 것이다.
  const categories = ["pain", "diet", "autonomic", "skin", "blog"];
  let checked = 0;
  for (const category of categories) {
    const dir = path.join("content", category);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
      const { data } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
      if (data.published === false) continue;
      const id = file.replace(/\.md$/, "");
      if (data.slug) continue; // 슬러그를 명시한 새 글은 대상이 아니다
      assert.equal(
        postPath(category, id),
        `/${category}/${id}`,
        `${category}/${id} 의 URL 이 바뀌었다`
      );
      checked += 1;
    }
  }
  assert.ok(checked >= 32, `발행 글 ${checked}편만 검사됨 — 32편 이상이어야 한다`);
});

/* ── NFC 정규화 ─────────────────────────────────────────────────── */

test("NFD 입력이 NFC 와 동일하게 매칭된다", () => {
  const nfc = "어깨-석회화건염-치료";
  const nfd = nfc.normalize("NFD");

  // 육안으로는 같아 보이지만 원문은 다른 문자열이다
  assert.notEqual(nfd, nfc);
  // 정규화를 거치면 같아진다 — 라우트 매칭이 여기에 달려 있다
  assert.equal(normalizeSlug(nfd), nfc);
  assert.equal(normalizeSlug(nfd), normalizeSlug(nfc));
  // URL 도 같은 문자열이 나온다
  assert.equal(postPath("pain", nfd), postPath("pain", nfc));
});

test("NFD 슬러그는 검증에서 not-nfc 로 걸린다", () => {
  const nfd = "어깨-석회화건염-치료".normalize("NFD");
  const codes = validateSlug(nfd).map((p) => p.code);
  assert.ok(codes.includes("not-nfc"));
  // 정규형이면 통과
  assert.deepEqual(validateSlug("어깨-석회화건염-치료"), []);
});

/* ── URL 일관성 ─────────────────────────────────────────────────── */

test("canonical · @id · sitemap 이 전부 같은 문자열을 만든다", () => {
  const p = postPath("pain", "어깨-석회화건염-치료");
  // 인코딩은 postPath 안에서 한 번만 일어난다
  assert.equal(p, "/pain/%EC%96%B4%EA%B9%A8-%EC%84%9D%ED%9A%8C%ED%99%94%EA%B1%B4%EC%97%BC-%EC%B9%98%EB%A3%8C");
  assert.ok(!p.includes("%2F"), "슬래시를 인코딩하면 안 된다");

  const canonical = `https://www.ilsanhan.com${p}`;
  assert.equal(absoluteUrl(p), canonical);
  assert.equal(pageId(p, "webpage"), `${canonical}#webpage`);
  assert.equal(pageId(p, "article"), `${canonical}#article`);
  assert.equal(pageId(p, "breadcrumb"), `${canonical}#breadcrumb`);
});

test("퍼센트 시퀀스는 두 번 인코딩되지 않는다", () => {
  const p = postPath("pain", "어깨-석회화건염-치료");
  // new URL() 을 거쳐도 값이 그대로여야 한다 (sitemap 직렬화 경로)
  assert.equal(new URL(`https://www.ilsanhan.com${p}`).pathname, p);
});

/* ── 형식 규칙 ──────────────────────────────────────────────────── */

test("허용 문자만 통과한다", () => {
  assert.deepEqual(validateSlug("어깨-석회화건염-치료"), []);
  assert.deepEqual(validateSlug("co2-레이저-흉터"), []);
  assert.deepEqual(validateSlug("2026-다이어트"), []);

  const codes = (s) => validateSlug(s).map((p) => p.code);
  assert.ok(codes("어깨_석회화").includes("charset"));
  assert.ok(codes("어깨 석회화").includes("charset"));
  assert.ok(codes("어깨-석회화?").includes("charset"));
  assert.ok(codes("Shoulder-Pain").includes("charset"), "대문자는 거부한다");
});

test("길이 상한을 넘으면 실패한다", () => {
  const ok = "가".repeat(SLUG_MAX_LENGTH);
  assert.deepEqual(validateSlug(ok), []);
  const tooLong = "가".repeat(SLUG_MAX_LENGTH + 1);
  assert.ok(validateSlug(tooLong).some((p) => p.code === "too-long"));
});

test("예약어를 거부한다 — 전역과 카테고리별 둘 다", () => {
  for (const word of RESERVED_SLUGS) {
    assert.ok(
      validateSlug(word).some((p) => p.code === "reserved"),
      `${word} 가 예약어로 안 걸린다`
    );
  }
  // 형제 정적 라우트 — 이쪽이 실제로 위험하다 (404 도 없이 도달 불가가 된다)
  assert.ok(
    validateSlug("acute", { category: "pain" }).some((p) => p.code === "reserved")
  );
  assert.ok(
    validateSlug("program", { category: "diet" }).some((p) => p.code === "reserved")
  );
  // 다른 카테고리에서는 예약어가 아니다
  assert.deepEqual(validateSlug("acute", { category: "diet" }), []);
  assert.deepEqual(RESERVED_BY_CATEGORY.pain, ["acute", "chronic"]);
});

test("중복이면 실패시킨다 — 자동으로 번호를 붙이지 않는다", () => {
  const problems = validateSlug("어깨-석회화건염-치료", {
    category: "pain",
    existing: ["어깨-석회화건염-치료", "허리-디스크"],
  });
  assert.ok(problems.some((p) => p.code === "duplicate"));
  // NFD 로 저장된 기존 글과도 중복으로 잡혀야 한다
  const nfdExisting = ["어깨-석회화건염-치료".normalize("NFD")];
  assert.ok(
    validateSlug("어깨-석회화건염-치료", { existing: nfdExisting }).some(
      (p) => p.code === "duplicate"
    )
  );
});

/* ── 후보 생성 ──────────────────────────────────────────────────── */

test("제목 전체를 그대로 슬러그로 쓰지 않는다", () => {
  const title = "어깨 속 석회질, 대체 어디로 이동하는 걸까?";
  const candidates = slugCandidates(title);

  assert.ok(candidates.length > 0, "후보가 하나도 없다");
  // 의문형 꼬리와 수사는 떨어져야 한다
  for (const c of candidates) {
    assert.ok(!c.includes("걸까"), `후보에 의문 어미가 남았다: ${c}`);
    assert.ok(!c.includes("대체"), `후보에 수사가 남았다: ${c}`);
    assert.ok(c.length <= SLUG_MAX_LENGTH, `후보가 상한을 넘는다: ${c}`);
    assert.deepEqual(validateSlug(c), [], `후보가 규칙 위반: ${c}`);
  }
  // 짧은 것부터 준다 — 사람이 첫 후보를 그대로 쓰기 쉽게
  assert.ok(candidates[0].length <= candidates[candidates.length - 1].length);
});

test("후보는 특수문자를 남기지 않는다", () => {
  for (const title of [
    "CO2 레이저로 흉터와 주름까지 치료 가능할까?",
    "간헐적 단식 vs 열량제한, 체중감량 효과 차이는 뭘까?",
    "귀에서 울리는 이명, 원인과 최신 치료법은 무엇일까?",
  ]) {
    const candidates = slugCandidates(title);
    assert.ok(candidates.length > 0, `후보 없음: ${title}`);
    for (const c of candidates) {
      assert.deepEqual(validateSlug(c), [], `${title} → ${c}`);
    }
  }
});

test("slugify 는 공백과 연속 하이픈을 정리한다", () => {
  assert.equal(slugify("  어깨   석회화건염  "), "어깨-석회화건염");
  assert.equal(slugify("어깨--석회화건염"), "어깨-석회화건염");
  assert.equal(slugify("-어깨-석회화건염-"), "어깨-석회화건염");
  assert.equal(slugify("어깨, 석회화건염!"), "어깨-석회화건염");
});

/* ── 라우트 params 디코딩 ───────────────────────────────────────── */

test("라우트 params 로 들어온 인코딩 슬러그를 원문으로 되돌린다", () => {
  const slug = "어깨-석회화건염-치료";
  const encoded = encodeSlug(slug);

  // Next 는 params.slug 를 URL 세그먼트 원문(인코딩된 상태)으로 넘긴다.
  // 이걸 그대로 조회 키로 쓰면 프론트매터의 한글과 매칭되지 않아 404 가 난다.
  assert.notEqual(encoded, slug);
  assert.equal(readSlugParam(encoded), slug);
  // 이미 디코드된 값이 들어와도 그대로여야 한다 (이중 디코드 금지)
  assert.equal(readSlugParam(slug), slug);
  // NFD 로 들어와도 NFC 로 맞춘다
  assert.equal(readSlugParam(slug.normalize("NFD")), slug);
  // ASCII 슬러그는 손대지 않는다
  assert.equal(readSlugParam("20260726-post-1"), "20260726-post-1");
});

test("잘못된 퍼센트 시퀀스가 와도 예외를 던지지 않는다", () => {
  // 크롤러·스캐너가 보내는 깨진 URL 로 500 이 나면 안 된다
  assert.doesNotThrow(() => readSlugParam("%"));
  assert.doesNotThrow(() => readSlugParam("%zz"));
  assert.doesNotThrow(() => readSlugParam("%E0%A4%A"));
});
