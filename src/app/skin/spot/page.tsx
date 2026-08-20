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
import PriceTable from "@/components/ui/PriceTable";
import {
  AlertTriangle,
  ChartBar,
  CircleDot,
  Flame,
  Grain,
  HelpCircle,
  ListCheck,
  MessageCircle,
  MoodSmile,
  Phone,
  Point,
  Scan,
} from "@/components/ui/icons";
import { SITE_URL } from "@/lib/categories";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph, faqEntities } from "@/lib/schema";
import LocalBlock from "@/components/LocalBlock";
import { LOCAL_BLOCKS, localFaqEntities } from "@/lib/local-blocks";
import { CLINIC } from "@/lib/clinic";
import { postPath } from "@/lib/slug";
import {
  SPOT_PRICE_ROWS,
  SPOT_PRICE_HEADERS,
  SPOT_PRICE_NOTE,
  SPOT_ENTRY,
  won,
  wonDigits,
} from "@/lib/pricing";

export const metadata: Metadata = pageMetadata({
  path: "/skin/spot",
  title: "일산 점빼기 | 편평사마귀·쥐젖 CO2 레이저",
  description:
    "고양시 일산한의원 잡티 제거. 점, 편평사마귀, 쥐젖을 CO2 레이저로 제거합니다. 부위별 비용 전체 공개. 이마트 풍산점 3층, 평일 20시까지.",
  routeOgImage: true,
});

const QUESTIONS = [
  {
    quote: "이거 그냥 점 맞나요?",
    answer: "확대경으로 먼저 봅니다. 의심되면 빼지 않고 의뢰드립니다",
  },
  {
    quote: "개수가 많은데 비용이 걱정돼요",
    answer: "부위 단위 정액제로 운영합니다",
  },
  {
    quote: "편평사마귀는 다시 난다던데요",
    answer: "바이러스성이라 재발할 수 있습니다. 그래서 경과를 함께 봅니다",
  },
  {
    quote: "자국이 남을까 걱정돼요",
    answer: "열 확산을 줄인 장비로 주변 조직 손상을 낮췄습니다",
  },
  {
    quote: "많이 아픈가요?",
    answer: "마취 연고를 충분히 바른 뒤 진행합니다",
  },
  {
    quote: "몇 번 와야 하나요?",
    answer: "대부분 1회, 깊은 것은 재시술이 필요할 수 있습니다",
  },
];

const TARGETS = [
  {
    icon: <Point />,
    title: "점",
    body: "색소성 병변입니다. 크기와 깊이에 따라 접근이 달라집니다.",
  },
  {
    icon: <Grain />,
    title: "편평사마귀",
    body: "이마·볼에 오톨도톨하게 번지는 바이러스성 병변입니다. 넓게 퍼진 경우 여러 번 나눠 진행합니다.",
  },
  {
    icon: <CircleDot />,
    title: "쥐젖",
    body: "목·눈가에 생기는 살색 돌기입니다. 마찰이 많은 부위에 잘 생깁니다.",
  },
];

const DEVICE = [
  {
    icon: <Flame />,
    title: "유펄스 CO2 레이저",
    body: "조사 시간이 짧아 주변 조직으로 퍼지는 열이 적습니다. 시술 후 색소침착과 흉터 가능성을 낮출 수 있습니다.",
  },
  {
    icon: <MoodSmile />,
    title: "시술 중 부담 감소",
    body: "마취 연고를 충분히 바른 뒤 진행합니다.",
  },
];

// 앵커 텍스트는 글 제목 그대로 쓴다 — 「자세히 보기」 금지.
// 경로는 postPath() 로만 만든다 (lib/slug.ts 가 인코딩의 유일한 지점).
const RELATED_POSTS: { slug: string; title: string }[] = [
  {
    slug: "잡티제거-개수와-비용",
    title: "얼굴에 여러 개인데 한 번에 다 뺄 수 있나요? 비용은요?",
  },
  {
    slug: "쥐젖-사마귀-검버섯-구분",
    title: "쥐젖, 사마귀, 검버섯 — 뭐가 다르고 어떻게 구분하나요?",
  },
];

const AFTERCARE = [
  { title: "연고 도포", body: "처방해드린 연고를 하루 2회 바릅니다." },
  {
    title: "딱지 유지",
    body: "딱지를 억지로 떼지 마세요. 자국이 남는 가장 흔한 원인입니다.",
  },
  {
    title: "자외선 차단",
    body: "딱지가 떨어진 뒤에도 2~3개월은 차단제를 발라주세요.",
  },
  {
    title: "경과 확인",
    body: "깊은 병변은 재시술이 필요할 수 있어 경과를 확인합니다.",
  },
];

const graph = buildGraph({
  path: "/skin/spot",
  name: "잡티 제거 (점·편평사마귀·쥐젖) – 일산한의원",
  description:
    "점, 편평사마귀, 쥐젖을 CO2 레이저로 제거합니다. 시술 전 확대경으로 병변을 확인합니다.",
  about: {
    "@type": "MedicalCondition",
    name: "피부 양성 병변",
    alternateName: ["점", "편평사마귀", "쥐젖"],
  },
  faq: [
    ...faqEntities(QUESTIONS.map((q) => ({ q: q.quote, a: q.answer }))),
    ...localFaqEntities("/skin/spot"),
  ],
});

