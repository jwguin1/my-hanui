import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CATEGORY_LABEL,
  type Category,
  autoLinkMarkdown,
  getPostBySlug,
  getRelatedPosts,
  toISO8601KST,
} from "@/lib/blog-local";
import PostContent from "@/components/PostContent";
import { CATEGORY_META } from "@/lib/categories";
import { postImagePath } from "@/lib/og-image";

const SITE_URL = "https://www.ilsanhan.com";

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

export default function CategoryPostPage({
  category,
  slug,
}: {
  category: Category;
  slug: string;
}) {
  const post = getPostBySlug(slug, category);
  if (!post || !post.published) notFound();

  const label = CATEGORY_LABEL[category];
  const linkedContent = autoLinkMarkdown(post.content, slug);
  const relatedPosts = getRelatedPosts(slug, 3, category);

  // 파생 OG(1200x630) → 원본 썸네일 → 카테고리 대표 OG 순으로 폴백
  const imagePath = postImagePath(
    slug,
    post.thumbnail,
    CATEGORY_META[category].ogImage
  );
  const absoluteImage = imagePath.startsWith("http")
    ? imagePath
    : `${SITE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;

  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding w-full !py-0 py-16 md:py-20">
          <Link
            href={`/${category}`}
            className="text-[0.8rem] text-muted transition-colors hover:text-primary"
          >
            &larr; {label} 목록
          </Link>
          <h1 className="mt-5 text-[26px] font-bold leading-[1.35] tracking-[-0.02em] text-ink md:text-[38px]">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-[0.8rem] text-muted">
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

      {/* Content */}
      <section className="section-padding">
        <article className="prose-custom mx-auto max-w-3xl">
          <PostContent markdown={linkedContent} />
        </article>
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
                    href={`/${rp.category}/${rp.slug}`}
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
        <Link href={`/${category}`} className="btn-ghost">
          목록으로 돌아가기
        </Link>
      </section>

      {/* JSON-LD */}
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
              "@id": `${SITE_URL}/${category}/${slug}`,
            },
          }),
        }}
      />
    </>
  );
}
