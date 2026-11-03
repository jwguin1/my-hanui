import PatientJourney from "@/components/PatientJourney";
import PatientQuestions from "@/components/PatientQuestions";
import SectionJumpNav from "@/components/SectionJumpNav";
import MobileConsultationBar from "@/components/MobileConsultationBar";
import { DIET_JOURNEY } from "@/lib/patient-journeys";
import { DIET_PRICES, won } from "@/lib/pricing";
import { DIET_COST_ANSWER } from "@/lib/diet-questions";
import DietQuestionGuide from "@/components/DietQuestionGuide";
import PriceTable from "@/components/ui/PriceTable";
import ConsultationActions from "@/components/ConsultationActions";
import type { Metadata } from "next";
import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import StatCard from "@/components/ui/StatCard";
import PillButton from "@/components/ui/PillButton";
import DefinitionCard from "@/components/ui/DefinitionCard";
import {
  Activity,
  AlertTriangle,
  HelpCircle,
} from "@/components/ui/icons";
import { SITE_URL } from "@/lib/categories";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph, faqEntities } from "@/lib/schema";
import LocalBlock from "@/components/LocalBlock";
import { LOCAL_BLOCKS, localFaqEntities } from "@/lib/local-blocks";

export const metadata: Metadata = pageMetadata({
  path: "/diet/program",
  title: "일산감비환 가격·상담 | 다이어트 한약",
  ogTitle: "일산감비환 가격·상담 | 일산한의원 다이어트",
  description:
    `감비환 가격과 처방을 알아보신다면 일산감비환을 확인하세요. 1상자 ${DIET_PRICES.sachets}포, 노랑 ${won(DIET_PRICES.yellow)}·핑크 ${won(DIET_PRICES.pink)}. 일산한의원 다이어트 상담과 복용 안내, 첫 상담 약 ${DIET_PRICES.consultationMinutes}분.`,
  routeOgImage: true,
});

const QUESTIONS = [
  { quote: "일산감비환 가격과 한 상자 복용 기간은 어떻게 되나요?", answer: DIET_COST_ANSWER },
  { quote: "어떤 약이 맞는지 모르겠는데 상담받아도 되나요?", answer: "네. 체중 변화와 식사·수면, 복용 중인 약부터 말씀해 주세요. 의료진이 건강 상태를 살펴 감비환이 필요한지 판단하고 처방과 복용량을 설명합니다. 식사 조정만으로 충분한 경우에는 그 방법부터 안내합니다." },
  { quote: "식단을 조절하는데 체중이 그대로예요", answer: "최근 식사량과 식사 시간, 수면, 복용 상황을 함께 확인합니다. 체중 변화가 더딘 이유를 살핀 뒤 생활 관리나 처방을 조정하고, 필요한 경우 대사 상태를 확인하는 검사를 안내합니다." },
  { quote: "복용 후 두근거리거나 잠이 안 오면 어떻게 하나요?", answer: "불편한 증상은 참지 말고 의료진에게 알려주세요. 증상이 시작된 시점과 복용량, 함께 드신 약이나 커피를 확인해 복용을 계속할지, 용량을 바꾸거나 중단할지 안내합니다. 흉통·호흡곤란·실신이 동반되면 답변을 기다리지 말고 즉시 응급진료를 받으세요." },
  { quote: "감량한 뒤에는 어떻게 관리하나요?", answer: "목표에 가까워지면 체중 추이와 식사 습관을 함께 살펴 복용량을 줄이거나 마칠 시점을 정합니다. 감량 중 유지할 수 있었던 식사와 활동을 생활 속에 이어가도록 계획합니다." },
  { quote: "운동을 많이 못 하는데 상담받아도 되나요?", answer: "네. 현재 가능한 활동량과 식사 패턴을 말씀해 주세요. 무리한 운동을 전제로 계획하지 않고, 생활에 맞는 식사·활동 계획과 처방 필요성을 함께 살핍니다." },
];


const graph = buildGraph({
  path: "/diet/program",
  name: "일산감비환 가격·상담 | 일산한의원 다이어트",
  description:
    "일산한의원의 일산감비환 가격·복용·다이어트 상담 안내. 감비환 복용량은 진료를 통해 정합니다.",
  about: { "@type": "MedicalCondition", name: "비만" },
  faq: [
    ...faqEntities(QUESTIONS.map((q) => ({ q: q.quote, a: q.answer }))),
    ...localFaqEntities("/diet/program"),
  ],
});

