/**
 * 사이트 전체 구조화 데이터(JSON-LD)의 단일 소스.
 *
 * 페이지 파일에 JSON-LD 리터럴을 직접 쓰지 않는다. 모든 페이지는
 * buildGraph() 로 노드 배열을 만들고 <JsonLd graph={...} /> 로 한 번만 출력한다.
 *
 * 원칙
 * - 페이지마다 <script type="application/ld+json"> 은 딱 하나, 내용은 @graph 배열 하나.
 * - 병원·웹사이트 노드는 51개 페이지 전부에 완전한 형태로 들어간다.
 *   동일성을 보장하는 것은 출현 횟수가 아니라 @id 값이므로, @id 만 전 페이지에서 같으면 된다.
 * - 노드 간 관계는 전부 { "@id": ... } 참조로 연결한다. 익명 노드를 만들지 않는다.
 */

/**
 * **`@/lib/clinic` 으로 바꾸지 말 것.** 상대경로 + `.ts` 확장자여야 한다.
 *
 * scripts/test-schema.mjs · test-slug.mjs 가 이 파일을 Next 밖에서
 * `node --experimental-strip-types` 로 직접 불러 쓴다. 거긴 tsconfig 의
 * 경로 별칭(@/)이 없어서 `@/lib/clinic` 은 ERR_MODULE_NOT_FOUND 로 죽는다.
 * (실제로 이 import 를 별칭으로 넣었다가 테스트 2건이 깨졌다)
 *
 * 같은 이유로 lib/post-faq.ts 는 아예 의존을 두지 않는다.
 */
import { CLINIC } from "./clinic.ts";

export const BASE_URL = "https://www.ilsanhan.com";

/* ────────────────────────────────────────────────────────────
 * URL / @id 헬퍼
 * ────────────────────────────────────────────────────────── */

/** 후행 슬래시를 제거하고 선행 슬래시를 보장한다. 홈은 "/" 로 정규화. */
export function normalizePath(path: string): string {
  if (!path || path === "/") return "/";
  const withLeading = path.startsWith("/") ? path : `/${path}`;
  return withLeading.replace(/\/+$/, "") || "/";
}

/**
 * 페이지의 절대 URL. canonical(alternates.canonical)과 반드시 같은 표기를 쓴다.
 * 홈은 후행 슬래시 없이 `https://www.ilsanhan.com`.
 */
export function absoluteUrl(path: string): string {
  const p = normalizePath(path);
  return p === "/" ? BASE_URL : `${BASE_URL}${p}`;
}

/**
 * 노드 @id 생성기. 문자열 조합으로 @id 를 만들지 말고 반드시 이 함수를 쓴다.
 *
 * 홈(`/`)만 예외적으로 후행 슬래시를 붙인다 —
 * `${BASE_URL}#webpage`(슬래시 없음)와 `${BASE_URL}/#clinic`(슬래시 있음)이
 * 섞이면 호스트 표기가 갈려 엔티티 병합이 조용히 실패한다.
 * 홈의 모든 @id 는 `https://www.ilsanhan.com/#...` 로 통일된다.
 */
export function pageId(path: string, fragment: string): string {
  const p = normalizePath(path);
  const base = p === "/" ? `${BASE_URL}/` : `${BASE_URL}${p}`;
  return `${base}#${fragment}`;
}

