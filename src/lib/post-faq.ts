/**
 * 글 본문의 "자주 묻는 질문" 섹션 → FAQ 쌍 추출.
 *
 * ## 왜 본문을 파싱하는가
 *
 * FAQ 를 프론트매터로 옮기면 본문에서 그 섹션을 들어내야 한다. 글쓴이가 쓴
 * 본문을 구조 때문에 고치게 되고, 앞으로 들어올 글마다 같은 작업이 붙는다.
 *
 * 본문을 유일한 소스로 두면 **화면에 없는 FAQ 가 스키마에만 실리는 일이
 * 구조적으로 불가능하다.** 스키마가 화면에 렌더되는 그 문자열에서 파생되기
 * 때문이다. (호출부는 autoLinkMarkdown 을 거친 최종 본문을 넘긴다)
 *
 * 대신 마크다운 형식에 의존한다. 그 약점은 검증기가 막는다 —
 * scripts/validate-jsonld.mjs 가 "섹션은 있는데 0쌍" 인 글을 실패시킨다.
 * 조용히 비는 대신 요란하게 깨지도록 만든 것이다.
 *
 * ## 의존하는 형식
 *
 *   ## 자주 묻는 질문
 *
 *   **Q. 질문 문장?**
 *
 *   답변 문단.
 *
 * 이 파일은 **어떤 모듈도 import 하지 않는다.** 검증 스크립트가 Next 의
 * 경로 별칭(@/) 없이 직접 불러 쓰기 때문이다. 의존을 추가하지 말 것.
 */

/** 섹션 제목으로 인정하는 문구 */
const FAQ_HEADINGS = ["자주 묻는 질문", "자주묻는질문", "FAQ"];

/** 섹션 시작 — `## 자주 묻는 질문` (### 도 허용) */
const HEADING_RE = new RegExp(
  `^#{2,3}[ \t]*(?:${FAQ_HEADINGS.join("|")})[ \t]*$`,
  "im"
);

/** 섹션 끝 — 다음 헤딩 또는 수평선 */
const SECTION_END_RE = /^(?:#{1,6}[ \t]|-{3,}[ \t]*$|\*{3,}[ \t]*$)/m;

/** `**Q. ...**` 한 줄 */
const QUESTION_RE = /^\*\*Q[.．]?[ \t]*([\s\S]*?)\*\*[ \t]*$/gm;

export interface PostFaq {
  q: string;
  a: string;
}

/** 본문에 FAQ 섹션이 있는가 (쌍이 0개여도 true — 검증기가 이 차이를 잡는다) */
export function hasFaqSection(markdown: string): boolean {
  return HEADING_RE.test(markdown ?? "");
}

/**
 * 마크다운 장식을 걷어 스키마에 넣을 평문으로.
 * 링크는 표시 문자열만 남긴다 — 화면에서 사람이 읽는 것과 같은 글자다.
 */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // 이미지 제거
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // 링크 → 표시 문자열
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "$1")
    .replace(/^>[ \t]?/gm, "")
    .split(/\n{2,}/) // 문단 구분은 유지한다
    .map((para) => para.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();
}

/**
 * 본문에서 FAQ 쌍을 뽑는다. 섹션이 없거나 형식이 어긋나면 빈 배열.
 *
 * 화면 렌더와 어긋나지 않도록, 호출부는 **실제로 렌더하는 마크다운**을 넘긴다.
 */
export function parsePostFaq(markdown: string): PostFaq[] {
  const source = markdown ?? "";
  const heading = source.match(HEADING_RE);
  if (!heading || heading.index === undefined) return [];

  const afterHeading = source.slice(heading.index + heading[0].length);
  const end = afterHeading.match(SECTION_END_RE);
  const section =
    end && end.index !== undefined
      ? afterHeading.slice(0, end.index)
      : afterHeading;

  // 질문 위치를 먼저 모으고, 답변은 "다음 질문 직전까지" 로 자른다.
  const marks: Array<{ q: string; start: number; end: number }> = [];
  QUESTION_RE.lastIndex = 0;
  for (const m of section.matchAll(QUESTION_RE)) {
    if (m.index === undefined) continue;
    marks.push({ q: m[1], start: m.index, end: m.index + m[0].length });
  }

  const faqs: PostFaq[] = [];
  marks.forEach((mark, i) => {
    // 답변은 이 질문 줄 다음부터 **다음 질문 줄이 시작하기 직전까지**
    const stop = i + 1 < marks.length ? marks[i + 1].start : section.length;
    const q = toPlainText(mark.q);
    const a = toPlainText(section.slice(mark.end, stop));
    if (q && a) faqs.push({ q, a });
  });

  return faqs;
}
