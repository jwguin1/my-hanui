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
    <h2 className="font-serif text-2xl font-semibold text-ink">{category === "insurance" ? "보험한약 진료를 받으시려면" : category === "tonic" ? "보약 진료, 편한 날에 오세요" : "한약 진료를 받으시려면"}</h2>
    <p className="mx-auto mt-4 max-w-xl text-[16px] leading-8 text-muted">{category === "insurance" ? "카카오톡에 진료받으실 증상과 방문 희망일을 남겨주세요. 올해 다른 곳에서 보험한약을 드셨다면 처방받은 달도 알려주세요." : "카카오톡에 가장 불편한 점과 방문 희망일을 남겨주세요. 부모님 보약은 자녀분이 먼저 진료 일정을 문의하셔도 됩니다."}</p>
    <ConsultationActions directions kakaoLabel={category === "insurance" ? "보험한약 진료 문의" : "한약 상담 문의"} className="mx-auto mt-7 max-w-3xl" />
  </section>;
}

export const HERBAL_HUB_META = {
  insurance: { title: "일산 보험한약 | 소화불량·생리통 등 6개 질환", description: "건강보험 한약 10일 본인부담금 4만원대. 소화불량·생리통·비염·허리디스크·안면마비·뇌혈관질환 후유증의 질문과 적용 조건을 안내합니다." },
  tonic: { title: "일산 체질보약 | 맞춤보약·두통·어지럼·갱년기 한약", description: "비급여 한약 1개월 39만원·2개월 69만원·3개월 99만원. 체질맞춤보약, 두통·어지럼, 갱년기 상담과 원내 탕전·약재 사진 안내." },
};

export function HerbalHub({ category, children }: { category: HerbalCategory; children?: React.ReactNode }) {
  const insurance = category === "insurance";
  const meta = HERBAL_HUB_META[category];
  const guides = HERBAL_GUIDES.filter(g => g.category === category);
  const label = insurance ? "보험한약" : "체질보약";
  return <>
    <JsonLd graph={buildGraph({ path: `/herbal/${category}`, name: meta.title, description: meta.description, faq: faqEntities([...HERBAL_HUB_FAQS[category], ...HERBAL_CARE_FAQS]) })} />
    <PageHeader badge={insurance ? "일산한의원 · 보험한약" : "일산한의원 · 체질보약"} lead={insurance ? "소화불량부터 생리통까지," : "쉬어도 피곤하고 입맛이 떨어질 때,"} accent={insurance ? "건강보험 한약으로 치료합니다" : "내 몸에 맞는 보약을 짓습니다"} stacked description={insurance ? "기능성 소화불량·월경통 등 여섯 질환을 진료합니다. 건강보험 적용 대상인 분께는 증상에 맞춘 한약을 처방하고 원내에서 직접 달여 드립니다." : "한 끼를 다 먹기 힘든 분과 새벽마다 깨서 아침이 힘든 분은 처방이 다릅니다. 일산한의원은 식욕과 잠, 피로가 겹치는 양상에 맞춰 약재를 고르고 한 사람의 보약을 직접 달입니다."} />
    <SectionJumpNav label={`${label} 안내 목차`} items={[["herbal-visit", "진료 과정"], ["conditions", insurance ? "6개 대상 질환" : "증상별 상담"], ["herbal-prices", "비용 확인"], ["questions", "궁금한 질문"], ["herbal-guide", "조제·복용 관리"]]} />
    <PatientJourney id="herbal-visit" title={insurance ? "첫 진료부터 보험한약을 받기까지" : "보약 한 제를 짓는 과정"} intro={insurance ? "첫 방문 때 가장 불편한 증상을 말씀해 주세요. 진찰부터 처방, 건강보험 적용과 복용 안내까지 한의원에서 진행합니다." : "평소보다 식사가 얼마나 줄었는지, 하루 중 언제 기운이 가장 떨어지는지 말씀해 주세요. 첫 진료 때 나눈 이야기를 바탕으로 약재와 복용 기간을 정합니다."} steps={insurance ? INSURANCE_JOURNEY : TONIC_JOURNEY} />
    <nav aria-label="한방내과 의료진과 진료 질문" className="mx-auto flex max-w-5xl flex-wrap gap-x-6 px-6 text-base text-primary underline underline-offset-4 [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center">
      <Link href="/doctor#oh-seohye">오서혜 한방내과 전문의 소개</Link>
      {insurance ? <Link href="/blog/소화불량-한약-재진">소화불량 한약을 드신 뒤 재진할 때</Link> : <>
        <Link href="/blog/피로-식사량-저하">피곤하고 식사량도 줄었을 때</Link>
        <Link href="/blog/한약-복용약-함께">처방약과 한약을 함께 복용할 때</Link>
        <Link href="/blog/부모님-보약-상담준비">부모님 보약을 자녀가 먼저 알아볼 때</Link>
      </>}
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
    <p className="mx-auto max-w-5xl px-6 py-5 text-center text-base"><Link href="/blog/소화불량-보험한약-보약-비용" className="text-primary underline underline-offset-4">소화불량 보험 첩약과 체질보약, 비용은 어떻게 다른가요?</Link></p>
    <HerbalQuestions faqs={HERBAL_HUB_FAQS[category]} title={insurance ? "보험한약 대상과 비용" : "보약을 처음 지을 때 궁금한 점"} />
    <CareGuide herbal />
    {insurance && <RelatedPatientGuides title="소화불량으로 보험한약을 고민하고 있다면" items={DIGESTIVE_READINGS.slice(0, 2)} />}
    <p className="px-6 py-6 text-center text-sm text-primary"><a href="https://research.ilsanhan.com/category/korean" className="underline underline-offset-4">한약·침 치료의 논문 해설 읽기 →</a></p>
    {children}
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
    {guide.specialistNote && <aside className="mx-auto max-w-3xl px-6 pt-8 text-base leading-8">
      <p>{guide.specialistNote}</p>
      <Link href="/doctor#oh-seohye" className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">오서혜 원장 약력과 진료 이야기</Link>
    </aside>}
    <HerbalQuestions faqs={guide.faqs} title={`${guide.title} 진료 질문`} />
    <section className="bg-[var(--surface)] px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xl font-semibold text-ink">첫 상담에 준비하면 좋은 것</h2>
        <p className="mt-3 text-[16px] leading-[1.9] text-ink/80">{guide.preparation}</p>
        <p className="mt-3 text-[16px] leading-[1.9] text-ink/80">한약은 처방에 맞춰 원내에서 직접 달입니다. 사용한 약재 사진과 복용 방법을 보내드립니다.</p>
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
    <section className="bg-surface px-6 py-12 text-center">
      <h2 className="text-2xl font-semibold text-ink">{guide.title} 진료 문의</h2>
      <p className="mt-3 text-base leading-8 text-muted">카카오톡에 불편한 증상과 방문 희망일을 남겨주세요.</p>
      <ConsultationActions directions kakaoLabel="카카오톡 진료 문의" className="mx-auto mt-6 max-w-3xl" />
    </section>
    <MobileConsultationBar label="카카오톡 진료 문의" />
  </>;
}
