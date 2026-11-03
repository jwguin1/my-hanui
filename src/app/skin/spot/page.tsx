import PatientJourney from "@/components/PatientJourney";
import PatientQuestions from "@/components/PatientQuestions";
import SectionJumpNav from "@/components/SectionJumpNav";
import MobileConsultationBar from "@/components/MobileConsultationBar";
import { SKIN_JOURNEY, SPOT_RETOUCH } from "@/lib/patient-journeys";
import ConsultationActions from "@/components/ConsultationActions";
import SpotQuestionGuide from "@/components/SpotQuestionGuide";
import type { Metadata } from "next";
import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import IconTile from "@/components/ui/IconTile";
import DefinitionCard from "@/components/ui/DefinitionCard";
import NumberedStep from "@/components/ui/NumberedStep";
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
  won,
} from "@/lib/pricing";

export const metadata: Metadata = pageMetadata({
  path: "/skin/spot",
  title: "일산 점제거·점빼기 | 편평사마귀 제거·가격",
  description:
    "고양시 일산한의원 잡티 제거. 점, 편평사마귀, 쥐젖을 CO2 레이저로 제거합니다. 부위별 비용 전체 공개. 이마트 풍산점 3층, 평일 20시까지.",
  routeOgImage: true,
});

const QUESTIONS = [
  { quote: "점인지 편평사마귀인지 모르겠어요", answer: "병변 이름을 알고 오실 필요는 없습니다. 의료진이 확대경으로 모양과 분포를 살펴 제거할 부위를 정합니다. 색이나 모양이 변하는 등 추가 검사가 필요한 병변은 검사받을 의료기관으로 의뢰합니다." },
  { quote: "개수가 많으면 비용은 어떻게 정하나요?", answer: "얼굴 전체, 얼굴과 목 앞면, 얼굴과 목 앞뒤로 범위를 나누어 안내합니다. 각 범위에서 100개까지와 개수 제한 없음의 가격을 비교하고, 진찰 후 시술 범위와 비용을 확인합니다." },
  { quote: "흉터가 걱정되는데 어떻게 시술하나요?", answer: SPOT_RETOUCH.reason + " 병변의 깊이와 피부 상태에 따라 흉터나 색소 변화가 생길 수 있어, 한 번에 깊게 제거하기보다 회복을 살피며 치료합니다." },
  { quote: "남거나 다시 올라온 병변은 언제 리터치하나요?", answer: SPOT_RETOUCH.timing + " " + SPOT_RETOUCH.cost },
  { quote: "시술이 많이 아픈가요?", answer: "시술 전 마취 연고를 충분히 바른 뒤 진행합니다. 통증에 민감하거나 이전 시술이 힘드셨다면 미리 말씀해 주세요. 시술 중에도 불편한 정도를 의료진에게 알려주시면 상태를 살피며 진행합니다." },
  { quote: "집에서 관리하다 궁금한 점이 생기면요?", answer: "보호재·연고 사용과 세안 방법은 시술 부위에 맞춰 안내합니다. 회복 중 궁금한 변화가 있으면 진료시간 내 카카오톡으로 문의해 주세요. 붓기나 통증이 심해지거나 고름·발열이 생기면 진료를 받아야 합니다." },
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
        lead="점·편평사마귀·쥐젖 제거"
        accent="진찰부터 회복 관리까지"
        stacked
        description="먼저 병변을 살피고, 제거할 범위와 비용을 설명합니다. 시술 후 관리와 남은 병변의 리터치까지 미리 확인하세요."
      />
      <SectionJumpNav label="잡티 제거 안내 목차" items={[["prices", "시술 비용"], ["skin-visit", "진찰·시술 과정"], ["retouch", "리터치 안내"], ["skin-faq", "자주 묻는 질문"], ["skin-aftercare", "회복 관리"]]} />

      {/* ── 비용 안내 ── */}
      <section id="prices" className="scroll-mt-28 bg-[var(--bg)]">
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

      <PatientJourney id="skin-visit" title="제거 전 진찰부터 회복 확인까지" intro="처음 받는 시술이라면 통증과 자국, 다시 올라오는 병변이 걱정될 수 있습니다. 시술 전 설명부터 이후 관리까지 순서대로 안내합니다." steps={SKIN_JOURNEY} />

      <section id="retouch" className="section-padding scroll-mt-28 !py-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-2xl font-semibold leading-snug text-ink">남거나 다시 올라온 병변, 리터치로 이어서 봅니다</h2>
          <p className="mt-4 text-base leading-8 text-muted">{SPOT_RETOUCH.reason}</p>
          <p className="mt-3 text-base leading-8 text-muted">{SPOT_RETOUCH.timing}</p>
          <p className="mt-5 rounded-xl bg-card p-4 text-base font-semibold leading-8 text-primary">{SPOT_RETOUCH.cost}</p>
          <p className="mt-3 text-sm leading-7 text-muted">위 금액은 최초 CO₂ 시술 후 남거나 다시 올라온 병변의 리터치 기준입니다. 시술 날짜와 회복 상태를 진료에서 확인합니다.</p>
          <Link href={postPath("skin", "일산-편평사마귀-가격")} className="mt-3 inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4">편평사마귀 시술 범위와 비용 자세히 보기 →</Link>
        </div>
      </section>

      {/* ── 환자분들의 질문 ── */}
      <section id="skin-faq" className="scroll-mt-28 bg-[var(--surface)]">
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

            <PatientQuestions items={QUESTIONS} />
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

      {/* ── 시술 후 관리 ── */}
      <section id="skin-aftercare" className="scroll-mt-28 bg-[var(--surface)]">
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
                피부 진료 질문과 답 더 보기 &rarr;
              </Link>
            </div>
            <p className="mx-auto mb-5 max-w-3xl text-center text-base leading-7 text-muted">제거하고 싶은 부위와 궁금한 점을 남겨주세요. 시술 범위와 비용, 방문 일정을 안내해 드립니다.</p>
            <ConsultationActions kakaoLabel="시술 범위·비용 문의" className="mx-auto max-w-3xl" />
          </SectionReveal>
        </div>
      </section>

      <MobileConsultationBar label="시술 범위·비용 문의" />
    </>
  );
}
