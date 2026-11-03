import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import PatientJourney from "@/components/PatientJourney";
import SectionJumpNav from "@/components/SectionJumpNav";
import MobileConsultationBar from "@/components/MobileConsultationBar";
import ConsultationActions from "@/components/ConsultationActions";
import CareGuide from "@/components/CareGuide";
import RelatedPatientGuides from "@/components/RelatedPatientGuides";
import { HerbalQuestions } from "@/components/HerbalPages";
import { HERBAL_JOURNEY, HERBAL_OVERVIEW_FAQS, HERBAL_READINGS } from "@/lib/herbal-experience";
import { HERBAL_CARE_FAQS } from "@/lib/care-guide";
import { HERBAL_PRICES, won } from "@/lib/pricing";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph, faqEntities } from "@/lib/schema";

const title = "일산 한약 상담 | 보험한약·체질보약·복용 관리";
const description = "현재 증상과 복용 중인 약을 살펴 한약의 필요성과 처방을 정합니다. 일산한의원의 보험한약·체질보약 비용, 원내 탕전·약재 사진, 복용 후 상담을 안내합니다.";
export const metadata = pageMetadata({ path: "/herbal", title, description });

export default function HerbalPage() {
  return <>
    <JsonLd graph={buildGraph({ path: "/herbal", name: title, description, faq: faqEntities([...HERBAL_OVERVIEW_FAQS, ...HERBAL_CARE_FAQS]) })} />
    <PageHeader badge="일산한의원 · 맞춤 한약" lead="몸 상태부터 살피고," accent="필요한 한약을 처방합니다" stacked description="피로·소화·수면 중 가장 불편한 점부터 말씀해 주세요. 현재 몸 상태를 진찰하고, 처방 목적과 기간·비용을 설명드립니다." />
    <SectionJumpNav label="한약 안내 목차" items={[["herbal-options", "종류·비용"], ["herbal-visit", "진료 과정"], ["herbal-guide", "조제·복용 관리"], ["questions", "궁금한 질문"], ["related-guides", "함께 읽을 글"]]} />
    <section id="herbal-options" className="scroll-mt-28 px-6 py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-serif text-2xl font-semibold text-ink md:text-3xl">어떤 한약이 필요한지는 진찰 후 함께 정합니다</h2>
        <p className="mt-4 text-base leading-8 text-muted">보험한약과 체질보약의 대상과 비용을 먼저 살펴보세요. 진료에서는 현재 증상과 병력, 복용 중인 약을 확인해 처방을 안내합니다.</p>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <Link href="/herbal/insurance" className="rounded-2xl border border-line bg-card p-6 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary">
            <h3 className="text-xl font-semibold text-ink">건강보험 한약</h3>
            <p className="mt-3 font-semibold text-primary">10일 처방 · 본인부담금 {HERBAL_PRICES.insuredTenDays}</p>
            <p className="mt-4 text-base leading-8 text-muted">기능성 소화불량·월경통·알레르기 비염·허리디스크·안면신경마비·뇌혈관질환 후유증이 대상입니다. 질환과 올해 처방 이력을 확인해 적용 범위를 안내합니다.</p>
            <span className="mt-5 inline-block font-medium text-primary">6개 대상 질환과 보험 기준 →</span>
          </Link>
          <Link href="/herbal/tonic" className="rounded-2xl border border-line bg-card p-6 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary">
            <h3 className="text-xl font-semibold text-ink">체질보약 · 비급여 한약</h3>
            <p className="mt-3 font-semibold text-primary">1개월 · 60팩 · {won(HERBAL_PRICES.oneMonth)}</p>
            <p className="mt-4 text-base leading-8 text-muted">피로·소화·수면과 몸의 변화를 함께 살핍니다. 체질맞춤보약, 두통·어지럼, 갱년기 등 증상에 맞춰 처방 목적과 복용 기간을 상의합니다.</p>
            <span className="mt-5 inline-block font-medium text-primary">증상별 상담과 기간별 비용 →</span>
          </Link>
        </div>
        <p className="mt-4 text-sm leading-7 text-muted">공진단 등 개별 처방은 구성과 복용 기간에 따라 비용을 별도로 안내합니다.</p>
      </div>
    </section>
    <PatientJourney id="herbal-visit" title="첫 상담부터 복용 후 변화까지 살핍니다" intro="약 봉투나 복용 중인 제품 사진, 기존 검사 결과가 있으면 가져와 주세요. 없더라도 현재 불편한 증상부터 진료받으실 수 있습니다." steps={HERBAL_JOURNEY} />
    <CareGuide herbal priceHref="#herbal-options" />
    <HerbalQuestions faqs={HERBAL_OVERVIEW_FAQS} title="한약을 처음 고민할 때 궁금한 점" />
    <RelatedPatientGuides title="내 상황과 가까운 질문을 읽어보세요" items={HERBAL_READINGS} />
    <section className="bg-surface px-6 py-14 text-center">
      <h2 className="font-serif text-2xl font-semibold text-ink">가장 불편한 일상부터 알려주세요</h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-muted">언제부터 힘들었는지, 현재 어떤 약을 드시는지 남겨주세요. 진료시간 내 의료진이 상담하고 방문 준비를 안내합니다.</p>
      <ConsultationActions directions kakaoLabel="한약 상담 문의" className="mx-auto mt-7 max-w-3xl" />
    </section>
    <MobileConsultationBar label="한약 상담 문의" />
  </>;
}