/** 상대경로를 절대 URL 로. 이미 절대 URL 이면 그대로 둔다. */
export function toAbsolute(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${BASE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export type SchemaNode = Record<string, unknown>;

/** 다른 노드로의 참조. */
export function ref(id: string): { "@id": string } {
  return { "@id": id };
}

export const CLINIC_ID = pageId("/", "clinic");
export const WEBSITE_ID = pageId("/", "website");
export const NAV_ID = pageId("/", "nav");
export const LOGO_ID = pageId("/", "logo");

/* ────────────────────────────────────────────────────────────
 * 의료진 — 이름 → @id 슬러그
 * ────────────────────────────────────────────────────────── */

/**
 * Physician 정식 노드는 /doctor 에만 둔다(중복 방지).
 * 다른 페이지에서는 이 @id 로 참조만 한다.
 * 성이 겹치는 원장(박건희·박동석)이 있어 이름 전체를 로마자로 쓴다.
 */
export const DOCTOR_SLUGS: Record<string, string> = {
  장경진: "jang-kyungjin",
  남태훈: "nam-taehoon",
  박건희: "park-gunhee",
  강민석: "kang-minseok",
  박동석: "park-dongseok",
  이명주: "lee-myungju",
};

/** 의료진 이름 → Physician @id. 등록되지 않은 이름이면 undefined. */
export function doctorId(name?: string): string | undefined {
  if (!name) return undefined;
  const slug = DOCTOR_SLUGS[name.trim()];
  return slug ? pageId("/doctor", slug) : undefined;
}

/**
 * /doctor 페이지의 Physician 정식 노드 @id.
 * 미등록 이름이어도 @id 가 비지 않도록 이름 자체를 슬러그로 폴백한다.
 * (글 author 폴백은 doctorId — 거긴 미등록이면 병원 노드로 되돌린다)
 */
export function physicianId(name: string): string {
  return doctorId(name) ?? pageId("/doctor", encodeURIComponent(name.trim()));
}

/* ────────────────────────────────────────────────────────────
 * 이동경로 — 경로 문자열에서 자동 생성
 * ────────────────────────────────────────────────────────── */

/**
 * 경로 세그먼트 → 한글 라벨.
 * 여기에 없는 세그먼트(개별 글 슬러그 등)는 해당 페이지의 제목을 라벨로 쓴다.
 */
const SEGMENT_LABELS: Record<string, string> = {
  pain: "통증 · 근골격",
  acute: "급성 통증",
  chronic: "만성 통증",
  accident: "교통사고",
  internal: "내과",
  dyspepsia: "소화불량",
  autonomic: "자율신경",
  care: "이명 · 어지럼 · 두통",
  diet: "다이어트",
  program: "다이어트 처방",
  skin: "피부 · 레이저",
  spot: "잡티 제거",
  about: "병원 소개",
  doctor: "의료진",
  contact: "오시는 길",
  column: "의학칼럼",
  media: "유튜브",
  blog: "블로그",
  treatment: "진료 안내",
};

/**
 * 라우트가 존재하지 않는 중간 세그먼트 — 이동경로에서 평탄화한다.
 *
 * `/internal` 에는 인덱스 페이지가 없다. BreadcrumbList 규격상 `item` 생략은
 * 마지막 항목에만 허용되므로, 404 URL 을 넣거나 중간 item 을 비우는 대신
 * `홈 > 소화불량` 으로 한 단계 줄인다.
 * (근본 해법은 /internal 인덱스 신설 — 이번 작업 범위 밖)
 */
const NON_ROUTE_SEGMENTS = new Set(["internal"]);

/**
 * 경로에서 BreadcrumbList 를 만든다. 페이지마다 배열을 손으로 쓰지 않는다.
 *
 * @param path         사이트 루트 기준 경로
 * @param currentName  라벨 매핑에 없는 마지막 세그먼트(글 슬러그 등)의 폴백 제목
 */
export function buildBreadcrumb(path: string, currentName?: string): SchemaNode {
  const p = normalizePath(path);
  const crumbs: Array<{ name: string; url: string }> = [
    { name: "홈", url: BASE_URL },
  ];

  if (p !== "/") {
    const segments = p.slice(1).split("/");
    let acc = "";
    segments.forEach((segment, i) => {
      acc += `/${segment}`;
      if (NON_ROUTE_SEGMENTS.has(segment)) return;
      const isLast = i === segments.length - 1;
      // 매핑 → (마지막이면) 페이지 제목 → 세그먼트 원문. 빌드를 실패시키지 않는다.
      const label =
        SEGMENT_LABELS[segment] ?? (isLast ? currentName : undefined) ?? segment;
      crumbs.push({ name: label, url: `${BASE_URL}${acc}` });
    });
  }

  return {
    "@type": "BreadcrumbList",
    "@id": pageId(path, "breadcrumb"),
    itemListElement: crumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: crumb.name,
      // 마지막 항목에도 item URL 을 포함한다.
      item: crumb.url,
    })),
  };
}

/* ────────────────────────────────────────────────────────────
 * 병원 / 웹사이트 / 전역 내비게이션 노드
 * ────────────────────────────────────────────────────────── */

