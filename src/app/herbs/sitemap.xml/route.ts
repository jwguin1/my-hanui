import { publicationSitemapResponse } from "@/lib/publication-sitemap";

export const dynamic = "force-dynamic";
export function GET() {
  return publicationSitemapResponse();
}
