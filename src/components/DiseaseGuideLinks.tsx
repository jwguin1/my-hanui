import Link from "next/link";
import { getAllPosts } from "@/lib/blog-local";
import { DISEASE_GUIDES, type DISEASE_GROUPS } from "@/lib/disease-guides";
import { postPath } from "@/lib/slug";

export default function DiseaseGuideLinks({ group }: { group: typeof DISEASE_GROUPS[number] }) {
  const keys = new Set(DISEASE_GUIDES.filter(g => g.group === group).slice(0, 6).map(g => `${g.category}/${g.slug}`));
  const posts = getAllPosts().filter(p => keys.has(`${p.category}/${p.slug}`));
  return <section className="mx-auto max-w-5xl px-6 py-12" aria-label={`${group} 진료 선택 질문`}>
    <h2 className="text-2xl font-bold leading-relaxed text-ink">진료 전에 궁금한 질문</h2>
    <p className="mt-3 leading-7 text-muted">증상을 구분하고, 검사·치료 내용을 이해하고, 방문을 준비하는 데 도움이 되는 글입니다.</p>
    <ul className="mt-6 grid gap-4 md:grid-cols-2">
      {posts.map(p => <li key={p.slug} className="rounded-xl border border-line bg-card p-5"><Link href={postPath(p.category, p.slug)} className="font-semibold leading-7 text-ink hover:text-primary">{p.title}</Link></li>)}
    </ul>
    <Link href="/conditions" className="mt-6 inline-block text-primary underline underline-offset-4">증상·검사별 질문 전체 보기</Link>
  </section>;
}
