import Link from "next/link";
import DiseaseGuideLinks from "@/components/DiseaseGuideLinks";
import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ConsultationActions from "@/components/ConsultationActions";
import { HerbalQuestions } from "@/components/HerbalPages";
import CareGuide from "@/components/CareGuide";
import { HerbalPrices } from "@/components/TreatmentPrices";
import { HERBAL_GUIDES } from "@/lib/herbal-guides";
import { HERBAL_CARE_FAQS } from "@/lib/care-guide";
import { CLINIC } from "@/lib/clinic";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph, faqEntities } from "@/lib/schema";

const guide = HERBAL_GUIDES.find(g => g.slug === "dyspepsia")!;
const description = "급체·반복되는 소화불량의 진료 과정과 기능성 소화불량 보험한약을 안내합니다. 건강보험 한약 10일 4만원대, 원내 탕전·약재 사진 안내.";
export const metadata: Metadata = pageMetadata({ path: "/internal/dyspepsia", title: "일산 소화불량 한의원 | 급체·기능성소화불량 침치료", description, routeOgImage: true });
const faqs = [...guide.faqs, { q: "갑자기 체했는데 오늘 진료받을 수 있나요?", a: `예약 없이도 당일 진료가 가능합니다. 증상을 확인한 뒤 침 치료와 한방 소화제 등 필요한 치료를 안내합니다. ${CLINIC.receptionNote}` }];
export default function DyspepsiaPage() {
  return <>
    <JsonLd graph={buildGraph({ path: "/internal/dyspepsia", name: "소화불량 치료 – 일산한의원", description, about: { "@type": "MedicalCondition", name: "소화불량", alternateName: ["급체", "기능성소화불량"] }, faq: faqEntities([...faqs, ...HERBAL_CARE_FAQS]) })} />
    <PageHeader badge="보험한약 · 소화불량" lead="갑자기 체했을 때도," accent="늘 더부룩할 때도" stacked description="언제부터, 어떤 식사 후에 불편한지 알려주세요. 반복되는 소화불량은 검사 결과와 생활 패턴을 함께 살펴봅니다." />
    <nav aria-label="소화불량 안내 바로가기" className="flex flex-wrap justify-center gap-5 border-y border-line px-6 py-4 text-primary"><Link href="#process">진료 과정</Link><Link href="#herbal-prices">보험·비용</Link><Link href="#insurance-questions">궁금한 질문</Link><Link href="/herbal/insurance">보험한약 6개 질환</Link></nav>
    <section className="mx-auto max-w-4xl px-6 py-12">
      <h2 className="font-serif text-2xl font-semibold text-ink">어떤 불편이 이어지고 있나요?</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{["조금만 먹어도 더부룩하고 오래 남는 느낌", "식후 명치가 답답하고 잦은 트림", "검사는 정상이지만 반복되는 소화불량", "긴장하거나 신경 쓸 때 심해지는 불편"].map(t => <p key={t} className="rounded-xl border border-line bg-card p-5 text-base text-ink">{t}</p>)}</div>
      <p className="mt-6 text-base leading-relaxed text-muted">갑자기 생긴 급체인지, 몇 달째 반복되는 불편인지부터 구분합니다. 내시경 결과와 복용 중인 약이 있다면 가져와 주세요.</p>
      <Link href="/blog/체했을때-한의원-내과" className="mt-6 block rounded-xl border border-line bg-surface p-5 text-primary underline underline-offset-4">체했을 때 한의원과 내과, 어디로 가야 하나요? 위험 증상과 방문 전 준비 확인하기</Link>
    </section>
    <section id="process" className="scroll-mt-24 bg-[var(--surface)] px-6 py-12"><div className="mx-auto max-w-4xl">
      <h2 className="font-serif text-2xl font-semibold text-ink">첫 상담부터 경과 확인까지</h2>
      <ol className="mt-6 grid gap-4 md:grid-cols-3">{[
        ["1. 증상과 검사 결과 확인", "식사량, 불편한 시간대, 배변·수면 상태와 복용 중인 약을 살펴봅니다. 검사가 먼저 필요한 경우에는 해당 진료를 안내합니다."],
        ["2. 몸 상태에 맞는 치료 안내", "진찰 결과에 따라 침 치료·한방 소화제·한약 가운데 필요한 치료를 설명합니다. 기능성 소화불량에 해당하면 보험한약 적용과 비용도 안내합니다."],
        ["3. 식후 불편의 변화 확인", "먹을 수 있는 양, 더부룩함이 이어지는 시간, 소화제를 찾는 빈도를 확인해 다음 치료와 처방을 정합니다."],
      ].map(([title, body]) => <li key={title} className="rounded-xl border border-line bg-card p-5"><h3 className="font-semibold text-ink">{title}</h3><p className="mt-3 text-base leading-relaxed text-muted">{body}</p></li>)}</ol>
      <p className="mt-6 text-sm leading-relaxed text-muted">이유 없는 체중 감소, 삼킴 곤란, 검은 변·혈변, 심한 빈혈이 있으면 검사를 먼저 받으세요. 갑자기 심한 복통이나 가슴 통증이 생기면 지체하지 말고 진료받으세요.</p>
    </div></section>
    <HerbalPrices />
    <HerbalQuestions faqs={faqs} id="insurance-questions" title="소화불량 진료, 궁금한 점" />
    <CareGuide herbal />
    <section className="bg-[var(--surface)] px-6 py-12 text-center"><h2 className="font-serif text-2xl font-semibold text-ink">어떤 때 소화가 불편한지 알려주세요</h2><p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">{CLINIC.consultationPrompt}</p><ConsultationActions directions className="mt-6" /><div className="mt-6 flex flex-wrap justify-center gap-5 text-primary"><Link href="/herbal/tonic/autonomic" className="underline underline-offset-4">긴장할 때 두통·어지럼도 함께 있다면</Link><Link href="/blog" className="underline underline-offset-4">다른 환자 질문 보기</Link></div></section>
  <DiseaseGuideLinks group="소화·내과" />
    </>;
}
