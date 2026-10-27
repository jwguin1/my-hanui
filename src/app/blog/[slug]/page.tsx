import { notFound, permanentRedirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  autoLinkMarkdown,
  getAllPosts,
  getPostBySlug,
  toISO8601KST,
} from "@/lib/blog-local";
import PostContent from "@/components/PostContent";
import ArticleContents from "@/components/ArticleContents";
import { postImagePath } from "@/lib/og-image";
import JsonLd from "@/components/JsonLd";
import { articleNode, buildGraph, faqEntities, physicianStub } from "@/lib/schema";
import { parsePostFaq } from "@/lib/post-faq";
import { postPath } from "@/lib/slug";

const SITE_URL = "https://www.ilsanhan.com";

/**
 * revalidate 없음 — 목록 페이지와 같은 이유(레포 내 .md 가 유일한 소스).
 *
 * dynamicParams 는 **반드시 true 로 유지한다.** generateStaticParams 는
 * getAllPosts() 를 쓰므로 심사 중(status: "under_review")인 Line A 32편이
 * 빠져 있다. dynamicParams 가 false 가 되는 순간 그 32편이 404 가 되고,
 * 크롤러가 재방문을 멈춰 noindex 를 영영 읽지 못한다 —
 * Search Console 임시 삭제가 만료되면 그대로 되살아난다.
 *
 * revalidate 가 없어도 온디맨드로 렌더된 페이지는 다음 배포까지 캐시되므로
 * 첫 요청 이후에는 정적과 같다.
 */
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const post = getPostBySlug(slug);
    if (!post) return { title: "글을 찾을 수 없습니다" };
    // 글 제목에 이미 브랜드명이 있으면 접미사를 붙이지 않는다 (title 내 중복 방지)
    const fullTitle = post.title.includes("일산한의원")
      ? post.title
      : `${post.title} | 일산한의원`;
    // 정규 URL 은 카테고리 경로다. 미분류(blog)만 /blog/{slug} 가 정규다.
    const canonical = `${SITE_URL}${postPath(post.category, post.slug)}`;
    const imagePath = postImagePath(post.id, post.thumbnail, "/og-image.jpg");
    const image = imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath}`;
    return {
      title: { absolute: fullTitle },
      description: post.description,
      openGraph: {
        title: fullTitle,
        description: post.description,
        type: "article",
        url: canonical,
        publishedTime: toISO8601KST(post.date),
        modifiedTime: toISO8601KST(post.updated ?? post.date),
        images: [{ url: image, alt: post.title }],
      },
      twitter: { card: "summary_large_image", title: fullTitle, description: post.description, images: [image] },
      alternates: { canonical },
    };
  });
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) notFound();

  // 카테고리 글이면 카테고리 URL로 영구 리다이렉트 (정규화)
  if (post.category !== "blog") {
    permanentRedirect(postPath(post.category, post.slug));
  }

  const linkedContent = autoLinkMarkdown(post.content, post.slug);
  const headings = [...linkedContent.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  const imagePath = postImagePath(post.id, post.thumbnail, "/og-image.jpg");
  const absoluteImage = imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath}`;

  // 카테고리 글과 같은 규칙 — 본문 FAQ 섹션을 FAQPage 로 올린다
  const faq = faqEntities(parsePostFaq(linkedContent));

  const path = postPath("blog", post.slug);
  const graph = buildGraph({
    path,
    name: post.title,
    description: post.description,
    image: absoluteImage || undefined,
    breadcrumbName: post.title,
    faq: faq.length ? faq : undefined,
    nodes: [
      articleNode({
        path,
        headline: post.title,
        description: post.description,
        datePublished: toISO8601KST(post.date),
        dateModified: toISO8601KST(post.updated ?? post.date),
        image: absoluteImage || undefined,
        author: post.author,
      }),
      // author 가 Physician 을 가리키면 참조가 끊기지 않도록 함께 넣는다
      physicianStub(post.author),
    ],
  });

  return (
    <>
      <JsonLd graph={graph} />
      <section className="bg-[var(--surface)]">
        <div className="section-padding w-full !py-0 py-16 md:py-20">
          <Link
            href="/blog"
            className="text-[0.8rem] text-muted transition-colors hover:text-primary"
          >
            &larr; 전체 글
          </Link>
          <h1 className="mt-5 text-[26px] font-bold leading-[1.35] tracking-[-0.02em] text-ink md:text-[38px]">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-[0.8rem] text-muted">
            <time dateTime={toISO8601KST(post.updated ?? post.date)}>{post.updated ? "최종 업데이트 " : ""}{formatDate(post.updated ?? post.date)}</time>
            <Link href={post.author ? "/doctor" : "/about"} className="underline underline-offset-4">{post.author ? `작성 ${post.author} 한의사` : "일산한의원 건강정보"}</Link>
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-accent">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <ArticleContents headings={headings} />
        <article className="prose-custom mx-auto max-w-3xl">
          <PostContent markdown={linkedContent} headingAnchors />
        </article>
      </section>

      <section className="section-padding !pt-0 text-center">
        <Link href="/blog" className="btn-ghost">
          전체 글로 돌아가기
        </Link>
      </section>

    </>
  );
}
