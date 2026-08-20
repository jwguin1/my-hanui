import type { Metadata } from "next";
import Link from "next/link";
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
import PriceTable from "@/components/ui/PriceTable";
import {
  ArrowsUp,
  CircleDot,
  Decompress,
  HandFinger,
  Hands,
  HelpCircle,
  ListCheck,
  MessageCircle,
  Needle,
  Phone,
  Scan,
  Spine,
  Stairs,
  Stethoscope,
  Walk,
  Zap,
} from "@/components/ui/icons";
import { SITE_URL } from "@/lib/categories";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph, faqEntities } from "@/lib/schema";
import LocalBlock from "@/components/LocalBlock";
import { LOCAL_BLOCKS, localFaqEntities } from "@/lib/local-blocks";
import { CLINIC } from "@/lib/clinic";

export const metadata: Metadata = pageMetadata({
  path: "/pain/chronic",
  title: "일산 추나·초음파약침 | 오십견·디스크·협착증",
  description:
    "고양시 일산한의원. 석회성건염, 오십견, 무릎관절염, 디스크, 척추관협착증을 초음파 진단 후 추나요법·초음파약침으로 치료합니다. 비용 전 항목 공개. 이마트 풍산점 3층.",
  routeOgImage: true,
});

const QUESTIONS = [
  {
    quote: "주사 맞으면 그때뿐이에요",
    answer: "초음파로 문제 부위를 찾아 그 자리에 직접 놓습니다",
  },
  {
    quote: "MRI는 정상이라는데 계속 아파요",
    // 「MRI 가 못 보는 걸 초음파가 본다」는 구도를 쓰지 않는다 —
    // 사실이 아니고, 검증되지 않는 우위 주장이라 AI 도 인용에서 걸러낸다.
    // 초음파의 고유 강점은 해상도가 아니라 **움직이면서 본다는 것**이다.
    answer:
      "엑스레이나 MRI 결과와 실제 증상이 맞지 않는 경우가 있습니다. 이럴 때는 이학적 검사를 먼저 하고, 필요한 경우 초음파로 힘줄·인대처럼 움직일 때 상태가 달라지는 조직을 직접 보면서 확인합니다.",
  },
  {
    quote: "수술해야 한다고 들었어요",
    answer: "수술 전에 해볼 단계가 남았는지 먼저 확인합니다",
  },
  {
    quote: "추나가 뭔지 잘 모르겠어요",
    answer: "건강보험이 적용되는 치료입니다. 연 20회까지 가능합니다",
  },
  {
    quote: "비용이 얼마나 나올지 몰라 걱정돼요",
    answer: "회당 비용을 이 페이지에 전부 공개해 두었습니다",
  },
  {
    quote: "나이 때문이라던데요",
    answer: "나이와 별개로 좋아질 부분이 있는지 확인합니다",
  },
];

/**
 * href/linkLabel 은 선택 필드다.
 *
 * 지금은 링크가 걸린 항목이 하나도 없다 — 유일하게 있던
 * 「석회성 건염 → 관련 연구 보기」가 심사 중인 글을 가리켜 제거했다.
 * 타입을 명시하지 않으면 TS 가 두 필드를 없는 것으로 추론해서
 * 아래 렌더링부(c.href)가 깨진다. 재공개 시 값만 되돌리면 되도록 남긴다.
 */
const CONDITIONS: Array<{
  icon: React.ReactElement;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
}> = [
  {
    icon: <CircleDot />,
    title: "석회성 건염",
    body: "어깨 힘줄에 석회가 쌓여 갑자기 심한 통증이 생깁니다. 초음파로 위치와 크기를 확인합니다.",
    // 「관련 연구 보기」 → /pain/20260726-post-1 링크를 뺐다.
    // 그 글은 심사 중(status: under_review)이라 목록·사이트맵에서 빠져 있다.
    // URL 자체는 200 이지만, 도달 경로가 없는 글로 안내하지 않는다.
    // 심사 후 재공개되면 이 두 줄을 되돌리면 된다.
  },
  {
    icon: <ArrowsUp />,
    title: "오십견",
    body: "어깨가 굳어 팔이 올라가지 않습니다. 어느 방향이 얼마나 제한됐는지부터 봅니다.",
  },
  {
    icon: <Walk />,
    title: "무릎 관절염",
    body: "계단을 내려올 때 특히 아프신가요? 물이 찼는지, 주변 구조는 어떤지 확인합니다.",
  },
  {
    icon: <Spine />,
    title: "목·허리 디스크",
    body: "팔다리로 뻗치는 통증이 있다면 신경이 눌리는 위치를 확인해야 합니다.",
  },
  {
    icon: <Stairs />,
    title: "척추관 협착증",
    body: "조금 걸으면 다리가 저려 쉬었다 가야 하시나요?",
  },
  {
    icon: <HandFinger />,
    title: "손발 저림",
    body: "눌리는 지점이 목인지 팔꿈치인지 손목인지 나눠서 확인합니다.",
  },
];

