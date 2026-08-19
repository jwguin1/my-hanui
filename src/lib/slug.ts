/**
 * 글 슬러그의 단일 소스 — 정규화 · 검증 · 후보 생성 · URL 조립.
 *
 * 규칙
 * - 한글 슬러그를 쓴다: `/pain/어깨-석회화건염-치료`
 * - 계층은 한 단계다: `/{카테고리}/{슬러그}`. 증상 레이어를 두지 않는다.
 * - **슬러그는 발행 후 불변이다.** 제목을 고쳐도 따라 바뀌지 않는다.
 *   그래서 생성 시점에 프론트매터에 기록하고 이후 재계산하지 않는다.
 *
 * 왜 이 파일이 필요한가
 * - 한글은 자모 분리형(NFD)과 완성형(NFC)이 육안으로 같아 보이지만 다른 문자열이다.
 *   OS·입력기에 따라 NFD 가 섞여 들어오면 라우트 매칭이 조용히 실패한다.
 *   정규화를 여기 한 곳에 몰고, 호출부에서 normalize() 를 직접 부르지 않는다.
 * - canonical / og:url / JSON-LD @id / sitemap 이 한 글자라도 다르면 엔티티 병합이
 *   실패한다. 절대 URL 은 postPath() 를 거쳐서만 만든다.
 *   호출부에서 encodeURIComponent 를 직접 부르지 않는다.
 */

/** 권장 길이(한글 기준). 넘으면 경고만 한다. */
export const SLUG_RECOMMENDED_LENGTH = 25;

/**
 * 허용 최대 길이. 넘으면 실패시킨다.
 * 한글 1자는 퍼센트 인코딩하면 9자가 되므로 40자면 URL 이 360자에 이른다.
 */
export const SLUG_MAX_LENGTH = 40;

/** 한글 · 숫자 · 영문 소문자 · 하이픈만 */
const ALLOWED_RE = /^[가-힣ㄱ-ㅎㅏ-ㅣ0-9a-z-]+$/;

/**
 * 전역 예약어 — 최상위 라우트와 카테고리 인덱스.
 * 슬러그가 이 값이 되면 의미가 겹쳐 사람이 URL 을 오해한다.
 */
export const RESERVED_SLUGS: readonly string[] = [
  "pain",
  "diet",
  "skin",
  "autonomic",
  "accident",
  "internal",
  "blog",
  "column",
  "media",
  "about",
  "doctor",
  "contact",
  "treatment",
];

/**
 * 카테고리별 예약어 — **같은 세그먼트를 다투는 형제 정적 라우트**.
 *
 * 이쪽이 전역 예약어보다 실제로 위험하다. `/pain/pain` 은 [slug] 라우트라
 * 충돌하지 않지만, `/pain/acute` 는 진짜 정적 페이지다. 슬러그가 `acute` 면
 * Next 가 정적 라우트를 우선해서 그 글은 404 도 없이 **조용히 도달 불가**가 된다.
 *
 * 진료 페이지를 추가하면 여기에도 반드시 추가할 것.
 */
export const RESERVED_BY_CATEGORY: Record<string, readonly string[]> = {
  pain: ["acute", "chronic"],
  diet: ["program"],
  skin: ["spot"],
  autonomic: ["care"],
  blog: [],
};

/**
 * 슬러그 정규화 — **유일한 정규화 지점**.
 *
 * 생성할 때 · 프론트매터에서 읽을 때 · 라우트 params 로 받을 때 모두 이 함수를 통과한다.
 * 호출부에서 String.prototype.normalize 를 직접 부르지 않는다.
 */
export function normalizeSlug(raw: string): string {
  return (raw ?? "").normalize("NFC").trim();
}

/**
 * 라우트 params 로 들어온 슬러그를 읽는 **유일한** 함수.
 *
 * Next 16 은 params.slug 를 URL 세그먼트 원문 그대로 넘긴다 — 한글 슬러그면
 * `%EC%96%B4...` 로 인코딩된 문자열이다. 이걸 그대로 조회 키로 쓰면
 * 프론트매터의 한글과 매칭되지 않아 조용히 404 가 난다.
 * (실제로 이 함수 없이 빌드했더니 404 페이지가 프리렌더됐다)
 *
 * 슬러그에는 `%` 가 허용 문자가 아니므로 디코드해도 원본을 훼손하지 않는다.
 */