export default function SkinSpotPage() {
  return (
    <>
      <JsonLd graph={graph} />
      <PageHeader
        badge="피부 · 미용"
        icon={<Scan size={15} />}
        lead="점, 빼기 전에"
        accent="한 번 보고 결정합니다"
        stacked
      />

      {/* ── 정의 + 지표 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl">
              <DefinitionCard
                title="잡티 제거란?"
                body="점, 편평사마귀, 쥐젖 등을 CO2 레이저로 제거하는 시술입니다. 겉모습이 비슷해도 성격이 다르고, 드물게 제거하면 안 되는 병변도 있어 확대경으로 먼저 확인한 뒤 진행합니다."
              />

              <div className="mt-8 text-center text-[15px] leading-relaxed text-muted">
                <p>모양이 비슷해도 원인이 다릅니다.</p>
                <p>뺄 것과 두어야 할 것을 나눠 말씀드립니다.</p>
              </div>
            </div>

            <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-4 md:grid-cols-3">
              <StatCard
                value={wonDigits(SPOT_ENTRY.upTo100)}
                unit="원"
                label={`${SPOT_ENTRY.name} 100개까지`}
              />
              <StatCard value="1" unit="회" label="대부분 당일 완료" />
              <StatCard value="확대경" label="시술 전 확인" />
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

      {/* ── 제거 대상 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<CircleDot size={15} />} label="제거 대상" />
              <div className="mt-4">
                <TwoTone as="h2" lead="이런 것을 " accent="제거합니다" />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {TARGETS.map((t) => (
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

      {/* ── 장비 ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<Flame size={15} />} label="장비" />
              <div className="mt-4">
                <TwoTone as="h2" lead="열 손상을 " accent="줄인 방식" />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-3xl gap-5 sm:grid-cols-2">
              {DEVICE.map((d) => (
                <div key={d.title} className="card p-6">
                  <IconTile icon={d.icon} />
                  <h3 className="mt-4 text-[16px] font-semibold text-ink">
                    {d.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.8] text-muted">
                    {d.body}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 비용 안내 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ChartBar size={15} />} label="비용 안내" />
              <div className="mt-4">
                <TwoTone as="h2" lead="비용을 " accent="먼저 공개합니다" />
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-2xl">
              <PriceTable
                caption="잡티 제거"
                headers={SPOT_PRICE_HEADERS}
                rows={SPOT_PRICE_ROWS.map((r) => ({
                  name: r.name,
                  price: won(r.upTo100),
                  price2: won(r.unlimited),
                }))}
                note={SPOT_PRICE_NOTE}
              />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 시술 후 관리 ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="시술 후 관리" />
              <div className="mt-4">
                <TwoTone as="h2" lead="딱지가 " accent="떨어질 때까지" />
              </div>
            </div>

            <ol className="mx-auto mt-14 max-w-2xl">
              {AFTERCARE.map((a, i) => (
                <NumberedStep
                  key={a.title}
                  index={i + 1}
                  title={a.title}
                  body={a.body}
                  last={i === AFTERCARE.length - 1}
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
                <TwoTone
                  as="h2"
                  lead="이런 경우 "
                  accent="미리 말씀해주세요"
                />
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-3xl">
              <DefinitionCard
                title="시술 전 알려주세요"
                body="켈로이드 체질이거나 상처가 잘 아물지 않는 편이면 미리 알려주세요. 편평사마귀는 바이러스성이라 제거 후에도 재발할 수 있습니다. 모양이나 색이 최근 변한 병변은 제거하지 않고 검사가 가능한 의료기관으로 안내드릴 수 있습니다."
              />
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* 질문형 글로 보낸다 — 설명을 여기 옮겨 적지 않는다.
          같은 내용을 두 곳에 두면 갈리고, 이 페이지는 진료 안내가 역할이다.
          「큰 점」 계열 검색어(네이버 101 클릭)가 이 페이지로 들어오는데
          페이지 본문에 그 말이 없다 — 아래 두 글이 그 질문에 답한다. */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl">
              <SectionBadge icon={<HelpCircle size={15} />} label="자주 묻는 것" />
              <h2 className="font-serif mt-3 text-[1.15rem] font-semibold leading-snug text-ink">
                이런 걸 많이 물어보십니다
              </h2>
              <ul className="mt-6 space-y-2.5">
                {RELATED_POSTS.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={postPath("skin", p.slug)}
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

      <LocalBlock {...LOCAL_BLOCKS["/skin/spot"]} />

      {/* ── CTA ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mb-8 text-center">
              <Link
                href="/skin"
                className="text-[14px] font-medium text-primary transition-colors duration-200 hover:text-tan"
              >
                피부 관련 연구 보기 &rarr;
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
