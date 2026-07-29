import type { Metadata } from "next";
import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import StatCard from "@/components/ui/StatCard";
import PillButton from "@/components/ui/PillButton";
import DefinitionCard from "@/components/ui/DefinitionCard";
import StageCard from "@/components/ui/StageCard";
import QARow from "@/components/ui/QARow";
import {
  Activity,
  AlertTriangle,
  HelpCircle,
  ListCheck,
  Phone,
} from "@/components/ui/icons";
import { SITE_URL } from "@/lib/categories";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  path: "/diet/program",
  title: "일산 다이어트 한의원 | 한방 다이어트 처방 – 일산한의원 이마트풍산점",
  description:
    "고양시 일산한의원 한방 다이어트. 식단을 지속할 수 있도록 돕는 처방과 진료 기반 용량 조절. 연간 8,000건 이상 처방. 이마트 풍산점 3층, 평일 20시까지.",
});

const QUESTIONS = [
  {
    quote: "굶어서 뺐더니 금방 다시 쪄요",
    answer: "식단을 지속할 수 있는 상태를 만드는 게 먼저입니다",
  },
  {
    quote: "식단하는데도 안 빠져요",
    answer: "진료 후 용량을 조정하거나 대사 상태를 확인합니다",
  },
  {
    quote: "가슴이 두근거린다던데요",
    answer: "반응을 확인하며 용량을 조절합니다. 불편하면 바로 알려주세요",
  },
  {
    quote: "약값이 부담돼요",
    answer: "필요한 약재 위주로 구성해 부담을 줄였습니다",
  },
  {
    quote: "저도 한약이 꼭 필요할까요?",
    answer: "식단 조정만으로 되는 분께는 권하지 않습니다",
  },
  {
    quote: "운동을 못 하는데 가능할까요?",
    answer: "식단이 먼저입니다. 운동은 유지 단계에서 봅니다",
  },
];

const STAGES = [
  {
    step: 1,
    badge: "1단계",
    title: "식단 보조",
    note: "식단은 지키는데 배고픔이 힘든 경우입니다.",
    tags: ["최소 용량", "식단 병행"],
    treatment: "진료 후 최소 용량부터 시작",
  },
  {
    step: 2,
    badge: "2단계",
    title: "정체 구간",
    note: "식단을 지켜도 변화가 없을 때입니다.",
    tags: ["체중 정체", "대사 확인"],
    treatment: "진료 후 용량 조정 또는 혈액검사",
  },
  {
    step: 3,
    badge: "3단계",
    title: "유지기",
    note: "감량 후 체중을 지키는 단계입니다.",
    tags: ["요요 방지", "식습관 정착"],
    treatment: "용량을 줄이며 종료 시점 상담",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "한방 다이어트 처방 – 일산한의원",
    description:
      "식단을 지속할 수 있도록 돕는 한방 다이어트 처방. 복용량은 진료를 통해 조절합니다.",
    url: `${SITE_URL}/diet/program`,
    inLanguage: "ko",
    about: { "@type": "MedicalCondition", name: "비만" },
    provider: {
      "@type": "MedicalClinic",
      name: "일산한의원",
      url: SITE_URL,
      telephone: "+82-31-976-7706",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: QUESTIONS.map((q) => ({
      "@type": "Question",
      name: q.quote,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  },
];

export default function DietProgramPage() {
  return (
    <>
      <PageHeader
        badge="다이어트"
        icon={<Activity size={15} />}
        lead="굶어서 뺀 살은,"
        accent="굶는 걸 멈추면 돌아옵니다"
        stacked
      />

      {/* ── 정의 + 지표 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl">
              <DefinitionCard
                title="일산한의원 다이어트 한약이란?"
                body="식욕과 대사에 관여하는 약재 위주로 구성을 단순화한 처방입니다. 부가 약재를 줄여 복용 부담과 비용을 낮췄고, 식단을 지속할 수 있도록 돕는 데 초점을 맞췄습니다. 복용량은 진행 상황에 따라 진료를 통해 조절합니다."
              />

              <div className="mt-8 text-center text-[15px] leading-relaxed text-muted">
                <p>식단을 지킬 수 있으면 절반은 된 겁니다.</p>
                <p>그 절반을 버티게 하는 것이 한약의 역할입니다.</p>
              </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard value="8,000" unit="건+" label="연간 처방" />
              <StatCard value="혈액검사" label="대사 확인" />
              <StatCard value="고양·파주" label="내원 지역" />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 환자분들의 질문 ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge
                icon={<HelpCircle size={15} />}
                label="환자분들의 질문"
              />
              <div className="mt-4">
                <TwoTone as="h2" lead="이런 말씀을 " accent="많이 하십니다" />
              </div>
            </div>

            <div className="mx-auto mt-14 flex max-w-4xl flex-col gap-2.5">
              {QUESTIONS.map((q) => (
                <QARow key={q.quote} quote={q.quote} answer={q.answer} />
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 복용 방식 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="복용 방식" />
              <div className="mt-4">
                <TwoTone as="h2" lead="필요한 만큼만 " accent="처방합니다" />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 lg:grid-cols-3">
              {STAGES.map((s) => (
                <StageCard key={s.step} {...s} />
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 복용 중 확인 (안전 안내 — 삭제 금지) ── */}
      <section className="bg-[var(--surface)]">
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

      {/* ── CTA ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-[22px] font-semibold text-ink">
                일산감비환 상담 신청
              </h2>
              <p className="mt-3 text-[15px] text-muted">
                체질과 대사 상태에 맞춘 처방을 상담받으실 수 있습니다
              </p>

              <div className="mt-6">
                <Link
                  href="/diet"
                  className="text-[14px] font-medium text-primary transition-colors duration-200 hover:text-tan"
                >
                  다이어트 관련 연구 보기 &rarr;
                </Link>
              </div>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <PillButton
                  href="https://diet.ilsanhan.com"
                  variant="solid"
                  className="w-full sm:w-auto"
                >
                  상담 신청하기 &rarr;
                </PillButton>
                <PillButton
                  href="tel:031-976-7706"
                  variant="outline"
                  icon={<Phone size={16} />}
                  className="w-full sm:w-auto"
                >
                  전화 문의 031-976-7706
                </PillButton>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {jsonLd.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
