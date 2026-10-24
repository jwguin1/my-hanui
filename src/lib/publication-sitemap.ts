const BASE = "https://www.ilsanhan.com";

/** Do not turn an upstream outage into an empty successful sitemap. */
export async function publicationSitemapResponse(
  fetcher: typeof fetch = fetch,
  origin = process.env.MEDICATION_PUBLIC_API_ORIGIN || "https://lab.jwguin.uk",
): Promise<Response> {
  const headers = { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-store" };
  try {
    const response = await fetcher(`${origin}/api/public/medication/sitemap`, {
      cache: "no-store", signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Publication sitemap unavailable");
    const data: unknown = await response.json();
    if (!data || typeof data !== "object" || !("letters" in data) || !Array.isArray(data.letters)) {
      throw new Error("Invalid publication sitemap");
    }
    const entries = new Map<string, string>();
    for (const letter of data.letters) {
      if (!letter || typeof letter.token !== "string" || !/^[a-f0-9-]{36}$/.test(letter.token)
        || typeof letter.publishedAt !== "string" || !Number.isFinite(Date.parse(letter.publishedAt))) {
        throw new Error("Invalid publication entry");
      }
      entries.set(letter.token, new Date(letter.publishedAt).toISOString());
    }
    const urls = [...entries].map(([token, updated]) =>
      `<url><loc>${BASE}/herbs/${token}</loc><lastmod>${updated}</lastmod></url>`).join("");
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers });
  } catch {
    return new Response("Sitemap temporarily unavailable", {
      status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "Retry-After": "300" },
    });
  }
}

export function publicationPage(value?: string): number {
  const page = Number(value);
  return Number.isFinite(page) ? Math.max(1, Math.min(10000, Math.floor(page))) : 1;
}
