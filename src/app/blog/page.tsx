import { clinicDirectoryEntries } from "@/lib/clinic-patient-questions";
import { AGNES_FAQS } from "@/lib/agnes";
import { HOME_VISIT_FAQS } from "@/lib/home-visit";
import { PIGMENTATION_FAQS, TONING_FAQS } from "@/lib/skin-laser-care";
import { LIFTING_FAQS, HAIR_REMOVAL_FAQS } from "@/lib/skin-treatment";
import { PRICING_VISIT_FAQS } from "@/lib/visit-guide";
import { diseaseGuide } from "@/lib/disease-guides";
import { articleCareTopic, herbalQuestionAnchor, herbalTopic } from "@/lib/patient-care-topics";
import { parsePostFaq } from "@/lib/post-faq";
import { getResearchArticles, researchUrl, RESEARCH_CATEGORIES } from "@/lib/research";
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

const description = "두통·어지럼, 갱년기, 피로와 보약부터 통증·피부·소화불량까지, 환자가 자주 묻는 질문으로 일산한의원의 진료 과정과 비용, 방문 방법을 찾아보세요.";
export const metadata: Metadata = pageMetadata({ path: "/blog", title: "환자 질문 모음 | 증상·치료·비용 검색", description });

export default function BlogArchivePage() {
  const sharedLabels: Record<string, string> = { "통증·재활": "통증", "일산감비환": "다이어트", "피부·시술 선택": "미용" };
  const serviceQuestions = [
    { path: "/skin/pigmentation", label: "색소 착색 잡티 홍조 재생 레이저", group: "미용", faqs: PIGMENTATION_FAQS },
    { path: "/skin/toning", label: "제네시스 피코 토닝관리", group: "미용", faqs: TONING_FAQS },
    { path: "/skin/lifting", label: "리프팅 초음파 고주파 슈링크 볼뉴머", group: "미용", faqs: LIFTING_FAQS },
    { path: "/skin/hair-removal", label: "얼굴 제모 수염 면도", group: "미용", faqs: HAIR_REMOVAL_FAQS },
    { path: "/skin/agnes", label: "아그네스 반복성 여드름 피지선", group: "미용", faqs: AGNES_FAQS },
    { path: "/pricing", label: "가격 비용 건강보험 추나 약침", group: "비용·방문 안내", faqs: PRICING_VISIT_FAQS },
  ];
  const directory: QuestionEntry[] = [
    ...serviceQuestions.map(({ path, label, faqs, group }) => ({
      title: faqs[0].q, description: faqs[0].a, href: path + "#questions", group,
      keywords: [label, ...faqs.map(faq => faq.q)].join(" "),
    })),
    ...HOME_VISIT_FAQS.map(({ id, q, a }) => ({
      title: q, description: a, href: "/home-visit#question-" + id, group: "방문진료", keywords: "고양시 파주시 왕진 재택 방문진료",
    })),
    {
      title: "이마트 풍산점 어디로 들어가면 되나요?", description: "일산한의원은 이마트 풍산점 3층입니다. 주차장 입구와 한의원까지 오는 길을 사진으로 안내합니다.",
      href: "/contact#directions", group: "비용·방문 안내", keywords: "길찾기 주차 주소 풍산역 엘리베이터",
    },
    ...HERBAL_GUIDES.flatMap(guide => {
      const path = herbalPath(guide);
      const { group, keywords } = herbalTopic(guide);
      return [
        { title: guide.question, description: guide.summary, href: path, group, keywords: guide.title + " " + keywords },
        ...guide.faqs.map(({ q, a }) => ({
          title: q, description: a, href: path + "#" + herbalQuestionAnchor(q),
          group, keywords: guide.title + " " + keywords,
        })),
      ];
    }),
    ...getAllPosts().map(post => {
      const guide = diseaseGuide(post.category, post.slug);
      const focus = postFocus(post);
      const topic = articleCareTopic(post.slug);
      const group = topic?.group ?? (focus ? FOCUS_GUIDES[focus].label : guide ? sharedLabels[guide.group] ?? guide.group : "방문 안내·기타");
      return {
        title: post.title, description: post.description, href: postPath(post.category, post.slug), group,
        keywords: [topic?.keywords, guide?.keywords, ...post.tags, ...parsePostFaq(post.content).map(faq => faq.q)].filter(Boolean).join(" "),
      };
    }),
    ...clinicDirectoryEntries(),
    ...getResearchArticles().map(article => ({
      title: article.title, description: article.summary, href: researchUrl(article), group: "연구노트",
      keywords: [RESEARCH_CATEGORIES[article.category].label, article.question, ...article.tags, ...article.faq.map(faq => faq.question)].join(" "),
    })),
  ];
  const list = itemListNode("/blog", "post-list", "환자 질문과 진료 안내", directory.map(e => ({ url: new URL(e.href, "https://www.ilsanhan.com").href, name: e.title })));
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
    <QuestionDirectory entries={directory} />
  </>;
}
