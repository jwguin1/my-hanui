import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog-local";
import { HERBAL_GUIDES, herbalPath } from "@/lib/herbal-guides";
import { postPath } from "@/lib/slug";
import { pageMetadata } from "@/lib/page-metadata";
import { buildGraph, itemListNode, pageId, ref } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/ui/PageHeader";
import QuestionDirectory, { type QuestionEntry } from "@/components/QuestionDirectory";

const description = "통증치료·교통사고·보험한약·체질보약·다이어트·잡티제거의 질문과 답을 찾아보세요. 치료 과정, 비용, 시술 후 관리를 진료별로 모았습니다.";
export const metadata: Metadata = pageMetadata({ path: "/blog", title: "환자 질문 모음 | 증상·치료·비용 검색", description });

export default function BlogArchivePage() {
  const entries: QuestionEntry[] = [
    ...HERBAL_GUIDES.map(g => ({ title: g.question, description: g.summary, href: herbalPath(g), group: g.category === "insurance" ? "보험한약" : "체질보약", keywords: `${g.title} ${g.faqs.map(f => f.q).join(" ")}` })),
    ...getAllPosts().map(p => ({ title: p.title, description: p.description, href: postPath(p.category, p.slug), group: p.category === "pain" ? (/교통사고/.test(`${p.title} ${p.tags.join(" ")}`) ? "교통사고" : "통증치료") : p.category === "skin" ? "잡티제거" : p.category === "diet" ? "다이어트" : p.category === "autonomic" ? "체질보약" : "한의원 소식", keywords: p.tags.join(" ") })),
  ];
  const list = itemListNode("/blog", "post-list", "환자 질문과 진료 안내", entries.map(e => ({ url: `https://www.ilsanhan.com${e.href}`, name: e.title })));
  return <>
    <JsonLd graph={buildGraph({ path: "/blog", name: "환자 질문 모음 – 일산한의원", description, mainEntity: ref(pageId("/blog", "post-list")), nodes: [list] })} />
    <PageHeader badge="진료별 질문과 답" lead="내 고민과 닮은" accent="질문을 찾아보세요" stacked description={description} />
    <nav aria-label="방문과 치료 후 안내" className="flex flex-wrap justify-center gap-5 px-6 text-primary"><Link href="/contact#before-visit" className="underline underline-offset-4">오늘 방문 안내</Link><Link href="/aftercare" className="underline underline-offset-4">치료 후 관리 모음</Link></nav>
    <QuestionDirectory entries={entries} />
  </>;
}
