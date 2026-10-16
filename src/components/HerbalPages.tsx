import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import JsonLd from "@/components/JsonLd";
import ConsultationActions from "@/components/ConsultationActions";
import CareGuide from "@/components/CareGuide";
import { HerbalPrices, TonicPrices } from "@/components/TreatmentPrices";
import { HERBAL_CARE_FAQS } from "@/lib/care-guide";
import { HERBAL_GUIDES, HERBAL_HUB_FAQS, herbalPath, type HerbalCategory, type HerbalGuide } from "@/lib/herbal-guides";
import { buildGraph, faqEntities } from "@/lib/schema";

export function HerbalQuestions({ faqs, title = "진료 전 궁금한 질문", id = "questions" }: { faqs: { q: string; a: string }[]; title?: string; id?: string }) {
  return <section id={id} className="scroll-mt-24 px-6 py-12 md:py-16">
    <div className="mx-auto max-w-3xl">
      <h2 className="font-serif text-2xl font-semibold text-ink md:text-3xl">{title}</h2>
      <div className="mt-6 divide-y divide-line rounded-2xl border border-line bg-card px-6 md:px-8">
        {faqs.map((faq, i) => <article key={faq.q} id={`${id}-${i + 1}`} className="scroll-mt-24 py-7">
          <h3 className="text-lg font-semibold leading-relaxed text-ink">{faq.q}</h3>
          <p className="mt-3 text-[16px] leading-[1.9] text-ink/80">{faq.a}</p>
        </article>)}
      </div>
    </div>
  </section>;
}

function HerbalConsultation() {
  return <section className="bg-[var(--surface)] px-6 py-14 text-center">
    <h2 className="font-serif text-2xl font-semibold text-ink">내 증상부터 편하게 이야기해 주세요</h2>
    <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-muted">가장 불편한 증상과 복용 중인 약, 방문 희망일을 카카오톡으로 남겨주세요.<br />진료시간 내 의료진이 직접 상담합니다.</p>
    <ConsultationActions directions className="mx-auto mt-7 max-w-3xl" />
  </section>;
}

export const HERBAL_HUB_META = {
  insurance: { title: "일산 보험한약 | 소화불량·생리통 등 6개 질환", description: "건강보험 한약 10일 본인부담금 4만원대. 소화불량·생리통·비염·허리디스크·안면마비·뇌혈관질환 후유증의 질문과 적용 조건을 안내합니다." },
  tonic: { title: "일산 체질보약 | 맞춤보약·두통·어지럼·갱년기 한약", description: "비급여 한약 1개월 39만원·2개월 69만원·3개월 99만원. 체질맞춤보약, 두통·어지럼, 갱년기 상담과 원내 탕전·약재 사진 안내." },
};

