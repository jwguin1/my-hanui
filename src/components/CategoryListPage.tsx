import Link from "next/link";
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
import JsonLd from "@/components/JsonLd";
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
    title: "한방 다이어트 처방 안내",
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
  const posts = getAllPosts(category);

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
          [listNode, ...physicianStubs(posts.map((p) => p.author))]
        : [],
  });

  return (
    <>
      <JsonLd graph={graph} />
      {/* Hero — 이 페이지들은 진료 안내가 아니라 논문·연구 아카이브다 */}
      <PageHeader
        badge="의학정보"
        icon={<Microscope size={15} />}
        lead={label}
        description={description}
      />

      {/* 네이버 하위링크 카드용 대표이미지 — 본문 최상단의 첫 이미지이자 최대 이미지.
          /autonomic 은 이번 캐러셀 타깃이 아니라 배너를 두지 않는다. */}
      {category !== "autonomic" && <PageHeroBanner page={category} />}

      {/* Diet / Skin / Autonomic 치료 안내 페이지 배너 */}
      {(category === "diet" ||
        category === "skin" ||
        category === "autonomic") && (
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
                    ? "한약 처방이 어떻게 진행되는지 보기"
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

      {/* Pain 치료 안내 페이지 배너 */}
      {category === "pain" && (
        <section className="section-padding !pb-4 !pt-8">
          <SectionReveal>
            <div className="card mx-auto max-w-3xl p-6 sm:p-7">
              <SectionBadge label="치료 안내" />
              <h2 className="font-serif mt-2 text-[1.05rem] font-semibold leading-snug text-ink sm:text-[1.15rem]">
                삐끗한 허리·담 결림, 먼저 여기부터 보세요
              </h2>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
                다친 지 얼마나 됐는지에 따라 치료가 달라집니다.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                  href="/pain/acute"
                  className="group flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3.5 transition-colors duration-200 hover:bg-surface"
                >
                  <span className="min-w-0">
                    <span className="block text-[0.95rem] font-semibold text-ink transition-colors duration-200 group-hover:text-primary">
                      급성 통증
                    </span>
                    <span className="mt-0.5 block text-[0.8rem] text-muted">
                      담 결림 · 삐끗 · 발목 접질림
                    </span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 text-primary">
                    →
                  </span>
                </Link>

                <Link
                  href="/pain/chronic"
                  className="group flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3.5 transition-colors duration-200 hover:bg-surface"
                >
                  <span className="min-w-0">
                    <span className="block text-[0.95rem] font-semibold text-ink transition-colors duration-200 group-hover:text-primary">
                      만성 통증
                    </span>
                    <span className="mt-0.5 block text-[0.8rem] text-muted">
                      석회성 건염 · 오십견 · 디스크
                    </span>
                  </span>
                  <span aria-hidden="true" className="shrink-0 text-primary">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </SectionReveal>
        </section>
      )}

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
                  일산한의원 다이어트 전문 페이지
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

      {/* Posts */}
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
              <SectionBadge label="준비 중" />
              <h2 className="font-serif mt-2 text-[1.05rem] font-semibold leading-snug text-ink sm:text-[1.15rem]">
                {label} 의학정보는 준비 중입니다
              </h2>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
                지금 보실 수 있는 안내를 모았습니다.
              </p>

              <div className="mt-6 grid gap-3">
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

    </>
  );
}
