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
import StageCard from "@/components/ui/StageCard";
import NumberedStep from "@/components/ui/NumberedStep";
import {
  Activity,
  AlertTriangle,
  BodyScan,
  Cup,
  Flame,
  Footprint,
  HeartMonitor,
  ListCheck,
  MessageCircle,
  Needle,
  Phone,
  Stethoscope,
  Waves,
  Zap,
} from "@/components/ui/icons";
import { SITE_URL } from "@/lib/categories";
import { postPath } from "@/lib/slug";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph } from "@/lib/schema";
import LocalBlock from "@/components/LocalBlock";
import { LOCAL_BLOCKS, localFaqEntities } from "@/lib/local-blocks";
import { CLINIC } from "@/lib/clinic";

export const metadata: Metadata = pageMetadata({
  path: "/pain/acute",
  title: "일산 통증 한의원 | 담 결림·삐끗·발목 염좌 침치료",
  description:
    "고양시 일산한의원. 담 결림, 급성 요추 염좌, 발목 염좌, 근육 뭉침을 침·물리치료·부항으로 치료합니다. 이마트 풍산점 3층, 평일 20시까지.",
  routeOgImage: true,
});

/**
 * 내원 **전에** 다른 기관을 먼저 가야 하는 경우.
 *
 * 감별 가능한 것을 여기 넣지 않는다. 복사뼈 압통(Ottawa ankle rule 계열)은
 * 진료실에서 초음파로 인대 손상인지 뼈 문제인지 가려내므로 red flag 가 아니라
 * **진료 항목**이다 — SYMPTOMS 의 발목 카드 설명이 그 역할을 한다.
 *
 * 목록이 길어질수록 급한 신호가 묻힌다. 늘리지 말 것.
 * 의학적 판단이 들어가는 문안이므로 원장 승인 없이 문장을 고치지 않는다.
 */
const RED_FLAGS = [
  "발목을 접질린 뒤 네 걸음을 딛기 어렵다",
  "관절이 눈에 띄게 어긋나 보인다",
  "허리를 삐끗한 뒤 대소변 조절이 평소와 다르다",
  "열이 나거나 체중이 갑자기 줄었다",
];

/**
 * links 는 선택 필드다. 지금은 발목만 관련 글이 있다.
 *
 * 타입을 명시하지 않으면 TS 가 배열 리터럴에서 `links?: undefined` 를 끼워
 * 우연히 통과시킨다 — 발목의 links 가 사라지는 순간 렌더링부가 깨진다.
 * (pain/chronic 의 CONDITIONS 가 실제로 그렇게 깨졌다)
 */
const SYMPTOMS: Array<{
  icon: React.ReactElement;
  title: string;
  body: string;
  links?: Array<{ href: string; label: string }>;
}> = [
  {
    icon: <Activity />,
    title: "담 결림",
    body: "자고 일어났더니 목이 한쪽으로 안 돌아가시나요?",
  },
  {
    icon: <AlertTriangle />,
    title: "허리 삐끗",
    body: "무거운 걸 들다가, 혹은 재채기 한 번에 허리가 꺾이셨나요?",
  },
  {
    icon: <Footprint />,
    title: "발목 접질림",
    // 복사뼈 압통을 red flag 에서 뺀 근거를 여기 한 줄로 밝힌다 —
    // 뺀 항목이 오히려 "여기서는 확인해 준다"는 근거가 된다.
    body: "계단이나 운동 중 발목이 꺾이고 부었나요? 눌러서 아픈 위치를 초음파로 확인해 인대 손상인지 뼈 문제인지 가려냅니다.",
    // 발목만 관련 글이 3편 있다. 새 페이지를 만들지 않고 기존 글로 보낸다.
    // 경로는 반드시 postPath() 로 만든다 — lib/slug.ts 가 인코딩의 유일한 지점이고,
    // 여기서 한글을 그대로 쓰면 사이트맵·canonical 과 문자열이 갈린다.
    links: [
      { href: postPath("pain", "발목-삐었을때-초기대처"), label: "냉찜질인가 온찜질인가" },
      { href: postPath("pain", "발목염좌-오래가는이유"), label: "몇 주째 안 낫는 이유" },
      { href: postPath("pain", "발목-자꾸-접질리는이유"), label: "자꾸 접질리는 이유" },
    ],
  },
  {
    icon: <BodyScan />,
    title: "어깨·등 뭉침",
    body: "종일 앉아 일하면 날개뼈 사이가 뻐근하신가요?",
  },
];

