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
import ClinicCta from "@/components/ClinicCta";
import { painPostHub } from "@/lib/pain-groups";
import { CATEGORY_META } from "@/lib/categories";
import { postImagePath } from "@/lib/og-image";
import { postPath } from "@/lib/slug";
import JsonLd from "@/components/JsonLd";
import { articleNode, buildGraph, faqEntities, physicianStub } from "@/lib/schema";
import { parsePostFaq } from "@/lib/post-faq";

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
  // getPostBySlug 가 NFC 정규화까지 한다 — params 를 여기서 다시 만지지 않는다
  const post = getPostBySlug(slug, category);
  if (!post || !post.published) notFound();

  const label = CATEGORY_LABEL[category];
  // 이후로는 params 의 slug 가 아니라 정규화된 post.slug 만 쓴다
  const linkedContent = autoLinkMarkdown(post.content, post.slug);
  const relatedPosts = getRelatedPosts(post.slug, 3, category);
  // 그룹 배열(lib/pain-groups.ts)이 정본이다. 글 쪽 프론트매터에 넣지 않는다.
  const hub = category === "pain" ? painPostHub(post.slug) : undefined;

  // 파생 OG(1200x630) → 원본 썸네일 → 카테고리 대표 OG 순으로 폴백.
  // 폴더 키는 슬러그가 아니라 파일 ID 다.
  const imagePath = postImagePath(
    post.id,
    post.thumbnail,
    CATEGORY_META[category].ogImage
  );
  const absoluteImage = imagePath.startsWith("http")
    ? imagePath
    : `${SITE_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;

  // 본문의 "자주 묻는 질문" 섹션을 그대로 FAQPage 로 올린다.
  // 화면에 렌더하는 문자열(linkedContent)에서 뽑으므로, 화면에 없는 FAQ 가
  // 스키마에만 실리는 일이 생기지 않는다.
  const faq = faqEntities(parsePostFaq(linkedContent));

  const path = postPath(category, post.slug);
  const graph = buildGraph({
    path,
    name: post.title,
    description: post.description,
    image: absoluteImage,
    breadcrumbName: post.title,
    faq: faq.length ? faq : undefined,
    nodes: [
      articleNode({
        path,
        headline: post.title,
        description: post.description,
        datePublished: toISO8601KST(post.date),
        image: absoluteImage,
        author: post.author,
      }),
      // author 가 Physician 을 가리키면 참조가 끊기지 않도록 함께 넣는다
      physicianStub(post.author),
    ],
  });

  return (
    <>
      <JsonLd graph={graph} />
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

      {/* 전환 블록 — 관련 글보다 **위**에 둔다.
          글을 다 읽은 직후가 내원을 판단하는 지점이고, 관련 글 목록을 먼저
          보여주면 그 지점을 지나쳐 다른 글로 새어 나간다.
          clinicNote 가 비어 있어도 병원 정보 두 줄은 항상 출력된다. */}
      {/* 허브 역링크 — 이 글이 속한 그룹에 진료 안내 페이지가 있을 때만.
          전역 내비게이션의 링크는 모든 페이지에 똑같이 있어서 이 글과
          그 페이지가 이어져 있다는 신호가 되지 못한다. 여기서 따로 건다.
          앵커는 그 페이지의 이름 그대로 — 「자세히 보기」는 쓰지 않는다. */}
      {hub && (
        <section className="section-padding !pb-0 !pt-0">
          <div className="mx-auto max-w-3xl">
            <Link
              href={hub.href}
              className="group flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3.5 transition-colors duration-200 hover:bg-surface"
            >
              <span className="min-w-0 text-[0.95rem] leading-snug text-ink transition-colors duration-200 group-hover:text-primary">
                {hub.label}
              </span>
              <span aria-hidden="true" className="shrink-0 text-primary">
                →
              </span>
            </Link>
          </div>
        </section>
      )}

      <ClinicCta note={post.clinicNote} />

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
                    href={postPath(rp.category, rp.slug)}
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

    </>
  );
}