/**
 * 병원 노드 — 사이트 전역 공통. 값은 전부 기존 layout.tsx 에서 승계했다.
 *
 * employee[] 는 의도적으로 제거했다. Physician 정식 노드는 /doctor 에만 두고
 * 병원↔의료진 관계는 Physician.worksFor 방향으로만 표현한다
 * (전역에 6인을 실으면 51개 페이지 용량만 늘고 /doctor 에서 중복된다).
 *
 * logo 와 image 는 역할이 다르다. logo 는 정사각 도장 로고(#logo, 512x512)를
 * 참조하고, image 는 대표 사진(og-image.jpg, 1280x846)을 그대로 둔다.
 * 단체사진을 로고로 선언하면 잘못된 값이고, 반대도 마찬가지다.
 */
export function clinicNode(): SchemaNode {
  return {
    "@type": ["MedicalClinic", "LocalBusiness"],
    "@id": CLINIC_ID,
    name: "일산한의원",
    alternateName: "일산한의원 이마트풍산점",
    description:
      "6인의 한의사가 4개 분과를 협진합니다. 근골격계, 자율신경, 다이어트, 피부레이저 특화. 누적 13,000명이 80,000회 내원. 누적 9,000건 한방 다이어트 처방.",
    url: BASE_URL,
    logo: ref(LOGO_ID),
    image: `${BASE_URL}/og-image.jpg`,
    telephone: CLINIC.telIntl,
    priceRange: "₩₩",
    publicAccess: true,
    isAcceptingNewPatients: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${CLINIC.streetAddress}, ${CLINIC.building}`,
      addressLocality: CLINIC.addressLocality,
      addressRegion: CLINIC.addressRegion,
      postalCode: CLINIC.postalCode,
      addressCountry: "KR",
    },
    // 좌표는 lib/clinic.ts 가 정본이다. 이전 값은 실제 위치에서 10km 벗어나 있었다.
    geo: {
      "@type": "GeoCoordinates",
      latitude: CLINIC.geo.latitude,
      longitude: CLINIC.geo.longitude,
    },
    areaServed: [
      { "@type": "City", name: "고양시" },
      { "@type": "AdministrativeArea", name: "일산동구" },
      { "@type": "AdministrativeArea", name: "일산서구" },
      { "@type": "AdministrativeArea", name: "덕양구" },
      { "@type": "AdministrativeArea", name: "파주시 운정" },
    ],
    availableService: [
      { "@type": "MedicalTherapy", name: "침 치료" },
      { "@type": "MedicalTherapy", name: "추나요법" },
      { "@type": "MedicalTherapy", name: "약침 치료" },
      { "@type": "MedicalTherapy", name: "한약 처방" },
      { "@type": "MedicalTherapy", name: "물리치료" },
      { "@type": "MedicalTherapy", name: "체외충격파" },
      { "@type": "MedicalTest", name: "근골격계 초음파 진단" },
      { "@type": "MedicalTherapy", name: "피부 CO2 레이저" },
    ],
    // 시간 값은 lib/clinic.ts 가 정본이다. 화면 표기도 같은 값에서 파생된다.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: CLINIC.hours.weekday.opens,
        closes: CLINIC.hours.weekday.closes,
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: CLINIC.hours.weekend.opens,
        closes: CLINIC.hours.weekend.closes,
      },
    ],
    // schema.org MedicalSpecialty 열거형으로만 쓴다 — 한글 자유텍스트는
    // INVALID_SCHEMA_ENUM_VALUE 오류를 낸다. 사람이 읽는 분과명과
    // 한의학 고유 시술명은 아래 knowsAbout 으로 옮겼다.
    medicalSpecialty: [
      "Musculoskeletal", // 근골격계·통증
      "PrimaryCare", // 자율신경·내과 (이명·두통·소화불량 포괄)
      "DietNutrition", // 한방비만·다이어트
      "Dermatology", // 피부·미용레이저
    ],
    /**
     * 열거형에 한의학이 없어서 비는 자리를 메우는 자유텍스트 필드.
     * 생성형 검색이 "일산에서 추나 하는 곳" 같은 질문에서 붙잡을 문자열이다.
     * 실제 진료 항목(availableService)과 진료 페이지 주제에서만 가져온다.
     */
    knowsAbout: [
      "근골격계·통증",
      "자율신경·내과",
      "한방비만·다이어트",
      "피부·미용레이저",
      "추나요법",
      "약침",
      "근골격계 초음파",
      "한방비만치료",
      "교통사고 후유증",
      "이명·어지럼·두통",
      "소화불량",
      "피부 CO2 레이저",
    ],
    amenityFeature: [
      {
        "@type": "LocationFeatureSpecification",
        name: "대형주차장",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "평일야간진료(오후8시)",
        value: true,
      },
      { "@type": "LocationFeatureSpecification", name: "주말진료", value: true },
      {
        "@type": "LocationFeatureSpecification",
        name: "초음파진단장비",
        value: true,
      },
      {
        "@type": "LocationFeatureSpecification",
        name: "6인협진시스템",
        value: true,
      },
    ],
    // 하드코딩한 6 이 /doctor 의 실제 인원과 갈리지 않도록 DOCTOR_SLUGS 에서 센다.
    // (validate-jsonld 가 /doctor 의 Physician 노드 수와도 대조한다)
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: Object.keys(DOCTOR_SLUGS).length,
    },
    // 외부 프로필 4개 — 변경/삭제 금지
    sameAs: [
      "https://naver.me/IItclnGB",
      "https://blog.naver.com/jwguin",
      "https://www.youtube.com/@%EC%9D%BC%EC%82%B0%ED%95%9C%EC%9D%98%EC%9B%90",
      "https://pf.kakao.com/_eXXun",
    ],
  };
}

/**
 * 로고 노드 — 병원 노드의 logo 가 참조하는 정사각 ImageObject.
 *
 * 파일은 scripts/build-icons.mjs 가 public/logo.svg 에서 생성한다.
 * width/height 는 실제 파일 치수(512x512)와 반드시 같아야 한다 —
 * 어긋나면 구조화 데이터가 조용히 틀린 값을 주장하게 된다.
 */
export function logoNode(): SchemaNode {
  return {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url: `${BASE_URL}/logo.png`,
    contentUrl: `${BASE_URL}/logo.png`,
    width: 512,
    height: 512,
    caption: "일산한의원",
  };
}

/**
 * 웹사이트 노드.
 * potentialAction(SearchAction)은 사이트 내 검색 기능이 없어 넣지 않는다.
 */
export function websiteNode(): SchemaNode {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: BASE_URL,
    name: "일산한의원",
    inLanguage: "ko-KR",
    publisher: ref(CLINIC_ID),
  };
}

/**
 * 전역 내비게이션 — 네이버가 사이트 메뉴 구조를 인식하도록 전 페이지에 유지한다.
 * 이름은 네비 앵커 · 푸터 사이트맵 · 각 페이지 title 과 같은 문구를 쓴다
 * (단일 소스는 lib/carousel-targets.ts).
 */
export function siteNavigationNode(): SchemaNode {
  return {
    "@type": "SiteNavigationElement",
    "@id": NAV_ID,
    isPartOf: ref(WEBSITE_ID),
    name: [
      "병원 소개",
      "의료진",
      "통증 · 근골격",
      "한방 다이어트",
      "자율신경",
      "피부 · 레이저",
      "의학칼럼",
      "유튜브",
      "오시는 길",
    ],
    url: [
      `${BASE_URL}/about`,
      `${BASE_URL}/doctor`,
      `${BASE_URL}/pain`,
      `${BASE_URL}/diet`,
      `${BASE_URL}/autonomic`,
      `${BASE_URL}/skin`,
      `${BASE_URL}/column`,
      `${BASE_URL}/media`,
      `${BASE_URL}/contact`,
    ],
  };
}

/* ────────────────────────────────────────────────────────────
 * 페이지 노드
 * ────────────────────────────────────────────────────────── */

const COLLECTION_PATHS = new Set([
  "/blog",
  "/column",
  "/media",
  "/pain",
  "/diet",
  "/skin",
  "/autonomic",
]);

const MEDICAL_PREFIXES = [
  "/pain/",
  "/internal/",
  "/diet/",
  "/skin/",
  "/autonomic/",
];

/** 경로 → 페이지 @type. */
export function pageTypeFor(path: string): string {
  const p = normalizePath(path);
  if (p === "/about") return "AboutPage";
  if (p === "/contact") return "ContactPage";
  if (COLLECTION_PATHS.has(p)) return "CollectionPage";
  if (p === "/accident") return "MedicalWebPage";
  if (MEDICAL_PREFIXES.some((prefix) => p.startsWith(prefix)))
    return "MedicalWebPage";
  return "WebPage";
}

export interface FaqEntity {
  "@type": "Question";
  name: string;
  acceptedAnswer: { "@type": "Answer"; text: string };
}

/** {q,a} 배열을 Question 노드로. */
export function faqEntities(
  faqs: ReadonlyArray<{ q: string; a: string }>
): FaqEntity[] {
  return faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  }));
}

export interface PageNodeInput {
  /** 사이트 루트 기준 경로 */
  path: string;
  /** 페이지 제목 */
  name: string;
  /** 메타 설명 */
  description?: string;
  /** 경로 기반 자동 판정을 덮어쓸 때만 */
  type?: string;
  /** 대표 이미지 (상대경로 허용) */
  image?: string;
  /**
   * FAQ 가 있으면 @type 배열에 "FAQPage" 가 추가되고 mainEntity 에 Question 이 들어간다.
   * 별도의 FAQPage 노드를 만들지 않는다 — 한 URL 에 페이지 노드는 하나뿐이다.
   */
  faq?: FaqEntity[];
  /** 페이지 고유 about (MedicalCondition 등). 병원 참조는 항상 함께 들어간다. */
  about?: unknown;
  /** FAQ 가 아닌 mainEntity (목록 페이지의 ItemList 참조 등) */
  mainEntity?: unknown;
}

export function webPageNode(input: PageNodeInput): SchemaNode {
  const url = absoluteUrl(input.path);
  const baseType = input.type ?? pageTypeFor(input.path);
  const hasFaq = !!input.faq && input.faq.length > 0;

  const about: unknown[] = [ref(CLINIC_ID)];
  if (input.about) {
    if (Array.isArray(input.about)) about.push(...input.about);
    else about.push(input.about);
  }

  return {
    "@type": hasFaq ? [baseType, "FAQPage"] : baseType,
    "@id": pageId(input.path, "webpage"),
    url,
    name: input.name,
    description: input.description,
    inLanguage: "ko-KR",
    isPartOf: ref(WEBSITE_ID),
    about,
    publisher: ref(CLINIC_ID),
    breadcrumb: ref(pageId(input.path, "breadcrumb")),
    primaryImageOfPage: input.image
      ? { "@type": "ImageObject", url: toAbsolute(input.image) }
      : undefined,
    mainEntity: hasFaq ? input.faq : input.mainEntity,
  };
}

/* ────────────────────────────────────────────────────────────
 * 글 노드
 * ────────────────────────────────────────────────────────── */

export interface ArticleNodeInput {
  path: string;
  headline: string;
  description?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  /**
   * 프론트매터 author (한의사 실명). 등록된 이름이면 Physician 노드로 연결하고,
   * 없으면 병원 노드로 폴백한다.
   */
  author?: string;
}

/**
 * 개별 글 노드. author 가 Physician 을 가리키면 참조가 끊기지 않도록
 * 호출부가 physicianStub() 을 함께 그래프에 넣는다.
 */
export function articleNode(input: ArticleNodeInput): SchemaNode {
  const webpage = pageId(input.path, "webpage");
  return {
    "@type": "Article",
    "@id": pageId(input.path, "article"),
    isPartOf: ref(webpage),
    mainEntityOfPage: ref(webpage),
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    image: input.image ? [toAbsolute(input.image)] : undefined,
    inLanguage: "ko-KR",
    author: ref(doctorId(input.author) ?? CLINIC_ID),
    publisher: ref(CLINIC_ID),
  };
}

/**
 * 글 목록(ItemList)에 실리는 Article 스텁.
 * 정식 정의는 그 글의 상세 페이지에 있고, 여기서는 @type + @id + 최소 속성만 둔다.
 * (교차 페이지 스텁이므로 참조 무결성 검사에서 끊긴 참조로 보지 않는다)
 */
export function articleStub(input: ArticleNodeInput): SchemaNode {
  return {
    "@type": "Article",
    "@id": pageId(input.path, "article"),
    url: absoluteUrl(input.path),
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    image: input.image ? [toAbsolute(input.image)] : undefined,
    author: ref(doctorId(input.author) ?? CLINIC_ID),
    publisher: ref(CLINIC_ID),
  };
}

/** 글 author 가 가리키는 Physician 의 최소 노드 (참조가 끊기지 않도록). */
export function physicianStub(name?: string): SchemaNode | undefined {
  const id = doctorId(name);
  if (!id || !name) return undefined;
  return {
    "@type": "Physician",
    "@id": id,
    name,
    url: `${BASE_URL}/doctor`,
    worksFor: ref(CLINIC_ID),
  };
}

/**
 * 여러 글의 author 를 한 번에 Physician 스텁으로. 중복은 하나만 남긴다.
 *
 * 목록 페이지(홈·/blog·카테고리)는 articleStub() 안에 author 참조를 싣는데,
 * 그 참조가 가리키는 Physician 노드가 같은 그래프에 없으면 끊긴 참조가 된다.
 * 상세 페이지는 physicianStub() 하나로 해결하지만 목록은 글이 여럿이라
 * 이 헬퍼가 필요하다. (author 없는 글은 병원 노드로 폴백하므로 대상이 아니다)
 */
export function physicianStubs(
  names: ReadonlyArray<string | undefined>
): SchemaNode[] {
  const seen = new Set<string>();
  const out: SchemaNode[] = [];
  for (const name of names) {
    const id = doctorId(name);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    const stub = physicianStub(name);
    if (stub) out.push(stub);
  }
  return out;
}

/* ────────────────────────────────────────────────────────────
 * 목록 노드
 * ────────────────────────────────────────────────────────── */

export interface ItemListEntry {
  url: string;
  name: string;
  image?: string;
  /** 글 목록이면 Article 스텁을 함께 싣는다 */
  item?: SchemaNode;
}

/**
 * 목록 노드.
 *
 * ⚠ 홈(/)에는 ItemList 가 의도적으로 2개다 — #treatment-list(진료 카드 7개)와
 * #recent-posts(최신 글 5개). 둘 다 네이버 캐러셀 대응용이고 화면 카드와 1:1로
 * 맞춰둔 구조라 합치면 그 대응이 깨진다.
 *
 * 그 탓에 Google Rich Results Test 가 홈에서 "페이지에 여러 ListItem 요소가
 * 정의됨" 캐러셀 경고를 띄우는데, **무시한다.**
 * - 마크업 유효성 문제가 아니라 캐러셀 리치결과 적격성만의 문제다.
 * - Google 캐러셀 리치결과는 레시피·코스·영화·음식점 등 특정 타입 전용이라
 *   한의원은 애초에 대상이 아니다. 합쳐도 얻을 게 없다.
 * - 같은 그래프의 Article 5개는 그대로 "글" 유효 항목으로 인식된다.
 * - BreadcrumbList 는 이 경고와 무관하다 (ItemList 1개인 /pain 은 경고 없음으로 확인).
 */
export function itemListNode(
  path: string,
  fragment: string,
  name: string,
  entries: ItemListEntry[]
): SchemaNode {
  return {
    "@type": "ItemList",
    "@id": pageId(path, fragment),
    name,
    mainEntityOfPage: ref(pageId(path, "webpage")),
    itemListElement: entries.map((entry, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: entry.url,
      name: entry.name,
      image: entry.image || undefined,
      item: entry.item,
    })),
  };
}

/* ────────────────────────────────────────────────────────────
 * 그래프 조립
 * ────────────────────────────────────────────────────────── */

export interface GraphInput extends PageNodeInput {
  /** 라벨 매핑에 없는 마지막 세그먼트의 이동경로 라벨 (글 제목 등) */
  breadcrumbName?: string;
  /** Article / ItemList / Physician 등 페이지 고유 노드 */
  nodes?: Array<SchemaNode | undefined>;
}

/**
 * 페이지의 @graph 배열. 병원 · 로고 · 웹사이트 · 내비 · 페이지 · 이동경로가 항상 들어가고,
 * 그 뒤에 페이지 고유 노드가 붙는다.
 */
export function buildGraph(input: GraphInput): SchemaNode[] {
  const { breadcrumbName, nodes = [], ...pageInput } = input;
  const graph: Array<SchemaNode | undefined> = [
    clinicNode(),
    logoNode(),
    websiteNode(),
    siteNavigationNode(),
    webPageNode(pageInput),
    buildBreadcrumb(input.path, breadcrumbName ?? input.name),
    ...nodes,
  ];
  return graph.filter((node): node is SchemaNode => !!node).map(prune);
}

/** undefined 값을 가진 키를 직렬화 전에 제거한다. */
export function prune<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .filter((v) => v !== undefined)
      .map((v) => prune(v)) as unknown as T;
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      if (val === undefined) continue;
      out[key] = prune(val);
    }
    return out as T;
  }
  return value;
}