export function readSlugParam(raw: string): string {
  let value = raw ?? "";
  try {
    value = decodeURIComponent(value);
  } catch {
    // 잘못된 퍼센트 시퀀스는 원문 그대로 두고 매칭에서 떨어지게 한다
  }
  return normalizeSlug(value);
}

/** 하나 이상의 조사·어미로만 끝나는 토큰을 정리하기 위한 꼬리 목록 */
const TRAILING_PARTICLES = [
  "은", "는", "이", "가", "을", "를", "의", "에", "에서", "으로", "로",
  "와", "과", "도", "만", "까지", "부터", "보다",
];

/**
 * 후보에서 떨어뜨릴 말 — 제목의 수사(修辭)에 해당하는 부분.
 * 핵심 명사구만 남기는 것이 목적이므로 의문형·감탄형 꼬리를 우선 걷어낸다.
 */
const FILLER_TOKENS = new Set([
  "대체", "과연", "정말", "진짜", "도대체", "혹시", "왜", "어디로", "어디에",
  "어떻게", "무엇일까", "무엇인가", "뭘까", "걸까", "일까", "할까", "될까",
  "있을까", "없을까", "가능할까", "이란", "이라는", "라는", "그리고", "하지만",
  "차이는", "차이", "뭔가", "뭐가", "vs",
]);

function stripParticles(token: string): string {
  for (const p of TRAILING_PARTICLES) {
    if (token.length > p.length + 1 && token.endsWith(p)) {
      return token.slice(0, -p.length);
    }
  }
  return token;
}

/**
 * 제목 → 슬러그 후보들. 짧은 것부터 준다.
 *
 * 제목 전체를 그대로 쓰지 않는다 —
 * "어깨 속 석회질, 대체 어디로 이동하는 걸까?" 를 통째로 슬러그화하면
 * `어깨-속-석회질-대체-어디로-이동하는-걸까` 가 되어 URL 이 300자를 넘는다.
 *
 * 자동 판정에 기대지 말 것. 이 함수는 **후보를 제시할 뿐**이고,
 * 최종 슬러그는 사람이 정해 프론트매터에 적는 것이 정상 경로다.
 */
export function slugCandidates(title: string): string[] {
  const cleaned = normalizeSlug(title)
    .toLowerCase()
    // 조사가 아닌 특수문자 제거 (?, !, ',', '.', ~, 따옴표, 괄호 등)
    .replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ0-9a-z\s-]/g, " ");

  const tokens = cleaned
    .split(/[\s-]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .filter((t) => !FILLER_TOKENS.has(t))
    .map(stripParticles)
    .filter((t) => t.length > 0);

  const out: string[] = [];
  // 앞에서부터 토큰을 누적하며, 길이 예산 안에 드는 후보를 짧은 것부터 모은다
  for (let n = Math.min(2, tokens.length); n <= tokens.length; n += 1) {
    const candidate = joinSlug(tokens.slice(0, n));
    if (!candidate) continue;
    if (candidate.length > SLUG_MAX_LENGTH) break;
    if (!out.includes(candidate)) out.push(candidate);
  }
  // 토큰이 1개뿐이면 위 루프가 아무것도 만들지 않는다
  if (out.length === 0 && tokens.length > 0) {
    const only = joinSlug(tokens.slice(0, 1));
    if (only && only.length <= SLUG_MAX_LENGTH) out.push(only);
  }
  return out;
}

/** 토큰 배열 → 슬러그 문자열. 공백→하이픈, 연속 하이픈 축약, 앞뒤 하이픈 제거. */
function joinSlug(tokens: string[]): string {
  return normalizeSlug(
    tokens.join("-").replace(/-+/g, "-").replace(/^-|-$/g, "")
  );
}

/**
 * 임의 문자열 → 슬러그 형식으로 정리. 길이 제한은 걸지 않는다(검증이 따로 한다).
 * 사람이 적어 준 슬러그를 다듬을 때 쓴다.
 */
