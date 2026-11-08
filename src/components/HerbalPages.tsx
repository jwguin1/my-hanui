import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import JsonLd from "@/components/JsonLd";
import ConsultationActions from "@/components/ConsultationActions";
import CareGuide from "@/components/CareGuide";
import PatientJourney from "@/components/PatientJourney";
import SectionJumpNav from "@/components/SectionJumpNav";
import MobileConsultationBar from "@/components/MobileConsultationBar";
import RelatedPatientGuides from "@/components/RelatedPatientGuides";
import { INSURANCE_JOURNEY, TONIC_JOURNEY, DIGESTIVE_READINGS } from "@/lib/herbal-experience";
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

function HerbalConsultation({ category }: { category?: HerbalCategory }) {
  return <section className="bg-[var(--surface)] px-6 py-14 text-center">
    <h2 className="font-serif text-2xl font-semibold text-ink">{category === "insurance" ? "보험한약 적용부터 진료 준비까지 문의하세요" : category === "tonic" ? "피로·소화·수면, 가장 힘든 점부터 알려주세요" : "내 증상부터 편하게 이야기해 주세요"}</h2>
    <p className="mx-auto mt-4 max-w-xl text-[16px] leading-8 text-muted">{category === "insurance" ? "현재 증상과 올해 보험한약을 처방받은 이력이 있다면 함께 남겨주세요. 진료시간 내 의료진이 상담하고, 보험 적용과 비용은 진찰 후 안내합니다." : "가장 불편한 증상과 복용 중인 약, 방문 희망일을 카카오톡으로 남겨주세요. 진료시간 내 의료진이 직접 상담합니다."}</p>
    <ConsultationActions directions kakaoLabel={category === "insurance" ? "보험한약 진료 문의" : "한약 상담 문의"} className="mx-auto mt-7 max-w-3xl" />
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
    <PageHeader badge={insurance ? "일산한의원 · 건강보험 한약" : "일산한의원 · 체질보약"} lead={insurance ? "불편한 증상을 진찰하고," : "쉬어도 회복이 더딜 때,"} accent={insurance ? "보험 적용까지 살핍니다" : "지금의 몸 상태를 살핍니다"} stacked description={insurance ? "소화불량·생리통 등 6개 대상 질환의 한약 진료를 안내합니다. 의료진이 진찰하고 올해 처방 이력을 확인해 치료 계획과 비용을 설명드립니다." : "피로만 따로 보지 않고 소화·수면과 최근 몸의 변화를 함께 봅니다. 진찰을 바탕으로 처방 목적과 복용 기간을 정합니다."} />
    <SectionJumpNav label={`${label} 안내 목차`} items={[["herbal-visit", "진료 과정"], ["conditions", insurance ? "6개 대상 질환" : "증상별 상담"], ["herbal-prices", "비용 확인"], ["questions", "궁금한 질문"], ["herbal-guide", "조제·복용 관리"]]} />
    <PatientJourney id="herbal-visit" title={insurance ? "보험 기준과 몸 상태를 함께 확인합니다" : "보약을 정하기 전에 일상의 변화를 듣습니다"} intro={insurance ? "같은 증상이라도 진단과 처방 이력에 따라 보험 적용이 달라집니다. 적용 여부를 혼자 판단하지 말고 진료에서 확인하세요." : "체질이나 한약 이름을 미리 정하지 않고 오셔도 됩니다. 현재 가장 불편한 점과 이전 치료 경험부터 이야기해 주세요."} steps={insurance ? INSURANCE_JOURNEY : TONIC_JOURNEY} />
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
    {!insurance && <section className="mx-auto max-w-5xl px-6 pb-12" aria-label="산후·임신 준비·성장·공진단 진료">
      <h2 className="text-2xl font-semibold leading-relaxed text-ink">생애주기에 맞춰 상담하는 한약</h2>
      <p className="mt-3 leading-8 text-muted">산후·유산 후 회복, 난임·임신 준비, 소아 성장과 공진단도 일산한의원에서 진료합니다. 검사 결과와 복용 약, 현재 불편을 함께 살펴 처방과 기간·비용을 안내합니다.</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {[
          ["일산-산후보약-유산후보약", "산후·유산 후 보약", "수유·출혈·피로와 회복 상태를 함께 살핍니다."],
          ["일산-난임-시험관-임신준비", "난임·임신 준비", "주기·검사와 현재 치료 일정을 확인합니다."],
          ["일산-성장클리닉-성조숙증", "소아 성장", "성장 기록·발달과 식사·수면을 함께 봅니다."],
          ["일산-한약-공진단-상담", "공진단·맞춤 한약", "복용 목적과 병력·약을 살펴 처방합니다."],
        ].map(([slug, title, text]) => <Link key={slug} href={`/blog/${slug}`} className="rounded-xl border border-line bg-card p-5"><h3 className="font-semibold text-ink">{title}</h3><p className="mt-2 leading-7 text-muted">{text}</p><span className="mt-3 inline-block text-primary">질문과 답 읽기 →</span></Link>)}
      </div>
      <p className="mt-4 text-sm leading-7 text-muted">공진단 등 개별 처방은 구성과 복용 기간에 따라 비용을 별도로 안내합니다.</p>
    </section>}
    {insurance ? <HerbalPrices /> : <TonicPrices />}
    <HerbalQuestions faqs={HERBAL_HUB_FAQS[category]} title={insurance ? "보험 적용과 비용, 먼저 확인하세요" : "보약을 처음 고민할 때 궁금한 점"} />
    <CareGuide herbal />
    {insurance && <RelatedPatientGuides title="소화불량으로 보험한약을 고민하고 있다면" items={DIGESTIVE_READINGS.slice(0, 2)} />}
    <p className="px-6 py-6 text-center text-sm text-primary"><a href="https://research.ilsanhan.com/category/korean" className="underline underline-offset-4">한약·침 치료의 논문 해설 읽기 →</a></p>
    <HerbalConsultation category={category} />
    <MobileConsultationBar label={insurance ? "보험한약 진료 문의" : "체질보약 상담 문의"} />
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
    {guide.sources && <section className="mx-auto max-w-3xl px-6 pb-10" aria-label="참고 자료">
      <h2 className="text-lg font-semibold text-ink">참고 자료</h2>
      <ul className="mt-3 space-y-3 text-sm leading-7 text-primary">{guide.sources.map(source => <li key={source.href}><a href={source.href} className="underline underline-offset-4">{source.label}</a></li>)}</ul>
    </section>}
    <HerbalConsultation />
  </>;
}
