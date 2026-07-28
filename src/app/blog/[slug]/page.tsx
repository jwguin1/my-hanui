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

const SITE_URL = "https://www.ilsanhan.com";

export const revalidate = 60;
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
    const fullTitle = `${post.title} | 일산한의원`;
    const canonical =
      post.category === "blog"
        ? `${SITE_URL}/blog/${slug}`
        : `${SITE_URL}/${post.category}/${slug}`;
    return {
      title: { absolute: fullTitle },
      description: post.description,
      openGraph: {
        title: fullTitle,
        description: post.description,
        type: "article",
        url: canonical,
        ...(post.thumbnail ? { images: [{ url: post.thumbnail }] } : {}),
      },
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
    permanentRedirect(`/${post.category}/${slug}`);
  }

  const linkedContent = autoLinkMarkdown(post.content, slug);
  const absoluteImage = post.thumbnail
    ? post.thumbnail.startsWith("http")
      ? post.thumbnail
      : `${SITE_URL}${post.thumbnail.startsWith("/") ? "" : "/"}${post.thumbnail}`
    : "";

  return (
    <>
      <section
        className="flex items-end pb-16 pt-32 md:pb-20 md:pt-40"
        style={{
          background:
            "linear-gradient(180deg, var(--surface) 0%, var(--color-bg) 100%)",
        }}
      >
        <div className="section-padding w-full !py-0">
          <Link
            href="/blog"
            className="fade-in text-[0.8rem] text-text-muted hover:text-accent transition-colors"
          >
            &larr; 전체 글
          </Link>
          <h1
            className="fade-in heading-xl mt-6"
            style={{ animationDelay: "0.2s" }}
          >
            {post.title}
          </h1>
          <div
            className="fade-in gold-divider mt-6"
            style={{ animationDelay: "0.35s" }}
          />
          <div
            className="fade-in mt-4 flex items-center gap-4 text-[0.8rem] text-text-muted"
            style={{ animationDelay: "0.45s" }}
          >
            <time>{formatDate(post.date)}</time>
            {post.tags.length > 0 && (
              <div className="flex gap-2">
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
        <article className="prose-custom mx-auto max-w-3xl">
          <PostContent markdown={linkedContent} />
        </article>
      </section>

      <section className="section-padding !pt-0 text-center">
        <Link href="/blog" className="btn-ghost">
          전체 글로 돌아가기
        </Link>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: toISO8601KST(post.date),
            dateModified: toISO8601KST(post.date),
            ...(absoluteImage ? { image: [absoluteImage] } : {}),
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
              "@id": `${SITE_URL}/blog/${slug}`,
            },
          }),
        }}
      />
    </>
  );
}