export function slugify(raw: string): string {
  return joinSlug(
    normalizeSlug(raw)
      .toLowerCase()
      .replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ0-9a-z\s-]/g, " ")
      .split(/[\s-]+/)
      .filter(Boolean)
  );
}

export interface SlugProblem {
  code:
    | "empty"
    | "charset"
    | "too-long"
    | "not-nfc"
    | "reserved"
    | "duplicate";
  message: string;
}

/**
 * 슬러그 검증. 통과하면 빈 배열.
 *
 * 중복은 **자동으로 번호를 붙이지 않는다.** 조용히 `-2` 가 붙으면
 * 의도하지 않은 URL 이 발행되고, 슬러그는 불변이라 되돌릴 수도 없다.
 */
export function validateSlug(
  raw: string,
  options: {
    category?: string;
    /** 같은 카테고리에 이미 있는 슬러그들 */
    existing?: readonly string[];
  } = {}
): SlugProblem[] {
  const problems: SlugProblem[] = [];
  const slug = normalizeSlug(raw);

  if (!slug) {
    return [{ code: "empty", message: "슬러그가 비었다" }];
  }

  // 원문이 NFC 가 아니면(= 정규화로 값이 바뀌면) 저장된 값 자체가 잘못된 것이다
  if (raw !== raw.normalize("NFC")) {
    problems.push({
      code: "not-nfc",
      message: "NFC 정규형이 아니다 (자모 분리형 NFD 가 섞였다)",
    });
  }

  if (!ALLOWED_RE.test(slug)) {
    const bad = [...slug].filter((ch) => !ALLOWED_RE.test(ch));
    problems.push({
      code: "charset",
      message: `허용되지 않는 문자: ${[...new Set(bad)].join("")} (한글·숫자·영문 소문자·하이픈만)`,
    });
  }

  if (slug.length > SLUG_MAX_LENGTH) {
    problems.push({
      code: "too-long",
      message: `${slug.length}자 — 최대 ${SLUG_MAX_LENGTH}자 (권장 ${SLUG_RECOMMENDED_LENGTH}자)`,
    });
  }

  const reserved = new Set<string>([
    ...RESERVED_SLUGS,
    ...(options.category ? RESERVED_BY_CATEGORY[options.category] ?? [] : []),
  ]);
  if (reserved.has(slug)) {
    problems.push({
      code: "reserved",
      message: `예약어와 충돌한다 — 같은 경로에 실제 라우트가 있어 글이 도달 불가가 된다`,
    });
  }

  if (options.existing?.some((s) => normalizeSlug(s) === slug)) {
    problems.push({
      code: "duplicate",
      message: "같은 카테고리에 이미 있다 (자동 번호를 붙이지 않는다)",
    });
  }

  return problems;
}

/* ────────────────────────────────────────────────────────────
 * URL 조립 — 인코딩은 여기서만 한다
 * ────────────────────────────────────────────────────────── */

/**
 * 슬러그 세그먼트만 퍼센트 인코딩한다. 슬래시는 인코딩하지 않는다.
 *
 * 기존 32편의 슬러그는 전부 ASCII 라 이 함수를 통과해도 값이 변하지 않는다 —
 * 즉 이번 작업으로 **기존 URL 은 한 글자도 바뀌지 않는다.**
 */
export function encodeSlug(slug: string): string {
  return encodeURIComponent(normalizeSlug(slug));
}

/**
 * 글의 사이트 루트 기준 경로. canonical · og:url · JSON-LD @id · sitemap · rss ·
 * 목록 href 가 **전부 이 함수 하나를** 통과한다.
 *
 * 여기서 미리 인코딩해 두면 이후 어떤 소비처(new URL(), Next metadata,
 * sitemap 직렬화)를 거쳐도 값이 다시 바뀌지 않는다 — 퍼센트 시퀀스는
 * 재인코딩 대상이 아니기 때문이다.
 */
export function postPath(category: string, slug: string): string {
  return `/${category}/${encodeSlug(slug)}`;
}