export default function DietProgramPage() {
  return (
    <>
      <JsonLd graph={graph} />
      <PageHeader
        badge="일산한의원 · 감비환 상담"
        icon={<Activity size={15} />}
        lead="일산감비환"
        subtitle="다이어트"
        description="내 몸에 맞는지, 얼마나 먹어야 하는지부터 상담하세요. 일산한의원은 식사·수면·건강 상태를 살펴 일산감비환을 처방하고, 복용 중 변화와 감량 이후의 유지 계획까지 함께 봅니다."
      />

      <SectionJumpNav label="일산감비환 안내 목차" items={[["prices", "가격·복용 기간"], ["diet-visit", "상담·처방 과정"], ["diet-faq", "복용 전 궁금한 점"], ["diet-safety", "복용 중 확인"]]} />

      <section id="prices" className="scroll-mt-24 mx-auto max-w-4xl px-6 py-10">
        <h2 className="font-serif text-2xl font-semibold text-ink">첫 상담과 일산감비환 비용</h2>
        <p className="mt-4 text-base leading-relaxed text-muted">첫 상담은 약 {DIET_PRICES.consultationMinutes}분입니다. 체중 변화, 식사·수면 패턴과 복용 중인 약을 확인하고 처방을 상담합니다. 접수나 추가 검사 시간은 별도입니다.</p>
        <div className="mt-6"><PriceTable caption="일산감비환 · 1상자 100포" rows={[{ name: "노랑", price: won(DIET_PRICES.yellow) }, { name: "핑크", price: won(DIET_PRICES.pink) }]} /></div>
        <p className="mt-4 text-base leading-relaxed text-muted">1상자 100포는 하루 1포 기준 100일, 하루 2포 기준 50일 분량입니다. 복용량은 진료 후 정합니다.</p>
        <Link href="/diet/다이어트한약-기간과-비용" className="mt-4 inline-block text-primary underline underline-offset-4">복용 기간과 비용 자세히 보기 →</Link>
      </section>

      <PatientJourney id="diet-visit" title="첫 상담부터 복용 후 관리까지" intro="체중만 보고 같은 양을 처방하지 않습니다. 현재 건강 상태와 생활 패턴을 듣고, 몸의 반응을 보며 복용 계획을 조정합니다." steps={DIET_JOURNEY} />

      {/* ── 정의 + 지표 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            {/* 전용 페이지 안내 배너 — 하단 CTA 와 함께 상·하 2곳 */}
            <div className="mx-auto mb-10 flex max-w-3xl flex-col gap-4 rounded-2xl border border-line bg-surface px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-ink">
                  일산감비환 상담 신청
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  성분과 자세한 복용 안내는 전용 페이지에서 확인하실 수 있습니다
                </p>
              </div>
              <PillButton
                href="https://diet.ilsanhan.com"
                variant="solid"
                className="w-full shrink-0 sm:w-auto"
              >
                일산감비환 안내 보기 &rarr;
              </PillButton>
            </div>

            <div className="mx-auto max-w-3xl">
              <DefinitionCard
                title="일산감비환은 어떤 다이어트 한약인가요?"
                body="식욕과 대사에 관여하는 약재 위주로 구성을 단순화한 처방입니다. 부가 약재를 줄여 복용 부담과 비용을 낮췄고, 식단을 지속할 수 있도록 돕는 데 초점을 맞췄습니다. 복용량은 진행 상황에 따라 진료를 통해 조절합니다."
              />

              <div className="mt-8 text-center text-[15px] leading-relaxed text-muted">
                <p>감량하는 동안의 식사와 수면, 복용 후 몸의 반응을 함께 살핍니다.</p>
              </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard value="9,000" unit="건+" label="2023년 개원 이래 누적 처방" />
              <StatCard value="혈액검사" label="대사 확인" />
              <StatCard value="고양·파주" label="내원 지역" />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 환자분들의 질문 ── */}
      <section id="diet-faq" className="scroll-mt-28 bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge
                icon={<HelpCircle size={15} />}
                label="환자분들의 질문"
              />
              <div className="mt-4">
                <TwoTone as="h2" lead="복용 전에 " accent="궁금한 점" />
              </div>
            </div>

            <PatientQuestions items={QUESTIONS} />
          </SectionReveal>
        </div>
      </section>

      {/* ── 복용 중 확인 (안전 안내 — 삭제 금지) ── */}
      <section id="diet-safety" className="scroll-mt-28 bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge
                icon={<AlertTriangle size={15} />}
                label="복용 중 확인"
              />
              <div className="mt-4">
                <TwoTone
                  as="h2"
                  lead="이런 증상이 있으면 "
                  accent="바로 알려주세요"
                />
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-3xl">
              <DefinitionCard
                title="복용 중 확인해주세요"
                body="복용 중 가슴 두근거림, 불면, 손 떨림, 심한 갈증이 있으면 즉시 알려주세요. 용량을 조절하거나 처방을 변경합니다. 고혈압, 심장질환, 갑상선 질환이 있으시거나 복용 중인 약이 있으면 진료 시 반드시 말씀해주세요."
              />
            </div>
          </SectionReveal>
        </div>
      </section>

      <DietQuestionGuide />
      <LocalBlock {...LOCAL_BLOCKS["/diet/program"]} />

      {/* ── CTA ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-[22px] font-semibold text-ink">
                일산감비환 상담 신청
              </h2>
              <p className="mt-3 text-[15px] text-muted">
                복용 중인 약과 식사·수면에서 불편한 점을 남겨주세요. 의료진이 상담해 드립니다.
              </p>

              <div className="mt-6">
                <Link
                  href="/diet"
                  className="text-[14px] font-medium text-primary transition-colors duration-200 hover:text-tan"
                >
                  일산감비환 질문과 답 더 보기 &rarr;
                </Link>
              </div>

              <ConsultationActions kakaoLabel="일산감비환 상담 문의" className="mt-8" />
              <p className="mt-5"><a href="https://diet.ilsanhan.com" target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline underline-offset-4">일산감비환 프로그램 자세히 보기 →</a></p>
            </div>
          </SectionReveal>
        </div>
      </section>

      <MobileConsultationBar label="일산감비환 상담 문의" />
    </>
  );
}
