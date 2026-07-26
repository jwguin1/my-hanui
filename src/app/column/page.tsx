import type { Metadata } from "next";
import Link from "next/link";
import { fetchBlogPosts } from "@/lib/blog";
import SectionReveal from "@/components/SectionReveal";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  path: "/column",
  title: "의학칼럼 – 건강 정보 블로그",
  description:
    "일산한의원이 전하는 건강 정보와 치료 이야기. 근골격계 통증, 피부질환, 한약 처방 등 다양한 의학 칼럼을 확인하세요.",
  ogTitle: "의학칼럼 – 일산한의원 건강 정보",
  ogDescription: "일산한의원이 전하는 건강 정보와 치료 이야기.",
});

export default async function ColumnPage() {
  const posts = await fetchBlogPosts();

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
          <p className="fade-in section-label">Column</p>
          <h1
            className="fade-in heading-xl mt-4"
            style={{ animationDelay: "0.2s" }}
          >
            의학칼럼
          </h1>
          <div
            className="fade-in gold-divider mx-auto mt-6"
            style={{ animationDelay: "0.35s" }}
          />
          <p
            className="fade-in body-text mx-auto mt-6 max-w-md"
            style={{ animationDelay: "0.45s" }}
          >
            일산한의원이 전하는 건강 정보와 치료 이야기
          </p>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding">
        {posts.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <SectionReveal key={i}>
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
                >
                  {/* Thumbnail */}
                  {post.thumbnail ? (
                    <div className="relative aspect-square overflow-hidden bg-bg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-square items-center justify-center bg-bg">
                      <span className="text-2xl">📝</span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-serif text-[1rem] font-semibold leading-snug text-text line-clamp-2 group-hover:text-accent transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-[0.82rem] leading-relaxed text-text-muted line-clamp-3">
                      {post.description}
                    </p>
                    <p className="mt-3 text-[0.72rem] text-text-muted">
                      {formatDate(post.pubDate)}
                    </p>
                  </div>
                </a>
              </SectionReveal>
            ))}
          </div>
        ) : (
          <p className="text-center body-text">
            칼럼을 불러오는 중입니다...
          </p>
        )}
      </section>

      {/* Blog CTA */}
      <section className="section-padding text-center !pt-0">
        <SectionReveal>
          <h2 className="heading-md">더 많은 글이 궁금하시다면</h2>
          <a
            href="https://blog.naver.com/jwguin"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-8"
          >
            네이버 블로그 바로가기
          </a>
        </SectionReveal>
      </section>
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
