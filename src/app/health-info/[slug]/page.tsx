import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  autoLinkMarkdown,
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog-local";
import { marked } from "marked";

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

    const fullTitle = `${post.title} | 일산한의원 건강정보`;

    return {
      title: { absolute: fullTitle },
      description: post.description,
      openGraph: {
        title: fullTitle,
        description: post.description,
        type: "article",
        url: `${SITE_URL}/health-info/${slug}`,
        ...(post.thumbnail ? { images: [{ url: post.thumbnail }] } : {}),
      },
      alternates: {
        canonical: `${SITE_URL}/health-info/${slug}`,
      },
    };
  });
}

export default async function HealthInfoPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.published) notFound();

  const linkedContent = autoLinkMarkdown(post.content, slug);
  const html = await marked(linkedContent);
  const relatedPosts = getRelatedPosts(slug, 3);

  const absoluteImage = post.thumbnail
    ? post.thumbnail.startsWith("http")
      ? post.thumbnail
      : `${SITE_URL}${post.thumbnail.startsWith("/") ? "" : "/"}${post.thumbnail}`
    : "";

  return (
    <>
      {/* Hero */}
      <section
        className="flex items-end pb-16 pt-32 md:pb-20 md:pt-40"
        style={{
          background:
            "linear-gradient(180deg, #151515 0%, var(--color-bg) 100%)",
        }}
      >
        <div className="section-padding w-full !py-0">
          <Link
            href="/health-info"
            className="fade-in text-[0.8rem] text-text-muted hover:text-accent transition-colors"
          >
            &larr; 건강정보 목록
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
                  <span key={tag} className="text-accent opacity-70">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <article
          className="prose-custom mx-auto max-w-3xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="section-padding !pt-0">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-serif text-[1.25rem] font-semibold text-text">
              관련 글
            </h2>
            <div
              className="gold-divider mt-4"
              style={{ width: "3rem", marginLeft: 0 }}
            />
            <ul className="mt-6 space-y-4">
              {relatedPosts.map((rp) => (
                <li key={rp.slug}>
                  <Link
                    href={`/health-info/${rp.slug}`}
                    className="group block rounded-md p-4 transition-colors hover:bg-white/5"
                  >
                    <h3 className="font-serif text-[1rem] font-semibold text-text group-hover:text-accent transition-colors">
                      {rp.title}
                    </h3>
                    {rp.description && (
                      <p className="mt-1.5 text-[0.85rem] leading-relaxed text-text-muted line-clamp-2">
                        {rp.description}
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Bottom nav */}
      <section className="section-padding !pt-0 text-center">
        <Link href="/health-info" className="btn-ghost">
          목록으로 돌아가기
        </Link>
      </section>

      {/* JSON-LD (Article — 네이버 캐러셀 호환) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
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
              "@id": `${SITE_URL}/health-info/${slug}`,
            },
          }),
        }}
      />
    </>
  );
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}
