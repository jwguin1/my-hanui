import Link from "next/link";
import { getAllPosts } from "@/lib/blog-local";
import SectionReveal from "@/components/SectionReveal";

const SITE_URL = "https://my-hanui.vercel.app";

function toAbsoluteUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export const metadata = {
  title: "건강정보",
  description:
    "일산한의원의 최신 의학 논문 리뷰와 건강정보를 확인하세요.",
  openGraph: {
    title: "건강정보 | 일산한의원",
    description:
      "일산한의원의 최신 의학 논문 리뷰와 건강정보를 확인하세요.",
  },
  alternates: {
    canonical: "https://my-hanui.vercel.app/health-info",
  },
};

export const revalidate = 60;

export default function HealthInfoListPage() {
  const posts = getAllPosts();

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.map((post, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/health-info/${post.slug}`,
      item: {
        "@type": "Article",
        "@id": `${SITE_URL}/health-info/${post.slug}`,
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
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
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/health-info/${post.slug}`,
        },
      },
    })),
  };

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
        <div className="section-padding w-full !py-0 text-center">
          <p className="fade-in section-label">Health Info</p>
          <h1
            className="fade-in heading-xl mt-4"
            style={{ animationDelay: "0.2s" }}
          >
            건강정보
          </h1>
          <div
            className="fade-in gold-divider mx-auto mt-6"
            style={{ animationDelay: "0.35s" }}
          />
          <p
            className="fade-in body-text mx-auto mt-6 max-w-md"
            style={{ animationDelay: "0.45s" }}
          >
            최신 의학 논문 리뷰와 건강정보를 전합니다
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="section-padding">
        {posts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <SectionReveal key={post.slug}>
                <Link
                  href={`/health-info/${post.slug}`}
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
                      <span className="text-4xl text-accent opacity-30">H</span>
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
                      <p className="text-[0.72rem] text-text-muted opacity-60">
                        {formatDate(post.date)}
                      </p>
                      {post.tags.length > 0 && (
                        <div className="flex gap-1.5">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[0.65rem] text-accent opacity-60"
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

      {/* JSON-LD (ItemList — 네이버 캐러셀) */}
      {posts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
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
