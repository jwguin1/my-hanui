import type { Metadata } from "next";
import CategoryPostPage from "@/components/CategoryPostPage";
import { getAllPosts } from "@/lib/blog-local";
import { categoryPostMetadata } from "@/lib/post-metadata";

/**
 * revalidate 없음 — 위 목록 페이지와 같은 이유(레포 내 .md 가 유일한 소스).
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
  return getAllPosts("autonomic").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return categoryPostMetadata("autonomic", slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryPostPage category="autonomic" slug={slug} />;
}
