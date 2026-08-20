import Link from "next/link";
import type { Metadata } from "next";
import {
  CATEGORY_LABEL,
  type Category,
  getAllPosts,
  toISO8601KST,
} from "@/lib/blog-local";
import SectionReveal from "@/components/SectionReveal";
import PageHeader from "@/components/ui/PageHeader";
import { Microscope } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/page-metadata";
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
 * revalidate 를 두지 않는다 = 빌드 시 정적 생성, 다음 배포까지 고정.
 *
 * 이 페이지의 데이터는 전부 레포 안의 content/*.md 다. 배포 없이는 바뀌지 않으므로
 * ISR 로 얻을 것이 없다. 반면 잃는 것은 있었다 — Next 의 stale-while-revalidate 는
 * 만료 후 첫 요청자에게 **낡은 사본을 먼저 주고** 뒤에서 재생성한다.
 * 저트래픽 사이트에서 하루 한 번 오는 크롤러는 매번 그 낡은 사본을 받는다.
 *
 * 실제로 2026-08-19 발행한 21편이 /blog 에는 보이는데 /pain 에는 안 보이는 상태가
 * 관측됐다 (X-Vercel-Cache: STALE). 같은 배포, 같은 시점이었다.
 *
 * 외부 데이터를 읽는 / · /column · /media 는 예외다 — 거긴 배포와 무관하게
 * 원본이 바뀌므로 fetch 단위 revalidate 를 그대로 둔다.
 */

export const metadata: Metadata = pageMetadata({
  path: "/blog",
  title: "전체 글 아카이브",
  description:
    "일산한의원이 발행한 모든 카테고리(통증·다이어트·자율신경·피부)의 글을 한자리에서 확인하세요.",
  ogTitle: "전체 글 아카이브 | 일산한의원",
});

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
  return postPath(category, slug);
}

export default function BlogArchivePage() {
  const posts = getAllPosts();

  const listNode = itemListNode(
    "/blog",
    "post-list",
    "일산한의원 전체 글",
    posts.map((post) => {
      const href = postUrl(post.category, post.slug);
      const image = post.thumbnail ? toAbsoluteUrl(post.thumbnail) : undefined;
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
    })
  );

  const graph = buildGraph({
    path: "/blog",
    name: "전체 글 아카이브 | 일산한의원",
    description:
      "일산한의원이 발행한 모든 카테고리(통증·다이어트·자율신경·피부)의 글을 한자리에서 확인하세요.",
    mainEntity: posts.length > 0 ? ref(pageId("/blog", "post-list")) : undefined,
    nodes:
      posts.length > 0
        ? // 목록 카드의 author 참조가 끊기지 않도록 Physician 스텁을 함께 싣는다
          [listNode, ...physicianStubs(posts.map((p) => p.author))]
        : [],
  });

  return (
    <>
      <JsonLd graph={graph} />
      <PageHeader
        badge="글 모음"
        icon={<Microscope size={15} />}
        lead="전체 "
        accent="글"
        description="모든 카테고리의 글을 최신순으로 모아 보여드립니다"
      />

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
                          loading="lazy"
                          decoding="async"
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

    </>
  );
}
