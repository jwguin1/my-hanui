import Link from "next/link";
import type { Metadata } from "next";
import {
  CATEGORY_LABEL,
  type Category,
  getAllPosts,
  toISO8601KST,
} from "@/lib/blog-local";
import SectionReveal from "@/components/SectionReveal";

const SITE_URL = "https://www.ilsanhan.com";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "전체 글 아카이브",
  description:
    "일산한의원이 발행한 모든 카테고리(통증·다이어트·자율신경·피부)의 글을 한자리에서 확인하세요.",
  openGraph: {
    title: "전체 글 아카이브 | 일산한의원",
    description:
      "일산한의원이 발행한 모든 카테고리(통증·다이어트·자율신경·피부)의 글을 한자리에서 확인하세요.",
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

function toAbsoluteUrl(p: string): string {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  return `${SITE_URL}${p.startsWith("/") ? "" : "/"}${p}`;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

function postUrl(category: string, slug: string): string {
  if (category === "blog") return `/blog/${slug}`;
  return `/${category}/${slug}`;
}

export default function BlogArchivePage() {
  const posts = getAllPosts();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}${postUrl(post.category, post.slug)}`,
      item: {
        "@type": "Article",
        "@id": `${SITE_URL}${postUrl(post.category, post.slug)}`,
        headline: post.title,
        description: post.description,
        datePublished: toISO8601KST(post.date),
        dateModified: toISO8601KST(post.date),
        ...(post.thumbnail ? { image: [toAbsoluteUrl(post.thumbnail)] } : {}),
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
      },
    })),
  };

  return (
    <>
      <section
        className="flex items-end pb-16 pt-32 md:pb-20 md:pt-40"
        style={{
          background:
            "linear-gradient(180deg, #151515 0%, var(--color-bg) 100%)",
        }}
      >
        <div className="section-padding w-full !py-0 text-center">
          <p className="fade-in section-label">Archive</p>
          <h1
            className="fade-in heading-xl mt-4"
            style={{ animationDelay: "0.2s" }}
          >
            전체 글
          </h1>
          <div
            className="fade-in gold-divider mx-auto mt-6"
            style={{ animationDelay: "0.35s" }}
          />
          <p
            className="fade-in body-text mx-auto mt-6 max-w-md"
            style={{ animationDelay: "0.45s" }}
          >
            모든 카테고리의 글을 최신순으로 모아 보여드립니다
          </p>
        </div>
      </section>

      <section className="section-padding">
        {posts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const isCategoryPost = post.category !== "blog";
              const categoryLabel = isCategoryPost
                ? CATEGORY_LABEL[post.category as Category]
                : null;
              return (
                <SectionReveal key={`${post.category}/${post.slug}`}>
                  <Link
                    href={postUrl(post.category, post.slug)}
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
                          {categoryLabel ? categoryLabel[0] : "글"}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-5">
                      {categoryLabel && (
                        <span className="mb-2 inline-block self-start rounded-sm bg-accent/15 px-2 py-0.5 text-[0.7rem] text-accent">
                          {categoryLabel}
                        </span>
                      )}
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
              );
            })}
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