const COMPARE_ROWS = [
  {
    label: "원인",
    left: "근육·근막의 일시적 긴장",
    right: "힘줄·인대·관절·신경",
  },
  { label: "확인", left: "문진과 이학검사", right: "초음파로 직접 확인" },
  { label: "치료", left: "침 · 물리치료 · 부항", right: "추나 · 초음파 약침" },
  { label: "횟수", left: "3~5회", right: "상태에 따라 안내" },
];

const TREATMENTS = [
  {
    icon: <Hands />,
    title: "추나요법",
    body: "굳은 관절과 틀어진 정렬을 손으로 직접 교정합니다. 건강보험이 적용되며 연 20회까지 가능합니다.",
  },
  {
    icon: <Scan />,
    title: "초음파 약침",
    body: "초음파 화면을 보면서 문제 부위에 정확히 주입합니다. 감으로 놓지 않습니다.",
  },
  {
    icon: <Zap />,
    title: "체외충격파",
    body: "석회나 오래된 힘줄 병변의 회복을 돕습니다.",
  },
  {
    icon: <Decompress />,
    title: "무중력 감압치료",
    body: "척추 사이 압력을 낮춰 신경 눌림을 줄입니다.",
  },
];

const PROCESS = [
  { title: "초음파 검사", body: "아픈 부위를 화면으로 함께 봅니다." },
  {
    title: "원인 설명과 계획 안내",
    body: "무엇이 문제인지, 몇 회가 필요한지, 비용은 얼마인지 먼저 말씀드립니다.",
  },
  { title: "추나·약침 시작", body: "상태에 맞는 조합으로 진행합니다." },
  { title: "4~6회 시점 재평가", body: "초음파로 다시 확인합니다." },
  {
    title: "종결 또는 상급 의뢰",
    body: "변화가 없으면 영상 검사나 수술 상담을 권해드립니다.",
  },
];

const graph = buildGraph({
  path: "/pain/chronic",
  name: "만성 통증 추나·초음파 약침 – 일산한의원",
  description:
    "석회성건염, 오십견, 무릎관절염, 디스크, 척추관협착증을 초음파 진단 후 추나요법·초음파약침으로 치료합니다.",
  about: {
    "@type": "MedicalCondition",
    name: "만성 근골격계 통증",
    alternateName: ["석회성 건염", "오십견", "척추관 협착증"],
  },
  faq: [
    ...faqEntities(QUESTIONS.map((q) => ({ q: q.quote, a: q.answer }))),
    ...localFaqEntities("/pain/chronic"),
  ],
});

