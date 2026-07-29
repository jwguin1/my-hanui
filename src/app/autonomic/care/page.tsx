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
  AlertTriangle,
  Ear,
  Hands,
  HeadCircuit,
  HelpCircle,
  Herb,
  ListCheck,
  MessageCircle,
  Needle,
  Phone,
  Rotate,
  Scan,
  Stethoscope,
} from "@/components/ui/icons";
import { SITE_URL } from "@/lib/categories";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  path: "/autonomic/care",
  title: "일산 이명 어지럼 두통 한의원 | 자율신경 치료 – 일산한의원",
  description:
    "고양시 일산한의원. 이명, 어지럼, 두통을 침·물리치료로 먼저 확인하고 반응에 따라 추나·약침·한약으로 접근합니다. 이마트 풍산점 3층, 평일 20시까지.",
});

const QUESTIONS = [
  {
    quote: "검사에선 아무 이상 없대요",
    answer: "구조가 아니라 조절의 문제일 수 있습니다",
  },
  {
    quote: "약 먹을 때만 잠깐 괜찮아요",
    answer: "증상을 누르기 전에 유발 원인을 먼저 봅니다",
  },
  {
    quote: "어지럼이 목 때문일 수도 있나요?",
    answer: "경추성 어지럼인지 먼저 감별합니다",
  },
  {
    quote: "이명은 못 고친다던데요",
    answer: "소리를 없애기보다 불편을 줄이는 쪽을 함께 봅니다",
  },
  {
    quote: "두통약을 계속 먹고 있어요",
    answer: "진통제를 자주 드시면 오히려 두통이 잦아질 수 있습니다",
  },
  {
    quote: "스트레스 때문이라던데요",
    answer: "방아쇠일 수는 있지만, 확인할 것은 따로 있습니다",
  },
];

const SYMPTOMS = [
  {
    icon: <Ear />,
    title: "이명",
    body: "삐- 하는 소리나 웅웅거림이 들립니다. 조용할 때와 밤에 더 크게 느껴지는 경우가 많습니다.",
  },
  {
    icon: <Rotate />,
    title: "어지럼",
    body: "빙글 도는 느낌, 붕 떠 있는 느낌, 순간적으로 아찔한 느낌으로 나뉩니다. 어떤 쪽인지에 따라 접근이 달라집니다.",
  },
  {
    icon: <HeadCircuit />,
    title: "두통",
    body: "조이는 두통, 한쪽이 욱신거리는 두통, 뒷목에서 올라오는 두통으로 나뉩니다.",
  },
];

/** 응급·선행 검사가 필요한 경우 — 축약하지 말 것 */
const RED_FLAGS = [
  {
    title: "한쪽 귀가 갑자기 안 들리면서 이명이 생겼다면",
    body: "돌발성 난청일 수 있어 이비인후과 진료를 먼저 받으셔야 합니다. 시기를 놓치면 회복이 어려워집니다.",
  },
  {
    title:
      "어지럼과 함께 말이 어눌하거나, 한쪽 팔다리에 힘이 빠지거나, 물체가 겹쳐 보인다면",
    body: "즉시 응급실로 가셔야 합니다.",
  },
  {
    title: "갑자기 시작된 극심한 두통이거나, 발열과 목 뻣뻣함이 함께 있다면",
    body: "즉시 응급실 진료가 필요합니다.",
  },
  {
    title: "두통의 양상이 최근 갑자기 달라졌다면",
    body: "영상 검사가 가능한 의료기관 진료를 권해드립니다.",
  },
];

const COMPARE_ROWS = [
  {
    label: "이명",
    left: "스트레스성·일시적 이명 → 침 · 물리치료",
    right: "오래된 이명 → 추나 · 약침 · 한약",
  },
  {
    label: "어지럼",
    left: "이석증 후유증, 전정기능 저하 → 침 치료",
    right: "반복되는 어지럼 → 추나 · 약침 · 한약",
  },
  {
    label: "두통",
    left: "긴장성 두통 → 침 · 물리치료",
    right: "후두신경통 · 편두통 → 추나 · 약침 · 한약",
  },
];