const STAGES = [
  {
    step: 1,
    badge: "0~3일",
    title: "급성기",
    note: "붓기와 염증이 남아 있어 무리하게 풀면 오히려 악화됩니다.",
    tags: ["붓기·열감", "움직이면 통증"],
    treatment: "침 + 부항(건식) + 냉적용",
  },
  {
    step: 2,
    badge: "4~14일",
    title: "아급성기",
    note: "굳은 근육을 본격적으로 풀어주는 단계입니다.",
    tags: ["뻣뻣함", "특정 동작에서 통증"],
    treatment: "침 + 물리치료 + 수치료 + 온열",
  },
  {
    step: 3,
    badge: "3주 이상",
    title: "회복 지연",
    note: "근육 문제가 아닐 수 있습니다. 힘줄·인대 손상이 남아 있는지 확인이 필요합니다.",
    tags: ["호전 없음", "같은 자리 재발"],
    treatment: "초음파로 확인 후 재평가",
    highlight: true,
    linkHref: "/pain/chronic",
    linkLabel: "만성 통증 치료 보기",
  },
];

const TREATMENTS = [
  {
    icon: <Needle />,
    title: "침 치료",
    body: "굳은 근육과 근막의 긴장을 직접 풀어줍니다. 아픈 자리뿐 아니라 원인이 되는 부위를 함께 봅니다.",
  },
  {
    icon: <Zap />,
    title: "물리치료",
    body: "전류 자극으로 손이 닿기 어려운 심부 근육까지 이완시킵니다. 침 치료와 함께 진행합니다.",
  },
  {
    icon: <Waves />,
    title: "수치료",
    body: "물살로 넓은 부위를 고르게 풀어줍니다. 등·허리처럼 면적이 넓은 부위에 적합합니다.",
  },
  {
    icon: <Cup />,
    title: "부항",
    body: "정체된 부위의 순환을 돕습니다. 시기에 따라 건식과 습식을 나눠 적용합니다.",
  },
  {
    icon: <Flame />,
    title: "온열·뜸",
    body: "오래된 뻣뻣함과 냉감이 있는 부위에 사용합니다.",
  },
];

const REASONS = [
  {
    no: "01",
    title: "횟수를 먼저 말씀드립니다",
    body: "몇 회쯤 필요할지 첫날 안내드립니다. 끝을 모르고 다니시지 않도록.",
  },
  {
    no: "02",
    title: "반응이 없으면 확인합니다",
    body: "3~5회에 변화가 없으면 초음파로 원인을 다시 봅니다.",
  },
  {
    no: "03",
    title: "건강보험을 먼저 씁니다",
    body: "보험 범위에서 되는 치료를 먼저 권해드립니다.",
  },
  {
    no: "04",
    title: "분과가 나뉘어 있습니다",
    body: "6인 한의사가 근골격계·내과·미용을 나눠 진료합니다.",
  },
];

const PROCESS = [
  {
    title: "문진과 이학검사",
    body: "언제 어떻게 다치셨는지, 어떤 동작에서 아픈지부터 확인합니다.",
  },
  {
    title: "치료 계획 안내",
    body: "예상 횟수와 비용을 먼저 말씀드립니다.",
  },
  {
    title: "당일 치료 시작",
    body: "침·물리치료·부항을 그날 바로 진행합니다.",
  },
  {
    title: "3~5회 시점 재평가",
    body: "좋아지는 속도를 확인합니다.",
  },
  {
    title: "종결 또는 정밀 확인",
    body: "회복되면 종결하고, 그대로면 초음파로 원인을 봅니다.",
  },
];

const graph = buildGraph({
  path: "/pain/acute",
  name: "급성 통증 침·물리치료 – 일산한의원",
  description:
    "담 결림, 급성 요추 염좌, 발목 염좌, 근육 뭉침을 침·물리치료·부항으로 치료합니다.",
  about: {
    "@type": "MedicalCondition",
    name: "급성 근골격계 통증",
    alternateName: ["담 결림", "급성 요추 염좌", "발목 염좌"],
  },
  faq: localFaqEntities("/pain/acute"),
});