export default function ChronicPainPage() {
  return (
    <>
      <JsonLd graph={graph} />
      <PageHeader
        badge="통증 치료"
        icon={<Stethoscope size={15} />}
        lead="3주가 지나도 그대로라면,"
        accent="다른 곳을 봐야 합니다"
        stacked
      />

      {/* ── 정의 + 지표 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl">
              <DefinitionCard
                title="만성 통증이란?"
                body="침과 물리치료를 3~5회 받아도 변화가 없거나, 좋아졌다가 같은 자리가 반복해서 아픈 경우입니다. 이때는 근육이 아니라 힘줄·인대·관절·신경에 원인이 남아 있는 경우가 많습니다. 눈으로 보이지 않으니 초음파로 확인한 뒤 치료 방향을 정합니다."
              />

              <div className="mt-8 text-center text-[15px] leading-relaxed text-muted">
                <p>원인을 확인하지 않으면 같은 치료를 반복하게 됩니다.</p>
                <p>초음파로 먼저 보고, 필요한 치료를 정합니다.</p>
              </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard value="초음파" label="원인 확인" />
              <StatCard value="연 20" unit="회" label="추나 건강보험 적용" />
              <StatCard value="RMSK" label="근골격 초음파 자격" />
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
              <p className="mt-4 text-[14px] text-muted">
                진료실에서 실제로 듣는 질문들입니다
              </p>
            </div>

            <div className="mx-auto mt-14 flex max-w-4xl flex-col gap-2.5">
              {QUESTIONS.map((q) => (
                <QARow key={q.quote} quote={q.quote} answer={q.answer} />
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 주요 질환 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<Spine size={15} />} label="주요 질환" />
              <div className="mt-4">
                <TwoTone as="h2" lead="이런 " accent="경우입니다" />
              </div>
              <p className="mt-4 text-[14px] text-muted">
                만성으로 넘어간 통증에서 자주 확인되는 원인입니다
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CONDITIONS.map((c) => (
                <div key={c.title} className="card flex flex-col p-6">
                  <IconTile icon={c.icon} />
                  <h3 className="mt-4 text-[16px] font-semibold text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[14px] leading-[1.8] text-muted">
                    {c.body}
                  </p>
                  {c.href ? (
                    <Link
                      href={c.href}
                      className="mt-4 inline-flex text-[13px] font-medium text-primary transition-colors duration-200 hover:text-tan"
                    >
                      {c.linkLabel} &rarr;
                    </Link>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 치료 기준 ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="치료 기준" />
              <div className="mt-4">
                <TwoTone as="h2" lead="같은 통증이라도 " accent="치료가 다릅니다" />
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-3xl">
              <CompareTable rows={COMPARE_ROWS} />

              <blockquote className="mt-8 border-l-[3px] border-primary bg-surface p-5 text-[15px] leading-[1.8] text-ink">
                급성기 치료를 반복해도 변화가 없다면, 치료가 부족한 게 아니라
                원인이 다른 곳에 있다는 뜻입니다.
              </blockquote>

              <div className="mt-6 text-center">
                <Link
                  href="/pain/acute"
                  className="text-[14px] font-medium text-primary transition-colors duration-200 hover:text-tan"
                >
                  급성 통증 치료 보기 &rarr;
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 치료 방법 ── */}
      <section className="bg-[var(--bg)]">
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

      {/* ── 비용 안내 ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="비용 안내" />
              <div className="mt-4">
                <TwoTone as="h2" lead="비용을 " accent="먼저 공개합니다" />
              </div>
              <p className="mt-4 text-[14px] text-muted">
                상담 후에 알려드리지 않습니다
              </p>
            </div>

            <div className="mx-auto mt-14 flex max-w-2xl flex-col gap-8">
              <PriceTable
                caption="추나 프로그램"
                rows={[
                  {
                    name: "단순추나",
                    includes: "추나요법 + 체외충격파",
                    price: "본인부담금 3만원대",
                  },
                  {
                    name: "복잡추나",
                    includes: "추나요법 + 체외충격파 + 무중력 감압치료",
                    price: "본인부담금 5만원대",
                  },
                ]}
                note="추나요법은 건강보험 적용 항목으로, 본인부담금은 환자분의 자격과 적용 기준에 따라 달라집니다. 추나는 연 20회까지 보험이 적용되며, 정확한 금액은 내원 시 안내드립니다."
              />

              <PriceTable
                caption="초음파 약침"
                rows={[
                  { name: "일반 초음파 약침", price: "30,000원" },
                  { name: "PDRN 초음파 약침", price: "60,000원" },
                ]}
                note="비급여 항목입니다. 상태에 따라 필요한 것만 권해드리며, 초음파 약침 없이 추나만 진행하는 경우도 많습니다."
              />
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

      <LocalBlock {...LOCAL_BLOCKS["/pain/chronic"]} />

      {/* ── CTA ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mb-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
              <Link
                href="/pain"
                className="text-[14px] font-medium text-primary transition-colors duration-200 hover:text-tan"
              >
                통증 관련 연구 보기 &rarr;
              </Link>
              <Link
                href="/accident"
                className="text-[14px] font-medium text-primary transition-colors duration-200 hover:text-tan"
              >
                교통사고로 오셨나요? &rarr;
              </Link>
            </div>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <PillButton
                href={CLINIC.telHref}
                variant="solid"
                icon={<Phone size={16} />}
                className="w-full sm:w-auto"
              >
                전화 문의 {CLINIC.tel}
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
