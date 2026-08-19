/**
 * lib/post-faq.ts 단위 테스트 — 서버를 띄우지 않고 돌린다.
 *   npm run test:faq
 *
 * 이 파서는 **화면에 렌더되는 본문**을 유일한 소스로 삼는다.
 * 그래서 여기서 지켜야 할 것은 "본문에 있는 것만, 본문에 있는 그대로" 다.
 */
import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const { parsePostFaq, hasFaqSection } = await import("../src/lib/post-faq.ts");

const SAMPLE = `앞부분 문단입니다.

## 자주 묻는 질문

**Q. 첫 번째 질문인가요?**

첫 번째 답변입니다.

**Q. 두 번째 질문인가요?**

두 번째 답변입니다.

---

맺음말 문단입니다.
`;

test("섹션에서 Q/A 쌍을 순서대로 뽑는다", () => {
  const faqs = parsePostFaq(SAMPLE);
  assert.equal(faqs.length, 2);
  assert.equal(faqs[0].q, "첫 번째 질문인가요?");
  assert.equal(faqs[0].a, "첫 번째 답변입니다.");
  assert.equal(faqs[1].q, "두 번째 질문인가요?");
  assert.equal(faqs[1].a, "두 번째 답변입니다.");
});

test("섹션 밖의 내용은 답변에 섞이지 않는다", () => {
  const faqs = parsePostFaq(SAMPLE);
  // 수평선 뒤 맺음말이 마지막 답변에 딸려 들어가면 화면과 스키마가 어긋난다
  assert.ok(!faqs[1].a.includes("맺음말"));
  assert.ok(!faqs[0].a.includes("두 번째"));
});

test("다음 헤딩에서도 섹션이 끝난다", () => {
  const faqs = parsePostFaq(`## 자주 묻는 질문

**Q. 질문?**

답변.

## 다음 섹션

여기는 FAQ 가 아닙니다.
`);
  assert.equal(faqs.length, 1);
  assert.ok(!faqs[0].a.includes("여기는 FAQ 가 아닙니다"));
});

test("마크다운 장식을 걷어 평문으로 만든다", () => {
  const faqs = parsePostFaq(`## 자주 묻는 질문

**Q. 질문?**

**강조**와 [링크](/pain/어깨)와 *기울임*이 섞인 답변입니다.
`);
  // 링크는 표시 문자열만 남는다 — 화면에서 사람이 읽는 글자와 같다
  assert.equal(faqs[0].a, "강조와 링크와 기울임이 섞인 답변입니다.");
});

test("여러 문단 답변은 문단 구분을 유지한다", () => {
  const faqs = parsePostFaq(`## 자주 묻는 질문

**Q. 질문?**

첫 문단입니다.

둘째 문단입니다.
`);
  assert.equal(faqs[0].a, "첫 문단입니다.\n\n둘째 문단입니다.");
});

test("FAQ 섹션이 없으면 빈 배열", () => {
  assert.deepEqual(parsePostFaq("## 다른 제목\n\n본문."), []);
  assert.deepEqual(parsePostFaq(""), []);
  assert.equal(hasFaqSection("## 다른 제목\n\n본문."), false);
});

test("hasFaqSection 은 쌍이 0개여도 true — 검증기가 이 차이를 잡는다", () => {
  const broken = "## 자주 묻는 질문\n\nQ. 굵게 표시하지 않은 질문\n\n답변.\n";
  assert.equal(hasFaqSection(broken), true);
  assert.equal(parsePostFaq(broken).length, 0);
});

test("content/ 의 실제 글에서 기대한 만큼 뽑힌다", () => {
  const expected = {
    "content/pain/20260819-post-1.md": 3,
    "content/pain/20260820-post-1.md": 3,
    "content/pain/20260821-post-1.md": 3,
  };
  for (const [file, count] of Object.entries(expected)) {
    if (!fs.existsSync(file)) continue;
    const { content } = matter(fs.readFileSync(file, "utf-8"));
    assert.equal(parsePostFaq(content).length, count, `${file} 의 FAQ 쌍 수`);
  }
});

test("섹션이 있는 모든 글은 한 쌍 이상 뽑힌다 (검증기와 같은 규칙)", () => {
  for (const category of ["pain", "diet", "autonomic", "skin", "blog"]) {
    const dir = path.join("content", category);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".md"))) {
      const { content } = matter(fs.readFileSync(path.join(dir, f), "utf-8"));
      if (!hasFaqSection(content)) continue;
      assert.ok(
        parsePostFaq(content).length > 0,
        `${category}/${f} — 섹션은 있는데 Q/A 를 못 뽑았다`
      );
    }
  }
});
