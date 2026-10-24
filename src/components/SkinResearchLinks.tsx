import { researchForSkinGuide } from "@/lib/skin-research";
import { RESEARCH_ORIGIN, researchUrl } from "@/lib/research";

export default function SkinResearchLinks({ slug }: { slug: string }) {
  const related = researchForSkinGuide(slug);
  if (!related) return null;
  return <section className="section-padding !pt-6 !pb-8">
    <div className="mx-auto max-w-3xl rounded-xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="text-lg font-bold text-ink">피부 시술을 논문으로 더 알아보고 싶다면</h2>
      <p className="mt-3 text-base leading-relaxed text-muted">연구노트에서는 연구 대상과 방법, 결과와 그림을 함께 읽을 수 있습니다.</p>
      <ul className="mt-4 space-y-3 text-base leading-relaxed text-primary">
        {related.articles.map(a => <li key={a.slug}><a className="block py-2 underline underline-offset-4" href={researchUrl(a)}>{a.title} →</a></li>)}
        <li><a className="block py-2 underline underline-offset-4" href={`${RESEARCH_ORIGIN}/category/skin`}>피부·미용 연구노트 전체 보기 →</a></li>
      </ul>
    </div>
  </section>;
}
