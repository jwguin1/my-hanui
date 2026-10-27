import type { MetadataRoute } from "next";
import { CATEGORIES, getAllPosts } from "@/lib/blog-local";
import { postPath } from "@/lib/slug";

import { HERBAL_GUIDES, herbalPath } from "@/lib/herbal-guides";

const BASE_URL = "https://www.ilsanhan.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/skin/hair-removal`, lastModified: new Date("2026-10-24T00:00:00+09:00"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/home-visit`, lastModified: new Date("2026-10-20T00:00:00+09:00"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date("2026-10-24T00:00:00+09:00"), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/aftercare`, lastModified: new Date("2026-10-24T00:00:00+09:00"), changeFrequency: "monthly", priority: 0.7 },
    ...["/herbal", "/herbs", "/herbal/insurance", "/herbal/tonic", ...HERBAL_GUIDES.filter(g => !g.href).map(herbalPath)].map(path => ({ url: `${BASE_URL}${path}`, lastModified: new Date("2026-10-16T00:00:00+09:00"), changeFrequency: "monthly" as const, priority: 0.8 })),
    {
      url: BASE_URL,
      lastModified: new Date("2026-10-27T00:00:00+09:00"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/doctor`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/column`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/media`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/treatment`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/pain/acute`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pain/chronic`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/diet/program`,
      lastModified: new Date("2026-10-27T00:00:00+09:00"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/skin/spot`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/skin/pigmentation`,
      lastModified: new Date("2026-10-04T00:00:00+09:00"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/skin/lifting`,
      lastModified: new Date("2026-10-24T00:00:00+09:00"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/accident`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/autonomic/care`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/internal/dyspepsia`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const categoryEntries: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/${cat}`,
    ...(cat === "diet" ? { lastModified: new Date("2026-10-27T00:00:00+09:00") } : {}),
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
    lastModified: new Date(post.updated || post.date),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  // Live publications have their own sitemap, advertised alongside this one in robots.txt.
  // A LAB outage must not prevent discovery of the clinic's general information.
  return [...staticEntries, ...categoryEntries, ...postEntries];
}
