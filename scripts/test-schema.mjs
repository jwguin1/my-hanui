/**
 * lib/schema.ts 단위 테스트 — 서버를 띄우지 않고 돌린다.
 *   npm run test:schema
 *
 * 홈(`/`) 의 URL 정규화가 가장 중요하다. `${BASE}#webpage`(슬래시 없음)와
 * `${BASE}/#clinic`(슬래시 있음)이 섞이면 호스트 표기가 갈려
 * 엔티티 병합이 조용히 실패한다 — 그래서 pageId() 헬퍼를 강제한다.
 */
import assert from "node:assert/strict";
import test from "node:test";

const {
  BASE_URL,
  CLINIC_ID,
  WEBSITE_ID,
  absoluteUrl,
  buildBreadcrumb,
  buildGraph,
  clinicNode,
  doctorId,
  LOGO_ID,
  logoNode,
  normalizePath,
  pageId,
  pageTypeFor,
  physicianId,
  prune,
} = await import("../src/lib/schema.ts");

test("홈: pageId 는 항상 슬래시를 붙여 한 가지 표기만 만든다", () => {
  assert.equal(pageId("/", "webpage"), "https://www.ilsanhan.com/#webpage");
  assert.equal(pageId("/", "clinic"), "https://www.ilsanhan.com/#clinic");
  assert.equal(CLINIC_ID, "https://www.ilsanhan.com/#clinic");
  assert.equal(WEBSITE_ID, "https://www.ilsanhan.com/#website");

  // 홈의 모든 @id 는 같은 오리진 표기를 공유한다
  const prefixes = [
    pageId("/", "webpage"),
    pageId("/", "clinic"),
    pageId("/", "website"),
    pageId("/", "nav"),
    pageId("/", "breadcrumb"),
  ].map((id) => id.slice(0, id.indexOf("#")));
  assert.deepEqual([...new Set(prefixes)], ["https://www.ilsanhan.com/"]);
});

test("홈: url 필드는 canonical 과 같이 후행 슬래시가 없다", () => {
  assert.equal(absoluteUrl("/"), "https://www.ilsanhan.com");
  assert.equal(absoluteUrl(""), "https://www.ilsanhan.com");
  assert.equal(BASE_URL, "https://www.ilsanhan.com");
});

test("경로 정규화: 후행 슬래시와 선행 슬래시", () => {
  assert.equal(normalizePath("/pain/acute/"), "/pain/acute");
  assert.equal(normalizePath("pain/acute"), "/pain/acute");
  assert.equal(normalizePath("/"), "/");
  assert.equal(pageId("/pain/acute/", "webpage"), pageId("/pain/acute", "webpage"));
});

test("하위 페이지 @id 에는 이중 슬래시가 없다", () => {
  assert.equal(
    pageId("/pain/acute", "webpage"),
    "https://www.ilsanhan.com/pain/acute#webpage"
  );
  assert.equal(absoluteUrl("/contact"), "https://www.ilsanhan.com/contact");
});

test("이동경로: 홈은 항목 1개, 마지막 항목도 item URL 을 가진다", () => {
  const home = buildBreadcrumb("/");
  assert.equal(home.itemListElement.length, 1);
  assert.equal(home.itemListElement[0].item, "https://www.ilsanhan.com");
  assert.equal(home["@id"], "https://www.ilsanhan.com/#breadcrumb");

  const acute = buildBreadcrumb("/pain/acute");
  assert.deepEqual(
    acute.itemListElement.map((i) => i.name),
    ["홈", "통증 · 근골격", "급성 통증"]
  );
  assert.ok(acute.itemListElement.every((i) => typeof i.item === "string"));
});

test("이동경로: 라우트 없는 중간 세그먼트(/internal)는 평탄화한다", () => {
  const crumb = buildBreadcrumb("/internal/dyspepsia");
  assert.deepEqual(
    crumb.itemListElement.map((i) => i.name),
    ["홈", "소화불량"]
  );
  // 404 URL 이 끼어들지 않는다
  assert.ok(
    !crumb.itemListElement.some((i) => i.item.endsWith("/internal"))
  );
});

test("이동경로: 매핑에 없는 슬러그는 제목으로 폴백한다", () => {
  const crumb = buildBreadcrumb("/pain/20260418-post-1", "수압박리술 완벽 가이드");
  assert.deepEqual(
    crumb.itemListElement.map((i) => i.name),
    ["홈", "통증 · 근골격", "수압박리술 완벽 가이드"]
  );
});