const TREATMENTS = [
  {
    icon: <Needle />,
    title: "침 · 물리치료",
    body: "목과 어깨의 긴장을 풀어 부담을 줄입니다. 먼저 진행하는 치료입니다.",
  },
  {
    icon: <Hands />,
    title: "추나요법",
    body: "상부 경추 정렬을 확인하고 교정합니다. 뒷목에서 올라오는 두통과 어지럼에서 함께 봅니다.",
  },
  {
    icon: <Scan />,
    title: "약침",
    body: "긴장이 집중된 부위에 진행합니다. 필요하면 초음파로 확인 후 진행합니다.",
  },
  {
    icon: <Herb />,
    title: "한약 처방",
    body: "수면, 소화, 긴장 상태를 함께 보고 처방합니다.",
  },
];

const PROCESS = [
  {
    title: "문진",
    body: "언제부터, 어떤 상황에서 심해지는지 확인합니다.",
  },
  {
    title: "감별",
    body: "먼저 확인이 필요한 원인이 있는지 봅니다. 필요하면 검사가 가능한 의료기관을 안내드립니다.",
  },
  {
    title: "침 · 물리치료",
    body: "3~5회 진행하며 반응을 확인합니다.",
  },
  {
    title: "재평가",
    body: "변화가 있으면 이어가고, 없으면 추나·약침·한약으로 접근을 바꿉니다.",
  },
  {
    title: "종결 또는 의뢰",
    body: "좋아지면 종결하고, 필요하면 다른 의료기관을 안내드립니다.",
  },
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "이명·어지럼·두통 치료 – 일산한의원",
    description:
      "이명, 어지럼, 두통을 침·물리치료로 먼저 확인하고 반응에 따라 추나·약침·한약으로 접근합니다.",
    url: `${SITE_URL}/autonomic/care`,
    inLanguage: "ko",
    about: {
      "@type": "MedicalCondition",
      name: "자율신경 관련 증상",
      alternateName: ["이명", "어지럼", "두통"],
    },
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

export default function AutonomicCarePage() {
  return (
    <>
      <PageHeader
        badge="자율신경"
        icon={<Stethoscope size={15} />}
        lead="검사에선 이상 없다는데,"
        accent="계속 힘드시다면"
        stacked
      />

      {/* ── 정의 + 지표 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl">
              <DefinitionCard
                title="자율신경 증상이란?"
                body="귀·머리·균형 감각에 이상이 없는데도 이명, 어지럼, 두통이 반복되는 경우가 있습니다. 목과 어깨의 긴장, 수면과 스트레스가 얽혀 있는 경우가 많아, 증상만 누르기보다 무엇이 방아쇠인지부터 확인합니다."
              />

              <div className="mt-8 text-center text-[15px] leading-relaxed text-muted">
                <p>같은 이명이라도 몇 달 된 것과 몇 년 된 것은 다릅니다.</p>
                <p>먼저 침 치료로 반응을 보고, 그다음을 정합니다.</p>
              </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard value="3" unit="가지" label="이명·어지럼·두통" />
              <StatCard value="3~5" unit="회" label="1차 반응 확인" />
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
              <SectionBadge icon={<Ear size={15} />} label="증상" />
              <div className="mt-4">
                <TwoTone as="h2" lead="이런 증상으로 " accent="오십니다" />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ── 확인해주세요 ──
          응급 상황이 섞여 들어오는 증상군이라 증상 소개 바로 다음에 둔다.
          페이지 하단으로 옮기지 말 것. */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge
                icon={<AlertTriangle size={15} />}
                label="확인해주세요"
              />
              <div className="mt-4">
                <TwoTone as="h2" lead="먼저 확인이 " accent="필요한 경우" />
              </div>
            </div>

            <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-4">
              {RED_FLAGS.map((r) => (
                <DefinitionCard key={r.title} title={r.title} body={r.body} />
              ))}
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
                  lead="같은 증상이라도 "
                  accent="치료가 다릅니다"
                />
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-4xl">
              <CompareTable
                rows={COMPARE_ROWS}
                headers={["비교적 잘 좋아지는 경우", "오래가거나 반복되는 경우"]}
              />

              <blockquote className="mt-8 border-l-[3px] border-primary bg-card p-5 text-[15px] leading-[1.8] text-ink">
                몇 회 해보고 반응을 봅니다. 좋아지면 그대로 종결하고, 변화가
                없으면 다른 접근이 필요하다는 뜻입니다.
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
