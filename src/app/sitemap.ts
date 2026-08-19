import type { MetadataRoute } from "next";
import { CATEGORIES, getAllPosts } from "@/lib/blog-local";
import { postPath } from "@/lib/slug";

const BASE_URL = "https://www.ilsanhan.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/doctor`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/column`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/media`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/treatment`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/pain/acute`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pain/chronic`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/diet/program`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/skin/spot`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/accident`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/autonomic/care`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/internal/dyspepsia`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/${cat}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  /**
   * 글 URL 은 getAllPosts() 에서 가져온다.
   *
   * 이전에는 CATEGORIES 4개만 순회해서 content/blog/ 을 통째로
   * 빼먹었다 — 글이 1개뿐이라 티가 안 났을 뿐이다.
   * getAllPosts() 는 blog + 카테고리를 모두 읽고 published 필터까지
   * 거치므로, 발행 경로가 늘어도 사이트맵이 자동으로 따라간다.
   *
   * 카테고리 글은 /{category}/{slug} 가 정규 URL 이다
   * (/blog/{slug} 는 app/blog/[slug] 에서 308 로 리다이렉트된다).
   */
  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    // canonical / og:url / JSON-LD @id 와 **같은 문자열**이어야 한다.
    // Next 의 sitemap 직렬화기는 URL 을 인코딩해 주지 않으므로(한글이 그대로 나간다)
    // 여기서 postPath() 를 거쳐 인코딩된 경로를 넘긴다.
    url: `${BASE_URL}${postPath(post.category, post.slug)}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticEntries, ...categoryEntries, ...postEntries];
}
