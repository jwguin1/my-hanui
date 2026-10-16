import { notFound } from "next/navigation";
import { HerbalDetail } from "@/components/HerbalPages";
import { HERBAL_GUIDES, herbalPath } from "@/lib/herbal-guides";
import { pageMetadata } from "@/lib/page-metadata";
const guides = HERBAL_GUIDES.filter(g => g.category === "insurance" && !g.href);
export const dynamicParams = false;
export function generateStaticParams() { return guides.map(g => ({ slug: g.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find(g => g.slug === slug);
  if (!guide) notFound();
  return pageMetadata({ path: herbalPath(guide), title: `일산 ${guide.title} 한약 | 질문과 답`, description: guide.summary });
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const guide = guides.find(g => g.slug === slug);
  if (!guide) notFound();
  return <HerbalDetail guide={guide} />;
}
