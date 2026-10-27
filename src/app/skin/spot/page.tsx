import ConsultationActions from "@/components/ConsultationActions";
import SpotQuestionGuide from "@/components/SpotQuestionGuide";
import type { Metadata } from "next";
import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import IconTile from "@/components/ui/IconTile";
import StatCard from "@/components/ui/StatCard";
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
  MoodSmile,
  Point,
  Scan,
} from "@/components/ui/icons";
import { SITE_URL } from "@/lib/categories";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph, faqEntities } from "@/lib/schema";
import LocalBlock from "@/components/LocalBlock";
import { LOCAL_BLOCKS, localFaqEntities } from "@/lib/local-blocks";
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
  title: "일산 점제거·점빼기 | 편평사마귀 제거·가격",
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
    answer: "병변 깊이와 피부 상태에 따라 흉터·색소 변화가 생길 수 있어 회복 계획을 함께 안내합니다",
  },
  {
    quote: "많이 아픈가요?",
    answer: "마취 연고를 충분히 바른 뒤 진행합니다",
  },
  {
    quote: "몇 번 와야 하나요?",
    answer: "진단과 병변의 깊이·범위에 따라 달라지며, 나누어 시술하거나 재시술이 필요할 수 있습니다",
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
        lead="잡티 빼기 전에"
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
              <StatCard value="관리" label="시술 후 보호재·세안 안내" />
              <StatCard value="확대경" label="시술 전 확인" />
            </div>
          </SectionReveal>
        </div>
      </section>

      <section aria-labelledby="other-skin-title" className="border-y border-line bg-[var(--surface)] px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <h2 id="other-skin-title" className="font-serif text-2xl font-semibold text-ink">색소·탄력·얼굴 제모도 함께 살펴보세요</h2>
          <p className="mt-3 text-[16px] leading-relaxed text-muted">점·편평사마귀·쥐젖은 CO₂ 제거 안내를 계속 읽어보세요. 색소·탄력·제모가 고민이라면 아래 진료에서 자세히 확인하실 수 있습니다.</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Link href="/skin/pigmentation" className="rounded-xl border border-line bg-card p-5 hover:border-primary"><h3 className="text-lg font-semibold text-ink">색소치료 →</h3><p className="mt-2 text-[15px] leading-relaxed text-muted">기미·주근깨·흑자·피부톤<br />피코토닝·제네시스 질문과 비용</p></Link>
            <Link href="/skin/hair-removal" className="rounded-xl border border-line bg-card p-5 hover:border-primary"><h3 className="text-lg font-semibold text-ink">얼굴 제모 →</h3><p className="mt-2 text-[15px] leading-relaxed text-muted">남녀 공통 · 엘리멘트 TL<br />인중＋앞턱·얼굴전체 가격과 관리</p></Link>
            <Link href="/skin/lifting" className="rounded-xl border border-line bg-card p-5 hover:border-primary"><h3 className="text-lg font-semibold text-ink">리프팅 →</h3><p className="mt-2 text-[15px] leading-relaxed text-muted">턱선·볼 처짐·탄력<br />슈링크·볼뉴머 질문과 비용</p></Link>
          </div>
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

      <section className="section-padding !pb-0">
        <div className="mx-auto max-w-3xl rounded-xl border border-line bg-surface p-6">
          <h2 className="text-xl font-semibold text-ink">눈가·볼의 비립종도 상담합니다</h2>
          <p className="mt-3 leading-7 text-muted">일산한의원은 비립종 제거를 시행합니다. 하얀 알갱이를 여드름·편평사마귀 등과 구분하고, 위치와 개수에 맞춰 제거 범위·비용·회복 관리를 안내합니다.</p>
          <Link href="/skin/일산-비립종-제거-압출" className="mt-4 inline-block py-2 font-semibold text-primary underline underline-offset-4">비립종 제거·압출 질문과 답 →</Link>
        </div>
      </section>
      <SpotQuestionGuide />
      <LocalBlock {...LOCAL_BLOCKS["/skin/spot"]} />

      <section className="section-padding">
        <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <SectionBadge label="색소치료" />
          <h2 className="mt-3 text-xl font-semibold text-ink">기미·주근깨·흑자가 고민이라면</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">평평한 갈색 반점과 피부톤은 피코토닝·제네시스 색소치료 안내에서 확인하세요. 치료 차이와 비용, 시술 후 관리에 관한 질문을 모았습니다.</p>
          <ul className="mt-5 space-y-3 text-sm font-medium text-primary">
            <li><Link href="/skin/pigmentation" className="underline underline-offset-4">색소치료 · 피코토닝·제네시스 안내 →</Link></li>
            <li><Link href={postPath("skin", "기미-주근깨-흑자-차이")} className="underline underline-offset-4">기미·주근깨·흑자, 어떻게 구분하나요? →</Link></li>
          </ul>
        </div>
      </section>

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
            <ConsultationActions className="mx-auto max-w-3xl" />
          </SectionReveal>
        </div>
      </section>

    </>
  );
}
