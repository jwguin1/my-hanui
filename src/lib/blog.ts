export interface BlogPost {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  thumbnail: string;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch("https://rss.blog.naver.com/jwguin", {
      next: { revalidate: 3600 },
    });
    const xml = await res.text();

    const posts: BlogPost[] = [];
    const items = xml.split("<item>");

    for (let i = 1; i < items.length && posts.length < 12; i++) {
      const item = items[i];

      const title = extractTag(item, "title");
      const rawLink = extractTag(item, "link");
      const link = rawLink.replace(/\?fromRss=true&trackingCode=rss$/, "");
      const rawDescription = extractTag(item, "description");
      const pubDate = extractTag(item, "pubDate");

      // Extract thumbnail from the raw description HTML (inside CDATA)
      const imgMatch = rawDescription.match(
        /<img[^>]+src=["']([^"']+)["']/
      );
      const thumbnail = imgMatch ? imgMatch[1] : "";

      const description = stripHtml(rawDescription).slice(0, 120);

      if (title) {
        posts.push({ title, link, description, pubDate, thumbnail });
      }
    }

    return posts;
  } catch {
    return [];
  }
}

function extractTag(xml: string, tag: string): string {
  // Handle CDATA
  const cdataRegex = new RegExp(
    `<${tag}>[\\s]*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>[\\s]*</${tag}>`
  );
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}
