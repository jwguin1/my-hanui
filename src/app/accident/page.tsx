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
import {
  AlertTriangle,
  ArrowsMove,
  HandFinger,
  Hands,
  HeadCircuit,
  HelpCircle,
  Herb,
  ListCheck,
  MessageCircle,
  Moon,
  Needle,
  Phone,
  Spine,
  Stethoscope,
  Zap,
} from "@/components/ui/icons";
import { SITE_URL } from "@/lib/categories";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph, faqEntities } from "@/lib/schema";
import LocalBlock from "@/components/LocalBlock";
import { LOCAL_BLOCKS, localFaqEntities } from "@/lib/local-blocks";
import { CLINIC } from "@/lib/clinic";
import { postPath } from "@/lib/slug";

export const metadata: Metadata = pageMetadata({
  path: "/accident",
  title: "일산 교통사고 한의원 | 자동차보험 추나·물리치료",
  description:
    "고양시 일산한의원 교통사고 후유증 치료. 자동차보험 적용으로 본인부담 없이 추나·물리치료·초음파 진단·한약 처방. 풍산역 도보 1분, 평일 20시까지.",
  routeOgImage: true,
});

/**
 * 자동차보험 서술의 기준 시점. 심사기준이 바뀌면 내용과 **함께** 갱신한다.
 * 날짜만 미루면 오래된 내용에 새 날짜를 붙이는 셈이라 더 나쁘다.
 */
const INSURANCE_AS_OF = "2026년 8월";

/**
 * 교통사고 질문형 글 — `/pain` 아래 「교통사고」 그룹.
 *
 * 교통사고 후유증은 결국 목·허리 통증이라 통증 글과 같은 컬렉션에 둔다.
 * 이 페이지는 진료 안내이고, 개별 질문에 답하는 것은 글의 몫이다.
 *
 * **본문이 준비되기 전까지 published:false 라 아직 링크하지 않는다.**
 * 원장이 본문을 쓰고 published 를 true 로 바꾸면 이 배열의 항목을 살린다.
 */
const RELATED_POSTS: Array<{ slug: string; title: string }> = [
  // { slug: "교통사고-다음날-목통증", title: "사고 당일엔 괜찮았는데 다음날부터 목이 아파요" },
  // { slug: "교통사고-엑스레이-정상", title: "엑스레이는 정상이라는데 계속 아픕니다" },
  // { slug: "교통사고-병원-한의원-병행", title: "정형외과 다니는데 한의원도 같이 가도 되나요" },
  // { slug: "교통사고-치료기간-횟수", title: "교통사고 치료, 몇 주 동안 몇 번까지 받을 수 있나요" },
];

const QUESTIONS = [
  {
    quote: "보험사에 뭐라고 해야 하나요?",
    answer: "접수번호만 알려주시면 나머지는 저희가 처리합니다",
  },
  {
    quote: "치료비가 얼마나 나오나요?",
    answer: "자동차보험 적용 시 본인부담금은 없습니다",
  },
  {
    quote: "X-ray는 정상이라던데요",
    answer: "근육·인대 손상은 초음파로 확인합니다",
  },
  {
    quote: "지금은 안 아픈데 가도 되나요?",
    answer: "2~3일 뒤부터 시작되는 경우가 많습니다",
  },
  {
    quote: "정형외과 다니는데 같이 되나요?",
    answer: "병행하실 수 있습니다",
  },
  {
    quote: "회사 때문에 시간이 안 돼요",
    answer: "평일 20시까지, 주말에도 진료합니다",
  },
];

const SYMPTOMS = [
  {
    icon: <ArrowsMove />,
    title: "목 뻣뻣함",
    body: "고개를 돌리거나 뒤로 젖힐 때 당기고 아픕니다.",
  },
  {
    icon: <Spine />,
    title: "허리 통증",
    body: "앉았다 일어설 때, 오래 앉아 있을 때 심해집니다.",
  },
  {
    icon: <HeadCircuit />,
    title: "두통·어지럼",
    body: "사고 후 머리가 무겁고 어지러운 경우가 있습니다.",
  },
  {
    icon: <HandFinger />,
    title: "손발 저림",
    body: "팔이나 다리로 저린 느낌이 뻗칠 수 있습니다.",
  },
  {
    icon: <Moon />,
    title: "잠이 안 옴",
    body: "통증과 긴장으로 잠들기 어려운 경우가 있습니다.",
  },
];

