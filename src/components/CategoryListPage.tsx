import PatientJourney from "@/components/PatientJourney";
import MobileConsultationBar from "@/components/MobileConsultationBar";
import ConsultationActions from "@/components/ConsultationActions";
import { PAIN_JOURNEY } from "@/lib/patient-journeys";
import { CONSULTATION_GUIDE_SLUGS } from "@/lib/regional-guides";
import Link from "next/link";
import PainSymptomFinder from "@/components/PainSymptomFinder";
import DietQuestionGuide from "@/components/DietQuestionGuide";
import { DIET_QUESTIONS } from "@/lib/diet-questions";
import {
  CATEGORY_DESCRIPTION,
  CATEGORY_LABEL,
  type Category,
  getAllPosts,
  toISO8601KST,
} from "@/lib/blog-local";
import SectionReveal from "@/components/SectionReveal";
import PageHeroBanner from "@/components/PageHeroBanner";
import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import { Microscope } from "@/components/ui/icons";
import { CATEGORY_META } from "@/lib/categories";
import { postImagePath } from "@/lib/og-image";
import { postPath } from "@/lib/slug";
import {
  PAIN_GROUP_HUB,
  PAIN_GROUP_IDS,
  PAIN_GROUP_ORDER,
  PAIN_GROUP_POSTS,
  painGroupSlugs,
} from "@/lib/pain-groups";
import JsonLd from "@/components/JsonLd";
import { PIGMENTATION_GROUPS, SKIN_GUIDE_SLUGS, PIGMENTATION_PATH, LIFTING_PATH, LIFTING_SLUGS, HAIR_REMOVAL_PATH, HAIR_REMOVAL_SLUGS } from "@/lib/skin-guides";
import {
  articleStub,
  buildGraph,
  itemListNode,
  pageId,
  physicianStubs,
  ref,
} from "@/lib/schema";

const SITE_URL = "https://www.ilsanhan.com";

/**
 * 글이 0편인 카테고리에서 대신 보낼 곳.
 * 각 카테고리마다 **실제로 존재하는 진료 안내 페이지**가 하나씩 있다.
 */
const EMPTY_STATE_LINKS: Record<
  Category,
  { href: string; title: string; blurb: string }
> = {
  pain: {
    href: "/pain/chronic",
    title: "만성 통증 치료 안내",
    blurb: "석회성 건염 · 오십견 · 디스크. 비용까지 공개했습니다.",
  },
  diet: {
    href: "/diet/program",
    title: "일산감비환 처방 안내",
    blurb: "복용 방식과 확인해야 할 증상을 정리했습니다.",
  },
  skin: {
    href: "/skin/spot",
    title: "점 · 편평사마귀 · 쥐젖 제거 안내",
    blurb: "부위별 비용과 시술 후 관리까지 정리했습니다.",
  },
  autonomic: {
    href: "/autonomic/care",
    title: "이명 · 어지럼 · 두통 치료 안내",
    blurb: "증상별 치료 기준과 먼저 확인할 것을 정리했습니다.",
  },
};

function toAbsoluteUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

