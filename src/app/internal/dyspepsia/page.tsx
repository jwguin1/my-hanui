import PageHeader from "@/components/ui/PageHeader";
import ConsultationActions from "@/components/ConsultationActions";
import PatientJourney from "@/components/PatientJourney";
import SectionJumpNav from "@/components/SectionJumpNav";
import MobileConsultationBar from "@/components/MobileConsultationBar";
import RelatedPatientGuides from "@/components/RelatedPatientGuides";
import { HerbalQuestions } from "@/components/HerbalPages";
import CareGuide from "@/components/CareGuide";
import { HerbalPrices } from "@/components/TreatmentPrices";
import { HERBAL_GUIDES } from "@/lib/herbal-guides";
import { HERBAL_CARE_FAQS } from "@/lib/care-guide";
import { DYSPEPSIA_JOURNEY, DIGESTIVE_READINGS } from "@/lib/herbal-experience";
import { CLINIC } from "@/lib/clinic";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph, faqEntities } from "@/lib/schema";

const guide = HERBAL_GUIDES.find(g => g.slug === "dyspepsia")!;
const description = "급체·반복되는 소화불량, 의료진이 진찰해 침 치료·한방 소화제·한약과 추가 검사 필요성을 판단합니다. 일산한의원 진료 과정, 기능성 소화불량 보험한약 비용과 복용 후 관리 안내.";
export const metadata = pageMetadata({ path: "/internal/dyspepsia", title: "일산 소화불량 한의원 | 급체·기능성소화불량 침치료", description, routeOgImage: true });
const faqs = [
  { q: "갑자기 체했는데 오늘 진료받을 수 있나요?", a: `예약 없이도 당일 진료가 가능합니다. 언제부터 어떤 불편이 생겼는지 진찰하고 침 치료·한방 소화제 등 필요한 치료를 시행합니다. 추가 검사나 전문 치료가 필요하면 의료진이 판단해 의뢰합니다. ${CLINIC.receptionNote}` },
  ...guide.faqs,
  { q: "위장약을 먹고 있거나 검사 결과가 있어도 진료받을 수 있나요?", a: "네. 현재 먹는 약의 이름과 복용량, 내시경 등 검사 결과가 있다면 가져와 주세요. 기존 치료와 검사 내용을 함께 살펴 남아 있는 불편을 진찰합니다. 검사부터 새로 받고 오실 필요는 없으며, 추가 검사 여부는 의료진이 판단합니다. 기존 처방약은 임의로 끊지 마세요." },
];
export default function DyspepsiaPage() {
  return <>
    <JsonLd graph={buildGraph({ path: "/internal/dyspepsia", name: "소화불량 치료 – 일산한의원", description, about: { "@type": "MedicalCondition", name: "소화불량", alternateName: ["급체", "기능성소화불량"] }, faq: faqEntities([...faqs, ...HERBAL_CARE_FAQS]) })} />
    <PageHeader badge="일산한의원 · 소화불량 진료" lead="갑자기 체했을 때도," accent="늘 더부룩할 때도" stacked description="불편한 이유를 살피는 진료부터 시작합니다. 급체인지 반복되는 소화불량인지 진찰하고, 지금 필요한 치료와 이후 경과를 설명드립니다." />
    <SectionJumpNav label="소화불량 안내 목차" items={[["symptoms", "이런 불편이 있다면"], ["process", "진료 과정"], ["herbal-prices", "보험·비용"], ["insurance-questions", "궁금한 질문"], ["herbal-guide", "복용 후 관리"], ["related-guides", "함께 읽을 글"]]} />
    <section id="symptoms" className="mx-auto max-w-4xl scroll-mt-28 px-6 py-12">
      <h2 className="font-serif text-2xl font-semibold text-ink">식사할 때 어떤 점이 가장 힘드세요?</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{["조금만 먹어도 더부룩하고 오래 남는 느낌", "식후 명치가 답답하고 잦은 트림", "검사는 정상이지만 반복되는 소화불량", "긴장하거나 신경 쓸 때 심해지는 불편"].map(t => <p key={t} className="rounded-xl border border-line bg-card p-5 text-base leading-7 text-ink">{t}</p>)}</div>
      <p className="mt-6 text-base leading-8 text-muted">원인을 미리 정하지 않고 오셔도 됩니다. 증상이 시작된 시점과 식사 후 불편이 이어지는 시간부터 듣고, 의료진이 문진과 진찰로 치료 방향을 잡습니다.</p>
    </section>
    <PatientJourney id="process" title="진찰부터 식후 불편의 변화까지 살핍니다" intro="갑자기 생긴 급체와 몇 달째 반복되는 불편은 경과가 다릅니다. 같은 소화불량이라도 현재 증상과 진찰 결과에 맞춰 치료합니다." steps={DYSPEPSIA_JOURNEY} />
    <aside className="mx-auto max-w-4xl px-6 py-8" aria-labelledby="digestive-urgent-title">
      <h2 id="digestive-urgent-title" className="text-lg font-semibold text-ink">진료할 때 함께 알려주실 증상</h2>
      <p className="mt-3 text-base leading-8 text-muted">체중 감소·삼킴 곤란·빈혈 등 동반 증상도 알려주세요. 의료진이 진찰해 검사의 필요성과 시급성을 판단합니다.</p>
      <p className="mt-3 text-base leading-8 text-muted">갑작스러운 심한 복통·흉통·호흡곤란·토혈·의식 저하 등 응급 증상은 일반 예약을 기다리지 말고 119 또는 응급실로 바로 도움을 요청하세요.</p>
    </aside>
    <HerbalPrices />
    <HerbalQuestions faqs={faqs} id="insurance-questions" title="소화불량 진료, 궁금한 점" />
    <CareGuide herbal />
    <RelatedPatientGuides title="내 불편과 가까운 질문을 더 읽어보세요" items={DIGESTIVE_READINGS} />
    <section className="bg-surface px-6 py-14 text-center">
      <h2 className="font-serif text-2xl font-semibold text-ink">언제부터 소화가 불편했는지 알려주세요</h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-muted">불편한 부위와 시작 시점, 현재 드시는 약을 카카오톡으로 남겨주세요. 진료시간 내 의료진이 상담하고 내원 준비를 안내합니다.</p>
      <ConsultationActions directions kakaoLabel="소화불량 진료 문의" className="mx-auto mt-7 max-w-3xl" />
    </section>
    <MobileConsultationBar label="소화불량 진료 문의" />
  </>;
}
