import type { Metadata } from "next";
import SectionReveal from "@/components/SectionReveal";
import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import IconTile from "@/components/ui/IconTile";
import StatCard from "@/components/ui/StatCard";
import PillButton from "@/components/ui/PillButton";
import DefinitionCard from "@/components/ui/DefinitionCard";
import NumberedStep from "@/components/ui/NumberedStep";
import QARow from "@/components/ui/QARow";
import CompareTable from "@/components/ui/CompareTable";
import {
  AlertCircle,
  AlertTriangle,
  Hands,
  HelpCircle,
  Herb,
  ListCheck,
  MessageCircle,
  MoodSad,
  Needle,
  Phone,
  Soup,
  Stethoscope,
  Wind,
} from "@/components/ui/icons";
import { SITE_URL } from "@/lib/categories";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph, faqEntities } from "@/lib/schema";
import LocalBlock from "@/components/LocalBlock";
import { LOCAL_BLOCKS, localFaqEntities } from "@/lib/local-blocks";

export const metadata: Metadata = pageMetadata({
  path: "/internal/dyspepsia",
  title: "일산 소화불량 한의원 | 급체·기능성소화불량 침치료",
  description:
    "고양시 일산한의원. 급체는 당일 침 치료로, 반복되는 소화불량은 한약·침·추나로 접근합니다. 이마트 풍산점 3층, 평일 20시까지.",
  routeOgImage: true,
});

const QUESTIONS = [
  {
    quote: "내시경은 깨끗하대요",
    answer: "구조가 아니라 움직임의 문제일 수 있습니다",
  },
  {
    quote: "체하면 등까지 아파요",
    answer: "등과 명치는 같은 신경을 씁니다. 등 쪽도 함께 봅니다",
  },
  {
    quote: "소화제를 달고 살아요",
    answer: "왜 반복되는지부터 확인합니다",
  },
  {
    quote: "신경 쓰면 바로 얹혀요",
    answer: "자율신경이 얽혀 있으면 그쪽부터 봅니다",
  },
  {
    quote: "한약은 소화가 안 될 것 같아요",
    answer: "소화 부담이 적은 처방으로 조정할 수 있습니다",
  },
  {
    quote: "급하게 체했는데 오늘 되나요?",
    answer: "당일 침 치료 가능합니다",
  },
];

const SYMPTOMS = [
  {
    icon: <Soup />,
    title: "더부룩함",
    body: "조금만 먹어도 배가 부르고 오래 남아 있는 느낌이 듭니다.",
  },
  {
    icon: <AlertCircle />,
    title: "명치 답답함",
    body: "명치가 조이거나 무언가 걸린 듯한 느낌이 있습니다.",
  },
  {
    icon: <Wind />,
    title: "잦은 트림",
    body: "트림이나 가스가 자주 나옵니다.",
  },
  {
    icon: <MoodSad />,
    title: "식후 불편",
    body: "식사 후 특히 심해지고, 잠들기 전까지 이어집니다.",
  },
];

const COMPARE_ROWS = [
  {
    label: "상황",
    left: "갑자기 체하거나 얹힌 경우",
    right: "몇 달째 늘 더부룩한 경우",
  },
  {
    label: "원인",
    left: "일시적인 위장 운동 저하",
    right: "자율신경·스트레스·자세가 얽힌 경우",
  },
  {
    label: "치료",
    left: "침 치료 + 한방 소화제",
    right: "한약 · 침 · 추나",
  },
  { label: "기간", left: "1~3회", right: "주 2회, 4주 정도" },
];

const TREATMENTS = [
  {
    icon: <Needle />,
    title: "침 치료",
    body: "위장 운동과 관련된 부위를 자극해 불편을 줄입니다. 급체는 당일 진행합니다.",
  },
  {
    icon: <Soup />,
    title: "한방 소화제",
    body: "급하게 체한 경우 침 치료와 함께 씁니다.",
  },
  {
    icon: <Herb />,
    title: "한약 처방",
    body: "반복되는 소화불량에서 체질과 상태를 보고 처방합니다. 기능성소화불량은 건강보험 적용을 받으실 수 있습니다.",
  },
  {
    icon: <Hands />,
    title: "추나요법",
    body: "등과 명치의 긴장, 자세로 인한 부담을 함께 봅니다.",
  },
];

const PROCESS = [
  {
    title: "문진",
    body: "언제부터, 어떤 음식과 상황에서 심해지는지 확인합니다.",
  },
  {
    title: "감별",
    body: "먼저 검사가 필요한 경우인지 확인합니다. 필요하면 내시경이 가능한 의료기관을 안내드립니다.",
  },
  {
    title: "급성 치료",
    body: "급체라면 당일 침 치료와 한방 소화제로 진행합니다.",
  },
  {
    title: "재평가",
    body: "1~3회에 좋아지면 종결합니다. 반복되는 경우라면 한약·추나로 접근을 바꿉니다.",
  },
  {
    title: "종결",
    body: "증상이 정리되면 종결하고, 재발 시 관리 방법을 안내드립니다.",
  },
];