export default function CategoryListPage({ category }: { category: Category }) {
  const label = CATEGORY_LABEL[category];
  const description = CATEGORY_DESCRIPTION[category];
  const all = getAllPosts(category);

  /* /pain 은 날짜순이 아니라 부위 그룹 순서로 늘어놓는다.
     ItemList 도 같은 순서를 따른다 — 화면과 스키마가 갈리면 안 된다.
     배열에 없는 글은 뒤에 그대로 붙인다. 조용히 사라지게 두지 않는다. */
  const posts =
    category === "pain" || category === "skin"
      ? (() => {
          const order = category === "skin" ? SKIN_GUIDE_SLUGS : painGroupSlugs();
          const rank = new Map(order.map((slug, i) => [slug, i]));
          return [...all].sort(
            (a, b) =>
              (rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
              (rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER)
          );
        })()
      : all;

  /* 그룹 렌더용 — 슬러그를 실제 글로 바꾸고, 없는 슬러그는 버린다.
     (배열에만 있고 글이 없는 경우는 검증기가 FAIL 로 잡는다) */
  const bySlug = new Map(posts.map((post) => [post.slug, post]));
  const groups =
    category === "pain"
      ? PAIN_GROUP_ORDER.map((name) => ({
          name,
          hub: PAIN_GROUP_HUB[name],
          items: (PAIN_GROUP_POSTS[name] ?? [])
            .map((slug) => bySlug.get(slug))
            .filter((post) => post !== undefined),
        })).filter((g) => g.items.length > 0)
      : category === "skin" ? [
          ...PIGMENTATION_GROUPS.map((g) => ({ name: g.name, hub: { href: `${PIGMENTATION_PATH}#${g.id}`, label: "색소치료 안내" }, items: g.slugs.flatMap((slug) => { const post = bySlug.get(slug); return post ? [post] : []; }) })),
          { name: "슈링크·볼뉴머 리프팅", hub: { href: LIFTING_PATH, label: "리프팅 안내" }, items: LIFTING_SLUGS.flatMap((slug) => { const post = bySlug.get(slug); return post ? [post] : []; }) },
          { name: "얼굴·수염 제모", hub: { href: HAIR_REMOVAL_PATH, label: "제모 안내" }, items: HAIR_REMOVAL_SLUGS.flatMap((slug) => { const post = bySlug.get(slug); return post ? [post] : []; }) },
          { name: "피부 고민과 치료 선택", hub: { href: "/skin/questions", label: "고민별 질문 모음" }, items: posts.filter(p => CONSULTATION_GUIDE_SLUGS.includes(p.slug)) },
          { name: "점·편평사마귀·쥐젖·비립종과 시술 후 관리", hub: { href: "/skin/spot", label: "잡티 제거 안내" }, items: posts.filter((p) => !SKIN_GUIDE_SLUGS.includes(p.slug)) },
        ].filter((g) => g.items.length > 0) : [];

  const path = `/${category}`;
  const listNode = itemListNode(path, "post-list", `일산한의원 ${label}`, posts.map((post) => {
    // 파생 OG(1200x630) → 원본 썸네일 → 카테고리 대표 OG 순으로 폴백
    const image = toAbsoluteUrl(
      // 폴더 키는 파일 ID, URL 은 슬러그 — 둘을 섞지 않는다
      postImagePath(post.id, post.thumbnail, CATEGORY_META[category].ogImage)
    );
    const href = postPath(category, post.slug);
    return {
      url: `${SITE_URL}${href}`,
      name: post.title,
      image,
      // 각 글의 정식 정의는 상세 페이지에 있다 — 여기는 교차 페이지 스텁
      item: articleStub({
        path: href,
        headline: post.title,
        description: post.description,
        datePublished: toISO8601KST(post.date),
        dateModified: toISO8601KST(post.updated ?? post.date),
        image,
        author: post.author,
      }),
    };
  }));

  const graph = buildGraph({
    path,
    name: `${label} | 일산한의원`,
    description,
    image: CATEGORY_META[category].ogImage,
    mainEntity: posts.length > 0 ? ref(pageId(path, "post-list")) : undefined,
    nodes:
      posts.length > 0
        ? // 목록 카드의 author 참조가 끊기지 않도록 Physician 스텁을 함께 싣는다
          [listNode, ...physicianStubs(posts.map((p) => p.author)),
            ...(category === "diet" ? [itemListNode(path, "patient-questions", "일산감비환 복용 질문", DIET_QUESTIONS.map(question => ({ url: `${SITE_URL}${question.href}`, name: question.title })))] : []),
          ]
        : [],
  });

  return (
    <>
      <JsonLd graph={graph} />
      {category === "skin" && <nav aria-label="피부 고민별 질문" className="mx-auto max-w-5xl px-6 pt-8"><Link href="/skin/questions" className="block rounded-xl border border-line bg-surface p-5 font-semibold text-primary">내 고민에 맞는 피부 진료·질문 찾아보기 →</Link></nav>}
      {/* 통증은 증상별 진료 안내와 환자 질문을 함께 제공한다. */}
      <PageHeader
        badge={category === "pain" ? "통증 진료·환자 질문" : category === "diet" ? "일산한의원 · 감비환 안내" : "의학정보"}
        icon={<Microscope size={15} />}
        lead={label}
        subtitle={category === "diet" ? "다이어트" : undefined}
        description={category === "pain" ? "어디가 아픈지, 어떤 움직임이 불편한지부터 말씀해 주세요. 의료진이 원인을 살피고 침·추나·약침의 필요성과 비용, 경과를 다시 볼 시점을 설명합니다." : description}
      />

      {/* 네이버 하위링크 카드용 대표이미지 — 본문 최상단의 첫 이미지이자 최대 이미지.
          /autonomic 은 이번 캐러셀 타깃이 아니라 배너를 두지 않는다. */}
      {category === "diet" && <DietQuestionGuide showCost />}
      {category !== "autonomic" && category !== "pain" && <PageHeroBanner page={category} />}

      {category === "skin" && <section className="section-padding !pb-0 !pt-8">
        <div className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
          <Link href={PIGMENTATION_PATH} className="card block p-6 transition-colors hover:border-primary"><SectionBadge label="색소치료" /><h2 className="mt-3 text-lg font-semibold text-ink">피코토닝·제네시스 안내 →</h2><p className="mt-2 text-sm leading-relaxed text-muted">기미·잡티·피부결에 관한 질문부터 담당 의료진, 방문 과정과 비용까지 확인하세요.</p></Link>
          <Link href="/skin/hair-removal" className="card block p-6 transition-colors hover:border-primary"><SectionBadge label="얼굴 제모" /><h2 className="mt-3 text-lg font-semibold text-ink">엘리멘트 TL 제모 안내 →</h2><p className="mt-2 text-base leading-relaxed text-muted">남녀 공통, 인중＋앞턱·얼굴전체의 가격과 면도·관리 질문을 확인하세요.</p></Link>
          <Link href={LIFTING_PATH} className="card block p-6 transition-colors hover:border-primary"><SectionBadge label="리프팅" /><h2 className="mt-3 text-lg font-semibold text-ink">슈링크·볼뉴머 안내 →</h2><p className="mt-2 text-sm leading-relaxed text-muted">턱선·탄력, 300·600샷 비용과 패키지·시술 간격을 확인하세요.</p></Link>
        </div>
      </section>}

      {/* Diet / Skin / Autonomic 치료 안내 페이지 배너 */}
      {(category === "diet" ||
        category === "skin" ||
        (category === "autonomic" && posts.length > 0)) && (
        <section className="section-padding !pb-4 !pt-8">
          <SectionReveal>
            <Link
              href={
                category === "diet"
                  ? "/diet/program"
                  : category === "skin"
                    ? "/skin/spot"
                    : "/autonomic/care"
              }
              className="card group mx-auto flex max-w-3xl items-center justify-between gap-5 p-6 sm:p-7"
            >
              <div className="min-w-0 flex-1">
                <SectionBadge label="치료 안내" />
                <h2 className="font-serif mt-2 text-[1.05rem] font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-primary sm:text-[1.15rem]">
                  {category === "diet"
                    ? "일산감비환 상담과 처방 과정 보기"
                    : category === "skin"
                      ? "점·편평사마귀·쥐젖 제거 안내 보기"
                      : "이명·어지럼·두통 치료 안내 보기"}
                </h2>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
                  {category === "diet"
                    ? "복용 방식과 확인해야 할 증상을 정리했습니다."
                    : category === "skin"
                      ? "부위별 비용과 시술 후 관리까지 정리했습니다."
                      : "증상별 치료 기준과 먼저 확인할 것을 정리했습니다."}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-primary transition-colors duration-200 group-hover:bg-surface"
              >
                →
              </span>
            </Link>
          </SectionReveal>
        </section>
      )}

      {category === "pain" && <>
        <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-2 px-6 pb-6 text-base font-semibold text-primary">
          <Link href="#symptom-finder" className="inline-flex min-h-11 items-center underline underline-offset-4">내 증상에 맞는 질문</Link>
          <Link href="/pricing#pain" className="inline-flex min-h-11 items-center underline underline-offset-4">침·추나·약침 비용</Link>
          <Link href="/pain/acute#visit-guide" className="inline-flex min-h-11 items-center underline underline-offset-4">처음 방문 준비·소요 시간</Link>
        </div>
        <PatientJourney id="pain-visit" title="아픈 이유를 살피고, 치료 후 변화를 다시 봅니다" intro="어떤 치료를 받을지 미리 정하지 않고 오셔도 됩니다. 진찰 결과에 맞는 치료를 설명하고, 호전 정도에 따라 다음 계획을 정합니다." steps={PAIN_JOURNEY} />
        <PainSymptomFinder /><PageHeroBanner page="pain" />
        <section className="mx-auto max-w-3xl px-6 py-8 text-center"><h2 className="text-xl font-semibold text-ink">오늘 진료가 필요하신가요?</h2><p className="mt-3 text-base leading-7 text-muted">아픈 부위와 방문하려는 시간을 남겨주세요. 진료시간과 준비할 내용을 안내해 드립니다.</p><ConsultationActions kakaoLabel="오늘 진료 가능 시간 문의" className="mt-5" /></section>
      </>}

      {/* Diet 전문 페이지 배너 */}
      {category === "diet" && (
        <section className="section-padding !pb-4 !pt-8">
          <SectionReveal>
            <a
              href="https://diet.ilsanhan.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="card group mx-auto flex max-w-3xl items-center justify-between gap-5 p-6 transition-transform duration-200 hover:-translate-y-0.5 sm:p-7"
            >
              <div className="min-w-0 flex-1">
                <SectionBadge label="전문 페이지" />
                <h2 className="font-serif mt-2 text-[1.05rem] font-semibold leading-snug text-text group-hover:text-accent transition-colors duration-200 sm:text-[1.15rem]">
                  일산감비환 전문 페이지
                </h2>
                <p className="mt-2 text-[0.85rem] leading-relaxed text-text-muted">
                  처방 사례, 비용 안내, 상담 예약까지 한 곳에서 확인하세요.
                </p>
              </div>
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-accent transition-all duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-bg"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17 17 7" />
                  <path d="M8 7h9v9" />
                </svg>
              </span>
            </a>
          </SectionReveal>
        </section>
      )}

      {/* 부위별 목록 — /pain 만. 표시 순서는 lib/pain-groups.ts 의 명시 배열이고,
          앵커는 글 제목 그대로 쓴다 (「자세히 보기」 금지).
          카드 격자 대신 이걸 쓴다 — 25편을 날짜순 격자로 늘어놓으면
          어느 부위 글인지 훑어서 알 수 없다. */}
      {groups.length > 0 && (
        <section className="section-padding !pt-8">
          <div className="mx-auto max-w-3xl space-y-10">
            {groups.map((group) => (
              <SectionReveal key={group.name}>
                <div id={category === "pain" ? PAIN_GROUP_IDS[group.name] : undefined} className="scroll-mt-24">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-line pb-3">
                    <h2 className="font-serif text-[1.05rem] font-semibold leading-snug text-ink">
                      {group.name}
                    </h2>
                    {group.hub && (
                      <Link
                        href={group.hub.href}
                        className="inline-flex min-h-11 shrink-0 items-center text-sm text-primary underline underline-offset-4"
                      >
                        {group.hub.label}
                      </Link>
                    )}
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {group.items.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={postPath(category, post.slug)}
                          className="group flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3.5 transition-colors duration-200 hover:bg-surface"
                        >
                          <span className="min-w-0 text-[0.95rem] leading-snug text-ink transition-colors duration-200 group-hover:text-primary">
                            {post.title}
                          </span>
                          <span
                            aria-hidden="true"
                            className="shrink-0 text-primary"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* Posts */}
      {groups.length === 0 && (
      <section className="section-padding !pt-8">
        {posts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <SectionReveal key={post.slug}>
                <Link
                  href={postPath(category, post.slug)}
                  className="card group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
                >
                  {post.thumbnail ? (
                    <div className="relative aspect-square overflow-hidden bg-bg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-square items-center justify-center bg-bg">
                      <span className="text-4xl text-accent opacity-30">
                        {label[0]}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-[1rem] font-semibold leading-snug text-text line-clamp-2 group-hover:text-accent transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[0.82rem] leading-relaxed text-text-muted line-clamp-3">
                      {post.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-[0.72rem] text-text-muted">
                        {formatDate(post.date)}
                      </p>
                      {post.tags.length > 0 && (
                        <div className="flex gap-1.5">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[0.7rem] text-accent"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        ) : (
          /* 글이 0편일 때.
             "아직 작성된 글이 없습니다" 한 줄은 비어 있는 게 아니라
             **고장 난 것처럼** 보인다 — 사람도 크롤러도 그렇게 읽는다.
             카테고리 인덱스는 글 목록이 없더라도 갈 곳을 주는
             내비게이션 페이지 역할은 할 수 있으므로, 실제로 존재하는
             진료 안내 · 다른 카테고리로 내보낸다. */
          <SectionReveal>
            <div className="card mx-auto max-w-3xl p-7 sm:p-9">
              <SectionBadge label="증상별 진료 안내" />
              <h2 className="font-serif mt-2 text-[1.05rem] font-semibold leading-snug text-ink sm:text-[1.15rem]">
                {category === "autonomic" ? "이명·어지럼·두통, 궁금한 증상부터 확인하세요" : `${label} 진료와 환자 질문`}
              </h2>
              <p className="mt-3 text-base leading-7 text-muted">
                {category === "autonomic" ? "언제부터 불편했는지, 수면과 소화는 어떤지, 현재 복용하는 약이 있는지 함께 살펴봅니다. 기존 검사 결과가 있다면 상담할 때 가져오세요. 아래에서 증상별 진료 과정과 자주 묻는 질문을 읽으실 수 있습니다." : "진료 과정과 자주 묻는 질문을 모았습니다."}
              </p>

              <div className="mt-6 grid gap-3">
                {category === "autonomic" && <>
                  <Link href="/internal/dyspepsia" className="rounded-xl border border-line px-4 py-4 text-base font-semibold text-primary hover:bg-surface">소화가 더디고 속이 불편할 때의 진료 안내 →</Link>
                  <Link href="/herbal/tonic/autonomic" className="rounded-xl border border-line px-4 py-4 text-base font-semibold text-primary hover:bg-surface">두통·어지럼과 수면 불편의 한약 상담 →</Link>
                </>}
                <Link
                  href={EMPTY_STATE_LINKS[category].href}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3.5 transition-colors duration-200 hover:bg-surface"
                >
                  <span className="min-w-0">
                    <span className="block text-[0.95rem] font-semibold text-ink transition-colors duration-200 group-hover:text-primary">
                      {EMPTY_STATE_LINKS[category].title}
                    </span>
                    <span className="mt-0.5 block text-[0.8rem] text-muted">
                      {EMPTY_STATE_LINKS[category].blurb}
                    </span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 text-primary">
                    →
                  </span>
                </Link>

                <Link
                  href="/pain"
                  className="group flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3.5 transition-colors duration-200 hover:bg-surface"
                >
                  <span className="min-w-0">
                    <span className="block text-[0.95rem] font-semibold text-ink transition-colors duration-200 group-hover:text-primary">
                      통증 · 근골격 의학정보
                    </span>
                    <span className="mt-0.5 block text-[0.8rem] text-muted">
                      환자분들이 자주 물으시는 질문에 답한 글 모음입니다.
                    </span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 text-primary">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </SectionReveal>
        )}
      </section>
      )}

      {category === "pain" && <MobileConsultationBar label="통증 진료 문의" />}
    </>
  );
}