const REASONS = [
  {
    no: "01",
    title: "추나를 충분히 합니다",
    body: "틀어진 정렬을 회당 시간을 들여 교정합니다.",
  },
  {
    no: "02",
    title: "물리치료실이 따로 있습니다",
    body: "늘어난 근육을 충분히 이완할 공간과 시간을 확보했습니다.",
  },
  {
    no: "03",
    title: "초음파로 확인합니다",
    body: "영상에 나타나지 않는 근육·인대 손상을 직접 봅니다.",
  },
  {
    no: "04",
    title: "한약도 보험 적용됩니다",
    body: "자동차보험에서 한약 처방도 적용받으실 수 있습니다.",
  },
  {
    no: "05",
    title: "차 없이 오실 수 있습니다",
    body: "경의중앙선 풍산역 2번 출구 도보 1분. 이마트 주차장 무료주차 3시간도 이용하실 수 있습니다.",
  },
  {
    no: "06",
    title: "6인이 나눠 봅니다",
    body: "한 분께 진료가 몰리지 않도록 6인이 분과를 나눠 진료합니다.",
  },
];

const TREATMENTS = [
  {
    icon: <Hands />,
    title: "추나요법",
    body: "사고로 틀어진 목·허리 정렬을 손으로 교정합니다.",
  },
  {
    icon: <Zap />,
    title: "물리치료",
    body: "별도 물리치료실에서 늘어난 근육을 충분히 이완합니다.",
  },
  {
    icon: <Needle />,
    title: "침·약침",
    body: "손상 부위의 통증과 염증을 줄입니다. 필요 시 초음파로 확인 후 진행합니다.",
  },
  {
    icon: <Herb />,
    title: "한약 처방",
    body: "사고 후 어혈과 긴장을 다스리는 처방을 자동차보험으로 진행합니다.",
  },
];

const PROCESS = [
  {
    title: "보험사 접수",
    body: "가입한 보험사 또는 상대측 보험사에 사고를 접수하고 접수번호를 받으시면 됩니다.",
  },
  {
    title: "내원",
    body: "접수번호와 신분증을 가지고 오시면 됩니다. 보험사에 미리 연락하실 필요는 없습니다.",
  },
  {
    title: "진료와 확인",
    body: "어디를 어떻게 다치셨는지 확인하고, 필요하면 초음파로 손상 부위를 봅니다.",
  },
  {
    title: "치료 시작",
    body: "서류 처리는 저희가 진행합니다. 환자분은 치료에만 집중하시면 됩니다.",
  },
];

const graph = buildGraph({
  path: "/accident",
  name: "교통사고 후유증 치료 – 일산한의원",
  description:
    "자동차보험 적용으로 추나·물리치료·초음파 진단·한약 처방을 진행합니다.",
  about: {
    "@type": "MedicalCondition",
    name: "교통사고 후유증",
    alternateName: ["경추 염좌", "요추 염좌"],
  },
  faq: [
    ...faqEntities(QUESTIONS.map((q) => ({ q: q.quote, a: q.answer }))),
    ...localFaqEntities("/accident"),
  ],
});

