import Link from "next/link";
import { getAllPosts } from "@/lib/blog-local";
import { DISEASE_GUIDES, DISEASE_GROUPS } from "@/lib/disease-guides";
import { postPath } from "@/lib/slug";
import { pageMetadata } from "@/lib/page-metadata";
import { buildGraph, itemListNode, pageId, ref } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/ui/PageHeader";
import QuestionDirectory from "@/components/QuestionDirectory";

const description = "허리·어깨 통증, 소화불량, 수면·어지럼, 여성 건강과 피부 고민. 증상과 검사별로 필요한 진료, 준비 자료, 일산한의원의 실제 치료를 알아보세요.";
export const metadata = pageMetadata({ path: "/conditions", title: "일산 증상·검사별 진료 선택 | 환자 질문과 답", description });

export default function ConditionsPage() {
  const posts = new Map(getAllPosts().map(p => [`${p.category}/${p.slug}`, p]));
  const entries = DISEASE_GUIDES.map(g => {
    const p = posts.get(`${g.category}/${g.slug}`);
    if (!p) throw new Error(`Missing disease guide: ${g.slug}`);
    return { title: p.title, description: p.description, href: postPath(p.category, p.slug), group: g.group, keywords: g.keywords };
  });
  const list = itemListNode("/conditions", "question-list", "증상·검사별 진료 선택 질문", entries.map(e => ({ name: e.title, url: `https://www.ilsanhan.com${e.href}` })));
  return <>
    <JsonLd graph={buildGraph({ path: "/conditions", name: "일산 증상·검사별 진료 선택", description, mainEntity: ref(pageId("/conditions", "question-list")), nodes: [list] })} />
    <PageHeader badge="증상별 질문과 답" lead="불편한 증상부터," accent="의료진이 함께 살핍니다" stacked description={description} />
    <div className="mx-auto max-w-6xl px-6">
      <p className="rounded-2xl border border-line bg-surface p-5 text-[16px] leading-8 text-ink">증상의 원인이나 필요한 검사를 미리 정하지 않고 오셔도 됩니다. 일산한의원 의료진이 문진과 진찰로 원인을 감별하고 필요한 치료를 합니다. 추가 검사·전문 치료·입원이 필요하면 상급병원 등 적절한 의료기관으로 의뢰·전원합니다. 각 글에서 증상별 진료 과정과 실제 치료 내용을 확인하세요.</p>
      <nav aria-label="원내 진료와 방문 안내" className="mt-6 flex flex-wrap gap-x-6 gap-y-4 text-primary">
        <Link href="/pain/chronic" className="underline underline-offset-4">침·추나·약침</Link>
        <Link href="/internal/dyspepsia" className="underline underline-offset-4">소화불량</Link>
        <Link href="/herbal/insurance" className="underline underline-offset-4">보험한약</Link>
        <Link href="/skin/questions" className="underline underline-offset-4">피부 진료</Link>
        <Link href="/contact" className="underline underline-offset-4">진료시간·방문</Link>
      </nav>
    </div>
    <QuestionDirectory entries={entries} groups={["전체", ...DISEASE_GROUPS]} />
  </>;
}