test("페이지 타입 판정", () => {
  assert.equal(pageTypeFor("/"), "WebPage");
  assert.equal(pageTypeFor("/about"), "AboutPage");
  assert.equal(pageTypeFor("/contact"), "ContactPage");
  assert.equal(pageTypeFor("/blog"), "CollectionPage");
  assert.equal(pageTypeFor("/pain"), "CollectionPage");
  assert.equal(pageTypeFor("/pain/acute"), "MedicalWebPage");
  assert.equal(pageTypeFor("/accident"), "MedicalWebPage");
  assert.equal(pageTypeFor("/internal/dyspepsia"), "MedicalWebPage");
  assert.equal(pageTypeFor("/treatment"), "WebPage");
});

test("의료진 @id", () => {
  assert.equal(doctorId("장경진"), "https://www.ilsanhan.com/doctor#jang-kyungjin");
  assert.equal(doctorId("없는사람"), undefined);
  assert.equal(doctorId(undefined), undefined);
  // 성이 겹치는 두 원장이 서로 다른 @id 를 가진다
  assert.notEqual(doctorId("박건희"), doctorId("박동석"));
  // 미등록이어도 정식 노드 @id 는 비지 않는다
  assert.ok(physicianId("없는사람").startsWith("https://www.ilsanhan.com/doctor#"));
});

test("병원 노드: sameAs 4개가 그대로 유지된다", () => {
  const clinic = clinicNode();
  assert.deepEqual(clinic.sameAs, [
    "https://naver.me/IItclnGB",
    "https://blog.naver.com/jwguin",
    "https://www.youtube.com/@%EC%9D%BC%EC%82%B0%ED%95%9C%EC%9D%98%EC%9B%90",
    "https://pf.kakao.com/_eXXun",
  ]);
  assert.deepEqual(clinic["@type"], ["MedicalClinic", "LocalBusiness"]);
  assert.equal(clinic.telephone, "+82-31-976-7706");
  // employee[] 는 /doctor 로 옮겼다
  assert.equal(clinic.employee, undefined);
});

test("FAQ 는 페이지 노드의 @type 배열에 합쳐진다 (별도 FAQPage 노드 없음)", () => {
  const graph = buildGraph({
    path: "/pain/acute",
    name: "급성 통증",
    faq: [
      {
        "@type": "Question",
        name: "질문",
        acceptedAnswer: { "@type": "Answer", text: "답변" },
      },
    ],
  });
  const pages = graph.filter((n) => String(n["@id"]).endsWith("#webpage"));
  assert.equal(pages.length, 1);
  assert.deepEqual(pages[0]["@type"], ["MedicalWebPage", "FAQPage"]);
  assert.equal(pages[0].mainEntity.length, 1);
  assert.equal(graph.filter((n) => n["@type"] === "FAQPage").length, 0);
});


test("병원 노드의 logo 는 #logo 노드를 참조하고, 그래프에 그 노드가 있다", () => {
  assert.deepEqual(clinicNode().logo, { "@id": LOGO_ID });
  assert.equal(LOGO_ID, "https://www.ilsanhan.com/#logo");

  // 참조가 끊기면 verify:jsonld 가 51개 URL 전부에서 터진다
  const graph = buildGraph({ path: "/contact", name: "오시는 길" });
  const logo = graph.find((n) => n["@id"] === LOGO_ID);
  assert.ok(logo, "@graph 에 #logo 노드가 없다");
  assert.equal(logo["@type"], "ImageObject");

  // image(대표 사진)와 logo 는 별개다 — 서로 덮어쓰지 않았는지
  assert.equal(clinicNode().image, "https://www.ilsanhan.com/og-image.jpg");
});

test("#logo 가 주장하는 치수는 실제 public/logo.png 와 같다", async () => {
  const { default: sharp } = await import("sharp");
  const meta = await sharp("public/logo.png").metadata();
  const logo = logoNode();
  assert.equal(logo.width, meta.width);
  assert.equal(logo.height, meta.height);
  assert.ok(logo.url.endsWith("/logo.png"));
});

test("prune: undefined 키를 제거한다", () => {
  assert.deepEqual(prune({ a: 1, b: undefined, c: { d: undefined, e: 2 } }), {
    a: 1,
    c: { e: 2 },
  });
  assert.deepEqual(prune([1, undefined, 2]), [1, 2]);
});

