import Link from "next/link";
import { getAllPosts } from "@/lib/blog-local";
import { postPath } from "@/lib/slug";
import { SPOT_QUESTION_GROUPS } from "@/lib/skin-guides";

export default function SpotQuestionGuide() {
  const bySlug = new Map(getAllPosts("skin").map(post => [post.slug, post]));
  return <section id="spot-questions" className="section-padding scroll-mt-28" aria-labelledby="spot-questions-title">
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-medium text-primary">잡티 제거 · 질문별 안내</p>
      <h2 id="spot-questions-title" className="mt-3 font-serif text-2xl font-semibold text-ink">가격부터 회복까지, 궁금한 내용을 골라보세요</h2>
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
      {SPOT_QUESTION_GROUPS.map((group, index) => <div key={group.name} className="rounded-2xl border border-line bg-surface p-5">
        <h3 className="text-lg font-semibold text-ink"><span className="mr-2 text-primary" aria-hidden="true">0{index + 1}</span>{group.name}</h3>
        <ul className="mt-3 divide-y divide-line">
          {group.questions.map(({ slug, label }) => {
            const post = bySlug.get(slug);
            if (!post) throw new Error(`Missing spot guide: ${slug}`);
            return <li key={slug}><Link href={postPath("skin", post.slug)} className="group flex min-h-12 items-center justify-between gap-3 rounded-lg py-3 text-base leading-7 text-ink hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">
              <span>{label}</span><span aria-hidden="true" className="shrink-0 text-primary">→</span>
            </Link></li>;
          })}
        </ul>
      </div>)}
      </div>
    </div>
  </section>;
}