export default function AcutePainPage() {
  return (
    <>
      <JsonLd graph={graph} />
      <PageHeader
        badge="통증 치료"
        icon={<Stethoscope size={15} />}
        lead="담 결리고 삐끗한 통증,"
        accent="대개 몇 번이면 좋아집니다"
        stacked
      />

      {/* ── 정의 + 지표 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl">
              <DefinitionCard
                title="급성 통증이란?"
                body="자고 일어나 목이 안 돌아가거나, 무거운 걸 들다 허리가 꺾이는 통증입니다. 대부분 근육과 근막이 일시적으로 굳어 생기며, 침과 물리치료로 3~5회 안에 좋아지는 경우가 많습니다. 이 단계에서는 추나나 약침이 필요하지 않습니다."
              />

              <div className="mt-8 text-center text-[15px] leading-relaxed text-muted">
                <p>증상의 시기에 따라 치료 방법이 달라집니다.</p>
                <p>먼저 필요한 만큼만, 건강보험 범위에서 진행합니다.</p>
              </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard value="3~5" unit="회" label="평균 치료 횟수" />
              <StatCard value="당일" label="내원 즉시 시술" />
              <StatCard value="건강보험" label="우선 적용" />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── Red flag ──
          위 DefinitionCard 는 "대부분 근육과 근막이 일시적으로 굳어 생기며
          3~5회 안에 좋아진다"고 말한다. 그런데 바로 아래 증상 4개 중 하나가
          발목 접질림이다 — 인대 손상이라 저 프레임에 들어가면 안 된다.
          게다가 STAGES 의 재평가 게이트는 "3주 이상"에서 처음 작동하는데,
          골절 감별에는 너무 늦다.

          그래서 증상 목록 **앞에** 둔다. 순서가 곧 우선순위다.

          담는 기준: **내원 전에 다른 기관을 먼저 가야 하는 경우만.**
          복사뼈 압통처럼 진료실에서 초음파로 감별 가능한 것은 넣지 않는다 —
          목록이 길어지면 진짜 급한 신호가 그 안에 묻힌다. */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding !pt-0">
          <SectionReveal>
            <div className="mx-auto max-w-3xl rounded-2xl border border-primary/30 bg-surface p-6 sm:p-8">
              <h2 className="font-serif text-[1.15rem] font-semibold leading-snug text-ink">
                먼저 확인해야 할 신호
              </h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">
                다음에 해당하면 침 치료보다 다른 검사나 진료가 먼저입니다.
              </p>

              <ul className="mt-5 space-y-2.5">
                {RED_FLAGS.map((flag) => (
                  <li
                    key={flag}
                    className="flex gap-3 text-[0.95rem] leading-[1.75] text-ink"
                  >
                    <span aria-hidden="true" className="shrink-0 text-primary">
                      ·
                    </span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-6 border-t border-line pt-5 text-[0.9rem] leading-relaxed text-muted">
                이 경우 영상 검사가 가능한 의료기관을 먼저 방문하시기 바랍니다.
              </p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 증상 ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<AlertTriangle size={15} />} label="증상" />
              <div className="mt-4">
                <TwoTone as="h2" lead="이런 일로 " accent="오십니다" />
              </div>
              <p className="mt-4 text-[14px] text-muted">
                가장 많이 찾아오시는 네 가지입니다
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-2 lg:grid-cols-4">
              {SYMPTOMS.map((s) => (
                <div key={s.title} className="card flex flex-col p-6">
                  <IconTile icon={s.icon} />
                  <h3 className="mt-4 text-[16px] font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 flex-1 text-[14px] leading-[1.8] text-muted">
                    {s.body}
                  </p>
                  {s.links ? (
                    <ul className="mt-4 space-y-1.5 border-t border-line pt-4">
                      {s.links.map((l) => (
                        <li key={l.href}>
                          <Link
                            href={l.href}
                            className="text-[13px] font-medium text-primary transition-colors duration-200 hover:text-tan"
                          >
                            {l.label} &rarr;
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 경과 단계별 치료 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="치료 단계" />
              <div className="mt-4">
                <TwoTone as="h2" lead="경과 " accent="단계별 치료" />
              </div>
              <p className="mt-4 text-[14px] text-muted">
                다친 지 얼마나 됐는지에 따라 치료가 달라집니다
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 lg:grid-cols-3">
              {STAGES.map((s) => (
                <StageCard key={s.step} {...s} />
              ))}
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
              <p className="mt-4 text-[14px] text-muted">
                필요한 것만, 건강보험 범위에서 먼저
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

      {/* ── 진료 방식 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<HeartMonitor size={15} />} label="진료 방식" />
              <div className="mt-4">
                <TwoTone
                  as="h2"
                  lead="일산한의원 통증 치료가 "
                  accent="다른 이유"
                />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
              {REASONS.map((r) => (
                <div key={r.no} className="card p-7">
                  <p className="text-[13px] text-tan-soft">{r.no}</p>
                  <h3 className="mt-2 text-[16px] font-semibold text-ink">
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

      {/* ── 치료 과정 ── */}
      <section className="bg-[var(--surface)]">
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

      <LocalBlock {...LOCAL_BLOCKS["/pain/acute"]} />

      {/* ── CTA ── */}
      <section className="bg-[var(--bg)]">
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