export default function AccidentPage() {
  return (
    <>
      <JsonLd graph={graph} />
      <PageHeader
        badge="교통사고"
        icon={<Stethoscope size={15} />}
        lead="사고 직후엔 괜찮다가,"
        accent="며칠 뒤에 옵니다"
        stacked
      />

      {/* ── 정의 + 지표 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl">
              <DefinitionCard
                title="교통사고 후유증이란?"
                body="충돌 순간 목과 허리는 순간적으로 크게 흔들립니다. 뼈에 이상이 없어도 근육·인대·근막이 늘어나거나 미세하게 손상되는데, 이런 손상은 X-ray에 잘 나타나지 않습니다. 사고 당일보다 2~3일 뒤부터 증상이 시작되는 경우가 많습니다."
              />

              <div className="mt-8 text-center text-[15px] leading-relaxed text-muted">
                <p>지나가겠지 하고 두면 오래갑니다.</p>
                <p>자동차보험으로 본인부담 없이 치료받으실 수 있습니다.</p>
              </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard value="0원" label="자동차보험 적용 시 본인부담금" />
              <StatCard value="20:00" label="평일 야간진료" />
              <StatCard value="도보 1" unit="분" label="풍산역" />
            </div>

            {/* 기준일 표시 — 자동차보험 심사기준은 바뀐다.
                이 페이지의 보험 관련 서술이 언제 기준인지 밝혀 두면
                AI 가 현재성을 판단할 근거가 되고, 오래된 내용을 최신인 양
                인용하는 일을 막는다. 내용을 고칠 때 이 날짜도 함께 고칠 것. */}
            <p className="mx-auto mt-6 max-w-3xl text-center text-[12px] text-muted">
              자동차보험 적용 범위와 심사기준은 {INSURANCE_AS_OF} 기준입니다.
            </p>
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
              <SectionBadge icon={<AlertTriangle size={15} />} label="증상" />
              <div className="mt-4">
                <TwoTone as="h2" lead="이런 증상이 " accent="나타납니다" />
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

      {/* ── 치료 방식 ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="치료 방식" />
              <div className="mt-4">
                <TwoTone
                  as="h2"
                  lead="교통사고 환자분들이 "
                  accent="찾아오시는 이유"
                />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {REASONS.map((r) => (
                <div key={r.no} className="card p-6">
                  <p className="text-[13px] text-tan-soft">{r.no}</p>
                  <h3 className="mt-2 text-[16px] font-medium text-ink">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.8] text-muted">
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 치료 내용 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<Needle size={15} />} label="치료 내용" />
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

      {/* ── 접수 안내 ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="접수 안내" />
              <div className="mt-4">
                <TwoTone as="h2" lead="접수는 " accent="이렇게 하시면 됩니다" />
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

      {/* ── 확인해주세요 (안전 안내 — 삭제 금지) ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge
                icon={<AlertTriangle size={15} />}
                label="확인해주세요"
              />
              <div className="mt-4">
                <TwoTone as="h2" lead="이런 경우 " accent="먼저 말씀해주세요" />
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-3xl">
              <DefinitionCard
                title="내원 전 확인해주세요"
                body="사고 후 의식을 잃었거나, 심한 두통·구토·시야 이상이 있으시면 먼저 영상 검사가 가능한 의료기관 진료를 받으시길 권해드립니다. 임신 중이시거나 복용 중인 약이 있으면 진료 시 미리 알려주세요. 정형외과나 병원 치료와 병행하실 수 있습니다."
              />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 교통사고 질문형 글 — 본문이 준비되면 RELATED_POSTS 주석을 풀면 나온다.
          빈 배열이면 섹션 자체를 렌더링하지 않는다. */}
      {RELATED_POSTS.length > 0 && (
        <section className="bg-[var(--bg)]">
          <div className="section-padding">
            <SectionReveal>
              <div className="mx-auto max-w-3xl">
                <SectionBadge icon={<HelpCircle size={15} />} label="자주 묻는 것" />
                <h2 className="font-serif mt-3 text-[1.15rem] font-semibold leading-snug text-ink">
                  교통사고 치료, 이런 걸 물어보십니다
                </h2>
                <ul className="mt-6 space-y-2.5">
                  {RELATED_POSTS.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={postPath("pain", p.slug)}
                        className="group flex items-center justify-between gap-3 rounded-xl border border-line px-4 py-3.5 transition-colors duration-200 hover:bg-surface"
                      >
                        <span className="min-w-0 text-[0.95rem] leading-snug text-ink transition-colors duration-200 group-hover:text-primary">
                          {p.title}
                        </span>
                        <span aria-hidden="true" className="shrink-0 text-primary">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>
          </div>
        </section>
      )}

      <LocalBlock {...LOCAL_BLOCKS["/accident"]} />

      {/* ── CTA ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
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