export function HerbalHub({ category }: { category: HerbalCategory }) {
  const insurance = category === "insurance";
  const meta = HERBAL_HUB_META[category];
  const guides = HERBAL_GUIDES.filter(g => g.category === category);
  const label = insurance ? "보험한약" : "체질보약";
  return <>
    <JsonLd graph={buildGraph({ path: `/herbal/${category}`, name: meta.title, description: meta.description, faq: faqEntities([...HERBAL_HUB_FAQS[category], ...HERBAL_CARE_FAQS]) })} />
    <PageHeader badge={insurance ? "건강보험 한약" : "비급여 한약"} lead={insurance ? "내 증상에 맞는" : "지금 내 몸에 맞는"} accent={insurance ? "보험한약을 찾아보세요" : "체질보약을 상담하세요"} stacked description={insurance ? "소화불량부터 생리통까지, 6개 대상 질환을 질문과 답으로 안내합니다." : "체질맞춤보약 · 자율신경계 두통·어지럼 · 갱년기질환"} />
    <nav aria-label={`${label} 바로가기`} className="flex flex-wrap justify-center gap-5 border-y border-line px-6 py-5 text-[15px] font-medium text-primary">
      <Link href="#conditions" className="underline underline-offset-4">{insurance ? "6개 대상 질환" : "3개 진료 분야"}</Link>
      <Link href="#herbal-prices" className="underline underline-offset-4">비용 확인</Link>
      <Link href="#herbal-guide" className="underline underline-offset-4">원내 탕전·복용 상담</Link>
      <Link href={insurance ? "/herbal/tonic" : "/herbal/insurance"} className="underline underline-offset-4">{insurance ? "비급여 체질보약 안내" : "건강보험 한약 안내"}</Link>
    </nav>
    <section id="conditions" className="scroll-mt-24 px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif text-2xl font-semibold text-ink md:text-3xl">{insurance ? "어떤 증상이 가장 불편하세요?" : "가장 먼저 편해지고 싶은 일상은 무엇인가요?"}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {guides.map((g, i) => <Link key={g.slug} href={herbalPath(g)} className="group rounded-2xl border border-line bg-card p-6 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-primary">
            <p className="text-sm font-semibold text-primary">0{i + 1} · {g.title}</p>
            <h3 className="mt-3 text-xl font-semibold leading-relaxed text-ink">{g.question}</h3>
            <p className="mt-3 text-[15px] leading-[1.8] text-muted">{g.summary}</p>
            <span className="mt-5 inline-block text-[15px] font-semibold text-primary">질문과 답 읽기 →</span>
          </Link>)}
        </div>
      </div>
    </section>
    {insurance ? <HerbalPrices /> : <TonicPrices />}
    <HerbalQuestions faqs={HERBAL_HUB_FAQS[category]} title={insurance ? "보험 적용과 비용, 먼저 확인하세요" : "보약을 처음 고민할 때 궁금한 점"} />
    <CareGuide herbal />
    <HerbalConsultation />
  </>;
}

export function HerbalDetail({ guide }: { guide: HerbalGuide }) {
  const label = guide.category === "insurance" ? "보험한약" : "체질보약";
  return <>
    <JsonLd graph={buildGraph({ path: herbalPath(guide), name: `${guide.title} 한약 질문과 답 – 일산한의원`, description: guide.summary, faq: faqEntities(guide.faqs) })} />
    <nav aria-label="현재 위치" className="mx-auto max-w-4xl px-6 pt-6 text-sm text-primary"><Link href="/">홈</Link> · <Link href={`/herbal/${guide.category}`}>{label}</Link> · {guide.title}</nav>
    <PageHeader badge={`${label} · ${guide.title}`} lead={guide.question} description={guide.summary} />
    <HerbalQuestions faqs={guide.faqs} title={`${guide.title}, 궁금한 점부터 살펴보세요`} />
    <section className="bg-[var(--surface)] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold text-ink">첫 상담에 준비하면 좋은 것</h2>
        <p className="mt-3 text-[16px] leading-[1.9] text-ink/80">{guide.preparation}</p>
        <p className="mt-3 text-[16px] leading-[1.9] text-ink/80">검사 결과가 있다면 의료진이 꼼꼼히 살펴봅니다. 한약은 원내에서 조제·탕전하고 약재 사진을 보내드립니다.</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-[16px] font-medium text-primary">
          <Link href={`/herbal/${guide.category}#herbal-prices`} className="underline underline-offset-4">{label} 비용 보기</Link>
          <Link href={`/herbal/${guide.category}#herbal-guide`} className="underline underline-offset-4">한약 준비 기간·복용 상담</Link>
        </div>
      </div>
    </section>
    <nav aria-label="함께 읽을 진료 안내" className="mx-auto max-w-3xl px-6 py-10">
      <h2 className="text-xl font-semibold text-ink">함께 읽으면 도움이 되는 안내</h2>
      <ul className="mt-4 space-y-3 text-[16px] text-primary">{[...guide.related, { href: `/herbal/${guide.category}`, label: `${label} 전체 안내` }].map(l => <li key={l.href}><Link href={l.href} className="underline underline-offset-4">{l.label} →</Link></li>)}</ul>
    </nav>
    <HerbalConsultation />
  </>;
}
