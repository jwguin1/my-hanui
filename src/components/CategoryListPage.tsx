import Link from "next/link";
import {
  CATEGORY_DESCRIPTION,
  CATEGORY_LABEL,
  type Category,
  getAllPosts,
  toISO8601KST,
} from "@/lib/blog-local";
import SectionReveal from "@/components/SectionReveal";
import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import { ListCheck } from "@/components/ui/icons";
import { CATEGORY_META } from "@/lib/categories";
import { postImagePath } from "@/lib/og-image";

const SITE_URL = "https://www.ilsanhan.com";

const CATEGORY_INTRO: Record<
  Category,
  { title: string; lines: string[] }
> = {
  pain: {
    title: "일산한의원 통증 클리닉",
    lines: [
      "교통사고 후유증, 초음파 진단, 초음파약침,",
      "척추치료, 체형교정추나치료에 특화.",
      "APCA RMSK 자격 보유 의료진의 초음파 진단.",
      "연간 18,250건 추나·약침 시술 경험.",
    ],
  },
  diet: {
    title: "일산한의원 다이어트 클리닉",
    lines: [
      "연간 8,000건 이상 한방 다이어트 처방.",
      "체계적인 한방비만치료와 대사증후군 관리.",
    ],
  },
  autonomic: {
    title: "일산한의원 자율신경 클리닉",
    lines: [
      "자율신경실조증, 이명, 두통, 불면,",
      "기능성소화불량, 과민성대장증후군에 특화.",
      "한의학적 접근으로 자율신경 균형 회복.",
    ],
  },
  skin: {
    title: "일산한의원 피부·미용레이저 클리닉",
    lines: [
      "피부레이저, 아토피, 피부염, 피부재생에 특화.",
      "국제레이저미용피부과학회 소속 의료진.",
    ],
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
  const intro = CATEGORY_INTRO[category];
  const posts = getAllPosts(category);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, idx) => {
      // 파생 OG(1200x630) → 원본 썸네일 → 카테고리 대표 OG 순으로 폴백
      const imageUrl = toAbsoluteUrl(
        postImagePath(post.slug, post.thumbnail, CATEGORY_META[category].ogImage)
      );
      return {
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE_URL}/${category}/${post.slug}`,
        name: post.title,
        image: imageUrl,
        item: {
          "@type": "Article",
          "@id": `${SITE_URL}/${category}/${post.slug}`,
          headline: post.title,
          description: post.description,
          datePublished: toISO8601KST(post.date),
          dateModified: toISO8601KST(post.date),
          image: [imageUrl],
          author: {
            "@type": "Organization",
            name: "일산한의원",
            url: SITE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: "일산한의원",
            url: SITE_URL,
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/${category}/${post.slug}`,
          },
        },
      };
    }),
  };

  return (
    <>
      {/* Hero */}
      <PageHeader
        badge="진료 분과"
        icon={<ListCheck size={15} />}
        lead={label}
        description={description}
      />

      {/* Intro */}
      <section className="section-padding !pb-4">
        <SectionReveal>
          <div className="card mx-auto max-w-3xl p-7 text-center">
            <SectionBadge label="한의원 안내" />
            <h2 className="font-serif mt-3 text-[1.15rem] font-semibold text-ink">
              {intro.title}
            </h2>
            <div className="mt-5 space-y-1.5 body-text">
              {intro.lines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </div>
        </SectionReveal>
      </section>

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
                  href={`/${category}/${post.slug}`}
                  className="card group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
                >
                  {post.thumbnail ? (
                    <div className="relative aspect-square overflow-hidden bg-bg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.thumbnail}
                        alt={post.title}
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
          <div className="text-center py-20">
            <p className="body-text">아직 작성된 글이 없습니다.</p>
          </div>
        )}
      </section>

      {posts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
    </>
  );
}
