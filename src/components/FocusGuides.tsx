import Link from "next/link";
import { FOCUS_GUIDES, FOCUS_ORDER, focusPosts, focusResearch, type Focus } from "@/lib/focus-guides";
import { postPath } from "@/lib/slug";
import { researchUrl } from "@/lib/research";

export default function FocusGuides() {
  return <section className="section-padding !pb-6" aria-labelledby="focus-title">
    <h2 id="focus-title" className="text-2xl font-bold text-ink">어떤 점이 궁금하세요?</h2>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {FOCUS_ORDER.map(key => { const g = FOCUS_GUIDES[key]; return <div key={key} className="min-w-0 rounded-2xl border border-line bg-card p-5 sm:p-6">
        <Link href={g.href} className="inline-flex min-h-11 items-center text-xl font-bold text-primary">{g.label} <span aria-hidden="true" className="ml-2">↗</span></Link>
        <p className="mb-3 text-base leading-7 text-muted">{g.description}</p>
        <ul className="divide-y divide-line">{focusPosts(key).map(p => <li key={p.slug}><Link href={postPath(p.category, p.slug)} className="block py-3 text-base leading-7 text-ink hover:text-primary">{p.title}</Link></li>)}</ul>
      </div>; })}
    </div>
  </section>;
}

export function FocusReadings({ focus, currentSlug, questions = true }: { focus: Focus; currentSlug?: string; questions?: boolean }) {
  const g = FOCUS_GUIDES[focus];
  const posts = questions ? focusPosts(focus).filter(p => p.slug !== currentSlug) : [];
  const research = focusResearch(focus);
  return <section className="section-padding !py-8" aria-label={`${g.label} 관련 글과 진료 안내`}>
    <div className="mx-auto max-w-4xl rounded-2xl border border-line bg-surface p-5 sm:p-7">
      <h2 className="text-xl font-bold text-ink">{g.label}, {questions ? "함께 읽을 질문" : "관련 연구와 진료 안내"}</h2>
      {posts.length > 0 && <ul className="mt-3 space-y-1">{posts.map(p => <li key={p.slug}><Link className="block py-2 text-base leading-7 text-primary underline underline-offset-4" href={postPath(p.category, p.slug)}>{p.title}</Link></li>)}</ul>}
      {research.length > 0 && <><h3 className="mt-5 font-bold text-ink">논문에서는 어떻게 살펴봤을까요?</h3><ul className="mt-2 space-y-1">{research.map(a => <li key={a.slug}><a className="block py-2 text-base leading-7 text-primary underline underline-offset-4" href={researchUrl(a)}>{a.title}</a></li>)}</ul></>}
      <Link href={g.treatment} className="mt-4 inline-flex min-h-11 items-center font-bold text-primary">{g.label} 진료·비용 안내 →</Link>
    </div>
  </section>;
}
