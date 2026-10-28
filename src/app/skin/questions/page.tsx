import Link from "next/link";
import { getAllPosts } from "@/lib/blog-local";
import { REGIONAL_GUIDE_GROUPS } from "@/lib/regional-guides";
import { postPath } from "@/lib/slug";
import { pageMetadata } from "@/lib/page-metadata";
import { buildGraph, itemListNode, pageId, ref } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/ui/PageHeader";

const description = "점·비립종·쥐젖, 기미·흑자, 리프팅·제모부터 다이어트와 진료 선택까지. 환자가 궁금한 질문과 원내 실제 진료를 연결했습니다.";
export const metadata = pageMetadata({ path: "/skin/questions", title: "일산 피부 진료·치료 선택 질문 모음", description });

export default function SkinQuestionsPage() {
  const byKey = new Map(getAllPosts().map(p => [`${p.category}/${p.slug}`, p]));
  const groups = REGIONAL_GUIDE_GROUPS.map(g => ({ ...g, posts: g.items.map(item => {
    const post = byKey.get(`${item.category}/${item.slug}`);
    if (!post) throw new Error(`Missing regional guide: ${item.slug}`);
    return post;
  }) }));
  const list = itemListNode("/skin/questions", "question-list", "피부 진료와 치료 선택 질문", groups.flatMap(g => g.posts.map(p => ({ name: p.title, url: `https://www.ilsanhan.com${postPath(p.category, p.slug)}` }))));
  return <>
    <JsonLd graph={buildGraph({ path: "/skin/questions", name: "일산 피부 진료·치료 선택 질문 모음", description, mainEntity: ref(pageId("/skin/questions", "question-list")), nodes: [list] })} />
    <PageHeader badge="고민별 질문과 답" lead="내 피부 고민," accent="무엇부터 알아볼까요?" stacked description="병변을 구분하고, 치료와 비용을 이해하고, 방문을 준비하는 순서로 읽어보세요." />
    <p className="mx-auto max-w-5xl px-6 pb-6"><Link href="/conditions" className="text-primary underline underline-offset-4">피부질환·새 시술 비교를 포함한 증상별 질문 더 보기</Link></p>
    <nav aria-label="질문 분야 바로가기" className="mx-auto flex max-w-5xl flex-wrap gap-3 px-6 pb-8">
      {groups.map((g, i) => <a key={g.name} href={`#guide-${i}`} className="rounded-full border border-line px-4 py-3 text-sm font-medium text-primary">{g.name}</a>)}
    </nav>
    <div className="mx-auto max-w-5xl px-6 pb-16">
      <p className="rounded-xl bg-surface p-5 leading-7 text-muted">원내 진료는 잡티·비립종 제거, 색소·피부결, 슈링크·볼뉴머, 얼굴·수염 제모와 일산감비환입니다. 다른 시술을 다룬 글은 선택을 돕는 정보이며, 각 글에서 실제 시행 범위를 안내합니다. <Link href="/doctor" className="text-primary underline underline-offset-4">의료진 소개</Link>와 <Link href="/contact" className="text-primary underline underline-offset-4">방문 안내</Link>도 확인해 보세요.</p>
      {groups.map((g, i) => <section id={`guide-${i}`} key={g.name} className="scroll-mt-24 pt-12" aria-labelledby={`guide-heading-${i}`}>
        <h2 id={`guide-heading-${i}`} className="text-2xl font-bold leading-relaxed text-ink">{g.name}</h2>
        <p className="mt-2 leading-7 text-muted">{g.description}</p>
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {g.posts.map(p => <li key={p.slug} className="rounded-xl border border-line bg-card p-5">
            <h3 className="text-lg font-semibold leading-7 text-ink"><Link href={postPath(p.category, p.slug)} className="hover:text-primary">{p.title} <span aria-hidden="true">→</span></Link></h3>
            <p className="mt-3 text-[15px] leading-7 text-muted">{p.description}</p>
          </li>)}
        </ul>
      </section>)}
    </div>
  </>;
}
