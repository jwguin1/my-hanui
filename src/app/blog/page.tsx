import { diseaseGuide } from "@/lib/disease-guides";
import { CONSULTATION_GUIDE_SLUGS } from "@/lib/regional-guides";
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
import FocusGuides from "@/components/FocusGuides";
import { FOCUS_GUIDES, postFocus } from "@/lib/focus-guides";

const description = "통증·다이어트·미용·기능성 소화불량의 질문과 답을 모았습니다. 내 증상부터 치료 과정, 비용과 관리까지 확인하세요.";
export const metadata: Metadata = pageMetadata({ path: "/blog", title: "환자 질문 모음 | 증상·치료·비용 검색", description });

export default function BlogArchivePage() {
  const focusByPath = new Map(getAllPosts().map(p => [postPath(p.category, p.slug), postFocus(p)]));
  const entries: QuestionEntry[] = [
    ...HERBAL_GUIDES.map(g => ({ title: g.question, description: g.summary, href: herbalPath(g), group: g.category === "insurance" ? "보험한약" : "체질보약", keywords: `${g.title} ${g.faqs.map(f => f.q).join(" ")}` })),
    ...getAllPosts().map(p => ({ title: p.title, description: p.description, href: postPath(p.category, p.slug), group: (p.id.startsWith("disease-") ? diseaseGuide(p.category, p.slug)?.group : undefined) ?? (p.category === "pain" ? (/교통사고/.test(`${p.title} ${p.tags.join(" ")}`) ? "교통사고" : "통증치료") : p.category === "skin" ? (CONSULTATION_GUIDE_SLUGS.includes(p.slug) ? "치료선택" : "잡티제거") : p.category === "diet" ? "일산감비환" : p.category === "autonomic" ? "체질보약" : (p.id.startsWith("regional-") ? "방문준비" : "한의원 소식")), keywords: `${diseaseGuide(p.category, p.slug)?.keywords ?? ""} ${p.tags.join(" ")} ${p.category === "diet" ? "감비환 일산감비환 일산한의원 다이어트" : ""}` })),
  ];
  const list = itemListNode("/blog", "post-list", "환자 질문과 진료 안내", entries.map(e => ({ url: `https://www.ilsanhan.com${e.href}`, name: e.title })));
  return <>
    <JsonLd graph={buildGraph({ path: "/blog", name: "환자 질문 모음 – 일산한의원", description, mainEntity: ref(pageId("/blog", "post-list")), nodes: [list] })} />
    <PageHeader badge="진료별 질문과 답" lead="내 고민과 닮은" accent="질문을 찾아보세요" stacked description={description} />
    <nav aria-label="지금 필요한 안내" className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-5 md:grid-cols-4">
      {[
        { href: "/contact#before-visit", title: "오늘 진료받고 싶어요", detail: "접수 마감·휴진일·주차" },
        { href: "/pain/chronic", title: "치료받아도 계속 아파요", detail: "기존 검사와 치료 경과" },
        { href: "/pricing", title: "비용부터 보고 싶어요", detail: "진료비·포함 항목·시간" },
        { href: "/aftercare", title: "치료 후 관리가 궁금해요", detail: "회복 관리·다음 진료" },
      ].map(item => <Link key={item.href} href={item.href} className="min-w-0 rounded-xl border border-line bg-surface p-4 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><span className="block text-base font-semibold leading-7 text-ink">{item.title}</span><span className="mt-1 block text-sm leading-6 text-muted">{item.detail}</span></Link>)}
    </nav>
    <FocusGuides />
    <QuestionDirectory entries={entries.map(entry => {
      if (entry.href === "/internal/dyspepsia") return { ...entry, group: "기능성 소화불량" };
      const focus = focusByPath.get(entry.href);
      return { ...entry, group: focus ? FOCUS_GUIDES[focus].label : "다른 진료·소식" };
    })} />
  </>;
}
