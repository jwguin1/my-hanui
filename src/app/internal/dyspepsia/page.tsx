import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import { FocusReadings } from "@/components/FocusGuides";
import HerbalArticleQuestions from "@/components/HerbalArticleQuestions";
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
const description = "일산한의원은 급체와 기능성 소화불량을 침과 한약으로 치료합니다. 식후 더부룩함과 명치 통증의 치료 과정, 보험 첩약 비용, 오서혜 한방내과 전문의 진료 안내.";
export const metadata = pageMetadata({ path: "/internal/dyspepsia", title: "일산 소화불량 한의원 | 급체·기능성소화불량 침치료", description, routeOgImage: true });
const faqs = [
  { q: "갑자기 체했는데 오늘 진료받을 수 있나요?", a: `네. 예약 없이 오셔도 당일 진료합니다. 언제부터 명치가 답답했는지 듣고 배를 진찰한 뒤 침 치료나 한방 소화제로 급체를 치료합니다. ${CLINIC.receptionNote}` },
  ...guide.faqs,
  { q: "위장약을 먹고 있어도 진료받을 수 있나요?", a: "네. 처방받은 위장약은 임의로 끊지 말고 약 봉투를 가져오세요. 내시경 결과가 있다면 함께 가져오세요. 약을 먹고 나아진 증상과 여전히 불편한 증상을 구분해 침 치료와 한약 처방에 반영합니다." },
];
export default function DyspepsiaPage() {
  return <>
    <JsonLd graph={buildGraph({ path: "/internal/dyspepsia", name: "소화불량 치료 – 일산한의원", description, about: { "@type": "MedicalCondition", name: "소화불량", alternateName: ["급체", "기능성소화불량"] }, faq: faqEntities([...faqs, ...HERBAL_CARE_FAQS]) })} />
    <PageHeader badge="일산한의원 · 기능성 소화불량" lead="조금만 먹어도 답답한 속," accent="침과 한약으로 치료합니다" stacked description="명치가 막힌 듯 답답하거나 식사를 끝내기 전에 배가 차서 수저를 놓으시나요? 일산한의원은 급체부터 반복되는 식후 불편까지 진료합니다. 편안하게 한 끼를 드시는 것이 치료의 목표입니다." />
    <SectionJumpNav label="소화불량 안내 목차" items={[["symptoms", "이런 불편이 있다면"], ["process", "진료 과정"], ["herbal-prices", "보험·비용"], ["insurance-questions", "궁금한 질문"], ["herbal-guide", "복용 후 관리"], ["related-guides", "함께 읽을 글"]]} />
    <section id="symptoms" className="mx-auto max-w-4xl scroll-mt-28 px-6 py-12">
      <h2 className="font-serif text-2xl font-semibold text-ink">식사할 때 어떤 점이 가장 힘드세요?</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">{["조금만 먹어도 더부룩하고 오래 남는 느낌", "식후 명치가 답답하고 잦은 트림", "검사는 정상이지만 반복되는 소화불량", "긴장하거나 신경 쓸 때 심해지는 불편"].map(t => <p key={t} className="rounded-xl border border-line bg-card p-5 text-base leading-7 text-ink">{t}</p>)}</div>
      <p className="mt-6 text-base leading-8 text-muted">한방내과 전문의 오서혜 원장은 소화불량과 식욕 저하를 진료합니다. 원장님 진료를 원하시면 카카오톡에 방문 희망일을 남겨주세요.</p>
      <nav aria-label="소화불량 의료진과 진료 질문" className="mt-3 flex flex-wrap gap-x-6 text-base text-primary underline underline-offset-4">
        <Link className="inline-flex min-h-11 items-center" href="/doctor#oh-seohye">오서혜 원장 약력과 진료 이야기</Link>
        <Link className="inline-flex min-h-11 items-center" href="/blog/소화불량-한약-재진">소화불량 한약, 언제까지 먹나요?</Link>
      </nav>
    </section>
    <HerbalArticleQuestions topic="dyspepsia" />
    <PatientJourney id="process" title="소화불량을 이렇게 치료합니다" intro="갑자기 체한 분은 지금의 명치 통증과 답답함부터 치료합니다. 식후 불편이 반복되는 분은 평소 한 끼를 얼마나 드시는지 듣고, 침 치료와 한약 복용 후 식사가 어떻게 달라지는지 재진까지 살핍니다." steps={DYSPEPSIA_JOURNEY} />
    <aside className="mx-auto max-w-4xl px-6 py-8" aria-labelledby="digestive-urgent-title">
      <h2 id="digestive-urgent-title" className="text-lg font-semibold text-ink">진료할 때 함께 알려주실 증상</h2>
      <p className="mt-3 text-base leading-8 text-muted">의도치 않게 체중이 줄거나 음식을 삼키기 어렵다면 진료를 미루지 마세요. 빈혈 진단을 받으셨다면 그 사실도 첫 진료 때 말씀해 주세요.</p>
      <p className="mt-3 text-base leading-8 text-muted">갑작스러운 심한 복통·흉통·호흡곤란·토혈·의식 저하 등 응급 증상은 일반 예약을 기다리지 말고 119 또는 응급실로 바로 도움을 요청하세요.</p>
    </aside>
    <HerbalPrices />
    <HerbalQuestions faqs={faqs} id="insurance-questions" title="소화불량 진료, 궁금한 점" />
    <CareGuide herbal />
    <FocusReadings focus="digestive" questions={false} />
    <RelatedPatientGuides title="함께 확인할 진료 안내" items={DIGESTIVE_READINGS} />
    <section className="bg-surface px-6 py-14 text-center">
      <h2 className="font-serif text-2xl font-semibold text-ink">언제부터 소화가 불편했는지 알려주세요</h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-8 text-muted">불편한 부위와 시작 시점, 현재 드시는 약을 카카오톡으로 남겨주세요. 진료시간 내 의료진이 상담하고 내원 준비를 안내합니다.</p>
      <ConsultationActions directions kakaoLabel="소화불량 진료 문의" className="mx-auto mt-7 max-w-3xl" />
    </section>
    <MobileConsultationBar label="소화불량 진료 문의" />
  </>;
}