test("모든 그래프 노드는 @id 를 가진다", () => {
  const graph = buildGraph({ path: "/contact", name: "오시는 길" });
  assert.ok(graph.every((n) => typeof n["@id"] === "string"));
});

/* ── 진료시간 요일 ────────────────────────────────────────────────────────
   시각 검증은 있었지만 dayOfWeek 검증이 없었다. 요일이 틀리면
   「일요일도 진료하나요」에 그대로 틀린 답이 나간다 — 좌표와 같은 구조다.
   여기서는 서버 없이 clinicNode() 출력만 본다. */

const SCHEMA_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const openingDays = () =>
  clinicNode().openingHoursSpecification.flatMap((s) => [].concat(s.dayOfWeek ?? []));

test("진료시간: dayOfWeek 가 clinic.ts 정본과 일치한다", async () => {
  const { CLINIC } = await import("../src/lib/clinic.ts");
  const specs = clinicNode().openingHoursSpecification;

  // 평일은 점심을 비우느라 오전·오후 두 구간이다. 같은 요일 구성이 둘이므로
  // 시각까지 맞춰 찾아야 한다.
  for (const [key, h] of Object.entries(CLINIC.hours)) {
    const spec = specs.find((s) => s.opens === h.opens && s.closes === h.closes);
    assert.ok(spec, `${key}(${h.opens}~${h.closes}) 항목이 없다`);
    assert.deepEqual([].concat(spec.dayOfWeek), [...h.days], `${key} 요일 불일치`);
  }
});

test("진료시간: 일요일이 주말 항목에 들어 있다 (실제로 일요일 진료함)", () => {
  const specs = clinicNode().openingHoursSpecification;
  const sunday = specs.find((s) => [].concat(s.dayOfWeek).includes("Sunday"));
  assert.ok(sunday, "Sunday 가 어느 항목에도 없다 — 일요일이 휴진으로 읽힌다");
  assert.equal(sunday.opens, "10:00");
  assert.equal(sunday.closes, "16:00");
});

test("진료시간: dayOfWeek 값이 schema.org 표준 문자열이다", () => {
  const days = openingDays();
  const bad = days.filter((d) => !SCHEMA_DAYS.includes(d));
  assert.deepEqual(bad, [], `표준이 아닌 요일 값: ${bad.join(", ")}`);
});

/**
 * 한 요일이 여러 구간에 나오는 것은 **정상**이다 — 평일은 점심을 비우느라
 * 오전·오후로 나뉜다. 문제는 구간이 **겹치는** 경우다.
 * 겹치면 그 시각에 어느 쪽이 읽힐지 알 수 없다.
 */
test("진료시간: 같은 요일의 구간이 겹치지 않는다", () => {
  const specs = clinicNode().openingHoursSpecification;
  const toMin = (s) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m;
  };
  for (const day of SCHEMA_DAYS) {
    const ranges = specs
      .filter((s) => [].concat(s.dayOfWeek).includes(day))
      .map((s) => [toMin(s.opens), toMin(s.closes)])
      .sort((a, b) => a[0] - b[0]);
    for (let i = 1; i < ranges.length; i += 1) {
      assert.ok(
        ranges[i][0] >= ranges[i - 1][1],
        `${day} 구간 중첩: ${ranges[i - 1]} 과 ${ranges[i]}`
      );
    }
  }
});

/** 점심시간(13:00~14:00)이 실제로 비어 있는가 — 「지금 진료하나요」의 핵심 */
test("진료시간: 평일 점심시간이 어느 구간에도 속하지 않는다", async () => {
  const { CLINIC } = await import("../src/lib/clinic.ts");
  const lunchStart = CLINIC.hours.weekdayMorning.closes;
  const specs = clinicNode().openingHoursSpecification;
  const covering = specs.filter(
    (s) =>
      [].concat(s.dayOfWeek).includes("Monday") &&
      s.opens <= lunchStart &&
      s.closes > lunchStart
  );
  assert.deepEqual(
    covering,
    [],
    `점심 시작(${lunchStart})이 진료 구간에 포함돼 있다 — 13시에도 진료중으로 읽힌다`
  );
});

test("진료시간: 7요일이 빠짐없이 들어 있다", () => {
  const days = openingDays();
  const missing = SCHEMA_DAYS.filter((d) => !days.includes(d));
  assert.deepEqual(missing, [], `빠진 요일(=휴진으로 읽힘): ${missing.join(", ")}`);
});
