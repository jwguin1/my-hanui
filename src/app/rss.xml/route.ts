import { getAllPosts } from "@/lib/blog-local";

const BASE_URL = "https://my-hanui.vercel.app";
const SITE_TITLE = "my-hanui 건강정보";
const SITE_DESCRIPTION = "한의학 기반 건강정보와 치료 이야기";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toAbsoluteUrl(url: string): string {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

function toRfc822(date: string): string {
  const d = date ? new Date(date) : new Date();
  const valid = isNaN(d.getTime()) ? new Date() : d;
  return valid.toUTCString();
}

export async function GET() {
  const posts = getAllPosts();

  const lastBuildDate = toRfc822(posts[0]?.date ?? new Date().toISOString());

  const items = posts
    .map((post) => {
      const link = `${BASE_URL}/health-info/${post.slug}`;
      const thumbnail = toAbsoluteUrl(post.thumbnail);
      const enclosure = thumbnail
        ? `    <enclosure url="${escapeXml(thumbnail)}" type="image/jpeg" />\n`
        : "";
      const mediaContent = thumbnail
        ? `    <media:content url="${escapeXml(thumbnail)}" medium="image" />\n`
        : "";

      return `  <item>
    <title><![CDATA[${post.title}]]></title>
    <link>${escapeXml(link)}</link>
    <guid isPermaLink="true">${escapeXml(link)}</guid>
    <pubDate>${toRfc822(post.date)}</pubDate>
    <description><![CDATA[${post.description}]]></description>
${enclosure}${mediaContent}  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
  <title>${escapeXml(SITE_TITLE)}</title>
  <link>${BASE_URL}</link>
  <description>${escapeXml(SITE_DESCRIPTION)}</description>
  <language>ko-KR</language>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
  <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