const graph = buildGraph({
  path: "/internal/dyspepsia",
  name: "소화불량 치료 – 일산한의원",
  description:
    "급체는 당일 침 치료로, 반복되는 소화불량은 한약·침·추나로 접근합니다.",
  about: {
    "@type": "MedicalCondition",
    name: "소화불량",
    alternateName: ["급체", "기능성소화불량"],
  },
  faq: [
    ...faqEntities(QUESTIONS.map((q) => ({ q: q.quote, a: q.answer }))),
    ...localFaqEntities("/internal/dyspepsia"),
  ],
});

export default function DyspepsiaPage() {
  return (
    <>
      <JsonLd graph={graph} />
      <PageHeader
        badge="내과"
        icon={<Stethoscope size={15} />}
        lead="체한 건 며칠이면 낫는데,"
        accent="늘 더부룩한 건 다릅니다"
        stacked
      />

      {/* ── 정의 + 지표 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl">
              <DefinitionCard
                title="소화불량이란?"
                body="검사에서 위·장에 뚜렷한 이상이 없는데도 더부룩함, 명치 답답함, 잦은 트림이 이어지는 경우가 많습니다. 급하게 체한 것과, 몇 달째 반복되는 것은 원인도 치료도 다릅니다."
              />

              <div className="mt-8 text-center text-[15px] leading-relaxed text-muted">
                <p>
                  며칠 만에 좋아질 것과, 시간을 들여야 할 것을 나눠 말씀드립니다.
                </p>
                <p>급하게 체하셨다면 당일 치료가 가능합니다.</p>
              </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard value="1~3" unit="회" label="급체 치료 횟수" />
              <StatCard value="당일" label="내원 즉시 시술" />
              <StatCard value="20:00" label="평일 야간진료" />
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

      {/* ── 증상 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<Soup size={15} />} label="증상" />
              <div className="mt-4">
                <TwoTone as="h2" lead="이런 증상으로 " accent="오십니다" />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2 lg:grid-cols-4">
              {SYMPTOMS.map((s) => (
                <div key={s.title} className="card p-6">
                  <IconTile icon={s.icon} />
                  <h3 className="mt-4 text-[16px] font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.8] text-muted">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 확인해주세요 ── 증상 소개 바로 다음에 둔다. 하단으로 옮기지 말 것 */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge
                icon={<AlertTriangle size={15} />}
                label="확인해주세요"
              />
              <div className="mt-4">
                <TwoTone as="h2" lead="먼저 검사가 " accent="필요한 경우" />
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-3xl">
              <DefinitionCard
                title="내원 전 확인해주세요"
                body="체중이 특별한 이유 없이 줄었거나, 음식을 삼킬 때 걸리는 느낌이 있거나, 검은 변이나 혈변을 보셨거나, 심한 빈혈이 있으시면 내시경 검사를 먼저 받으시길 권해드립니다. 55세 이후 처음 소화불량이 시작된 경우에도 검사를 먼저 받아보시는 것이 좋습니다. 복용 중인 약이 있으면 진료 시 알려주세요."
              />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 치료 기준 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="치료 기준" />
              <div className="mt-4">
                <TwoTone
                  as="h2"
                  lead="같은 소화불량이라도 "
                  accent="치료가 다릅니다"
                />
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-4xl">
              <CompareTable
                rows={COMPARE_ROWS}
                headers={["급체 · 급성", "반복되는 소화불량"]}
              />

              <blockquote className="mt-8 border-l-[3px] border-primary bg-card p-5 text-[15px] leading-[1.8] text-ink">
                급체는 며칠이면 좋아집니다. 그때는 한약을 권해드리지 않습니다.
              </blockquote>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 치료 방법 ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<Needle size={15} />} label="치료 방법" />
              <div className="mt-4">
                <TwoTone as="h2" lead="어떻게 " accent="치료하나요?" />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
              {TREATMENTS.map((t) => (
                <div key={t.title} className="card p-6">
                  <IconTile icon={t.icon} />
                  <h3 className="mt-4 text-[16px] font-semibold text-ink">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.8] text-muted">
                    {t.body}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 치료 과정 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="치료 과정" />
              <div className="mt-4">
                <TwoTone as="h2" lead="첫 방문부터 " accent="종결까지" />
              </div>
            </div>

            <ol className="mx-auto mt-14 max-w-2xl">
              {PROCESS.map((p, i) => (
                <NumberedStep
                  key={p.title}
                  index={i + 1}
                  title={p.title}
                  body={p.body}
                  last={i === PROCESS.length - 1}
                />
              ))}
            </ol>
          </SectionReveal>
        </div>
      </section>

      <LocalBlock {...LOCAL_BLOCKS["/internal/dyspepsia"]} />

      {/* ── CTA ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <PillButton
                href="tel:031-976-7706"
                variant="solid"
                icon={<Phone size={16} />}
                className="w-full sm:w-auto"
              >
                전화 문의 031-976-7706
              </PillButton>
              <PillButton
                href="https://pf.kakao.com/_eXXun"
                variant="outline"
                icon={<MessageCircle size={16} />}
                className="w-full sm:w-auto"
              >
                카카오톡 상담
              </PillButton>
            </div>
          </SectionReveal>
        </div>
      </section>

    </>
  );
}
