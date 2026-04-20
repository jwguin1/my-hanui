import type { Metadata } from "next";
import CategoryPostPage from "@/components/CategoryPostPage";
import { getAllPosts, getPostBySlug } from "@/lib/blog-local";

const SITE_URL = "https://www.ilsanhan.com";

export const revalidate = 60;
export const dynamicParams = true;

export function generateStaticParams() {
  return getAllPosts("pain").map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const post = getPostBySlug(slug, "pain");
    if (!post) return { title: "글을 찾을 수 없습니다" };
    const fullTitle = `${post.title} | 일산한의원 통증`;
    return {
      title: { absolute: fullTitle },
      description: post.description,
      openGraph: {
        title: fullTitle,
        description: post.description,
        type: "article",
        url: `${SITE_URL}/pain/${slug}`,
        ...(post.thumbnail ? { images: [{ url: post.thumbnail }] } : {}),
      },
      alternates: { canonical: `${SITE_URL}/pain/${slug}` },
    };
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryPostPage category="pain" slug={slug} />;
}
