import MobileConsultationBar from "@/components/MobileConsultationBar";
import ClinicPhoto from "@/components/ClinicPhoto";
import { PainBodyLinks } from "@/components/PainSymptomFinder";
import ConsultationActions from "@/components/ConsultationActions";
import Link from "next/link";
import Hero from "@/components/Hero";
import VideoPoster from "@/components/VideoPoster";
import { VISIT_FAQS } from "@/lib/visit-guide";
import SectionReveal from "@/components/SectionReveal";
import VerifyClinicSection from "@/components/VerifyClinicSection";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import {
  Clock,
  HelpCircle,
  MapPin,
  PlayerPlay,
  Quote,
  Stethoscope,
} from "@/components/ui/icons";
import { fetchLatestVideos } from "@/lib/youtube";
import { SITE_URL } from "@/lib/categories";
import {
  CLINIC,
  CLINIC_ADDRESS_STREET,
  CLINIC_HOURS_LUNCH,
  CLINIC_HOURS_WEEKDAY,
  CLINIC_HOURS_WEEKEND,
  CLINIC_WEEKEND_HOLIDAY_LABEL,
} from "@/lib/clinic";
import { HERBAL_GUIDES, herbalPath } from "@/lib/herbal-guides";
import JsonLd from "@/components/JsonLd";
import {
  buildGraph,
  faqEntities,
  itemListNode,
} from "@/lib/schema";

// 첫 화면에는 방문 전 핵심 질문만 노출하며, 화면과 FAQ 스키마를 함께 유지한다.
const FAQS = [
  { ...VISIT_FAQS[0], q: "예약 없이 방문해도 되나요?", a: `예약 없이 당일 침·물리치료를 받으실 수 있습니다. ${CLINIC.receptionNote}` },
  { ...VISIT_FAQS[1], q: "통증치료는 얼마나 걸리나요?" },
  { ...VISIT_FAQS[3], q: "통증 초진 진료비는 얼마인가요?" },
  { ...VISIT_FAQS[4], q: "보험한약은 얼마인가요?" },
];

/**
 * 진료 실적 수치.
 *
 * 숫자만 크게 띄우면 기간도 근거도 없는 광고 문구로 읽힌다.
 * **산출 기준(개원 이래 · 원내 진료기록)은 TRUST_STATS_SOURCE 로 반드시 함께 노출한다.**
 * 수치를 고칠 때 기준도 같이 확인할 것.
 */
const TRUST_STATS = [
  { value: "13,000", unit: "명", label: "내원 환자 수 (실인원)" },
  { value: "80,000", unit: "회", label: "총 내원 횟수" },
  { value: "9,000", unit: "건+", label: "다이어트 처방 건수" },
];

/**
 * 위 수치의 산출 기준. 화면에서 TRUST_STATS 바로 아래에 함께 노출한다.
 * 기간과 근거가 붙어야 과장 광고 소지가 사라지고, AI 가 인용할 수 있는 형태가 된다.
 */
const TRUST_STATS_SOURCE = `${CLINIC.foundingYear}년 개원 이래 누적 · 원내 진료기록(EMR) 기준`;

const WHY_CARDS = [
  { photo: "ultrasound" as const, heading: "초음파로 확인", body: "필요한 부위를 살펴 통증의 원인과 치료 방향을 설명합니다.", href: "/pain/chronic", linkLabel: "통증 진료 안내" },
  { photo: "chuna" as const, heading: "6인 한의사 협진", body: "각 원장의 경력과 진료 분야를 확인하세요.", href: "/doctor", linkLabel: "의료진 소개" },
  { photo: "ict" as const, heading: "경과에 맞춘 치료", body: "통증과 움직임의 변화를 살펴 다음 치료를 정합니다.", href: "/pain/acute#visit-guide", linkLabel: "치료 과정 안내" },
];

const PHILOSOPHY = [
  { title: "증상부터 듣습니다", body: "불편한 점과 기존 검사 결과를 함께 살핍니다." },
  { title: "치료와 비용을 설명합니다", body: "필요한 치료를 이해하고 결정하실 수 있도록 안내합니다." },
  { title: "치료 후에도 함께합니다", body: "관리 방법과 다음 진료 계획을 알려드립니다." },
];

// 최신 발행일 대신 첫 방문자의 관심 분야를 기준으로 선택한다.
// 화면과 ItemList는 같은 배열을 사용한다. 실제 질문 빈도 순위를 의미하지 않는다.
const digestiveGuide = HERBAL_GUIDES.find(g => g.slug === "dyspepsia")!;
const tonicGuide = HERBAL_GUIDES.find(g => g.slug === "constitution")!;
const RECOMMENDED_READINGS = [
  { category: "통증치료", title: "허리는 안 아픈데 다리만 저려요, 디스크일까요?", href: "/pain/다리만-저릴때-허리디스크" },
  { category: "교통사고", title: "교통사고 후 병원과 한의원을 같이 다녀도 되나요?", href: "/pain/교통사고-병원-한의원-병행" },
  { category: "보험한약", title: digestiveGuide.question, href: herbalPath(digestiveGuide) },
  { category: "체질보약", title: tonicGuide.question, href: herbalPath(tonicGuide) },
  { category: "일산감비환", title: "일산감비환, 얼마나 먹어야 하고 비용은 어느 정도인가요?", href: "/diet/다이어트한약-기간과-비용" },
  { category: "피부 · 미용", title: "피코토닝과 제네시스는 어떻게 다른가요?", href: "/skin/피코토닝-제네시스-차이" },
];

// Hero의 8개 진료 바로가기와 대응하는 ItemList 정보.
// 상세 진료 안내로 직접 연결하고, 전체 글 목록은 하단과 푸터에서 안내한다.
const TREATMENT_LINKS = [
  { href: "/pain", heading: "통증치료", ogImage: "/images/cards/pain-acute.png" },
  { href: "/accident", heading: "교통사고", ogImage: "/images/cards/accident.png" },
  { href: "/herbal/insurance", heading: "보험한약", ogImage: "/herbal/insurance/opengraph-image" },
  { href: "/herbal/tonic", heading: "체질보약", ogImage: "/herbal/tonic/opengraph-image" },
  { href: "/diet/program", heading: "일산감비환", ogImage: "/images/cards/diet-program.png" },
  { href: "/skin/spot", heading: "잡티제거", ogImage: "/images/cards/skin-spot.png" },
  { href: "/home-visit", heading: "방문진료", ogImage: "/home-visit/opengraph-image" },
  { href: "/herbs", heading: "오늘의 한약", ogImage: "/herbal/tonic/opengraph-image" },
] as const;

// 네이버 사이트 컬렉션(카드 슬라이드) 노출용 — 화면 카드와 1:1 대응
const treatmentListNode = itemListNode(
  "/",
  "treatment-list",
  "일산한의원 진료 안내",
  TREATMENT_LINKS.map((card) => ({
    url: `${SITE_URL}${card.href}`,
    name: card.heading,
    image: `${SITE_URL}${card.ogImage}`,
  }))
);

export default async function Home() {
  const videos = await fetchLatestVideos(2);

  const graph = buildGraph({
    path: "/",
    name: "일산한의원 | 이마트풍산점 – 고양시 일산 한의원",
    description:
      "일산한의원. 이마트풍산점 3층. 침, 한약, 초음파진단, 피부레이저, 추나, 약침, 경의중앙선 풍산역 2번출구. 031-976-7706.",
    image: "/og-image.jpg",
    faq: faqEntities(FAQS),
    nodes: [
      treatmentListNode,
      itemListNode("/", "patient-readings", "진료별 환자 질문 안내", RECOMMENDED_READINGS.map(item => ({ url: `${SITE_URL}${item.href}`, name: item.title }))),
    ],
  });

  return (
    <div className="home-content">
      <JsonLd graph={graph} />
      {/* ── Hero ── */}
      <Hero />

      <VerifyClinicSection />

      {/* ── 첫 방문 과정과 진료철학 ── */}
      <section id="philosophy" className="scroll-mt-24 bg-[var(--bg)]">
        <div id="visit-process" className="section-padding scroll-mt-24 !py-10 md:!py-16">
          <SectionReveal>
            <div className="text-center">
              <SectionBadge icon={<Quote size={15} />} label="진료철학" />
              <div className="mt-4"><TwoTone as="h2" lead="처음부터 끝까지, " accent="함께" /></div>
            </div>
            <ol className="mx-auto mt-7 grid max-w-5xl gap-3 md:grid-cols-3 md:gap-5">
              {PHILOSOPHY.map((item, index) => <li key={item.title} className="flex gap-4 rounded-2xl border border-line bg-white p-5 md:block md:p-6">
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-sm font-bold text-primary">0{index + 1}</span>
                <div className="min-w-0 md:mt-4">
                  <h3 className="text-base font-semibold text-ink md:text-lg">{item.title}</h3>
                  <p className="mt-2 text-base leading-7 text-muted">{item.body}</p>
                </div>
              </li>)}
            </ol>
            <div className="mt-5 text-center"><Link href="/about" className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4">일산한의원 소개 →</Link></div>
          </SectionReveal>
        </div>
      </section>

      {/* ── Differentiation ── */}
      <section id="care-approach" className="scroll-mt-24 bg-[var(--surface)]">
        <div className="section-padding !py-10 md:!py-16">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<Stethoscope size={15} />} label="진료 방식" />
              <div className="mt-4">
                <TwoTone as="h2" lead="눈으로 확인하는 " accent="진료" />
              </div>
            </div>

            <div className="mx-auto mt-7 grid max-w-5xl gap-4 md:grid-cols-3">
              {WHY_CARDS.map((card) => (
                <div key={card.href} className="card grid grid-cols-[30%_1fr] overflow-hidden md:block">
                  <div className="[&>figure]:h-full [&>figure]:rounded-none [&>figure]:border-0 [&_img]:h-full [&_img]:object-cover md:[&_img]:h-auto"><ClinicPhoto photo={card.photo} caption={false} /></div>
                  <div className="min-w-0 p-4 md:p-6">
                    <h3 className="text-base font-semibold text-ink md:text-lg">{card.heading}</h3>
                    <p className="mt-2 text-base leading-7 text-muted">{card.body}</p>
                    <Link href={card.href} className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-primary underline underline-offset-4">{card.linkLabel} →</Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-10 max-w-5xl border-t border-line pt-8">
              <h3 className="text-center text-lg font-semibold text-ink">일산한의원이 쌓아온 진료 경험</h3>
              <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
                {TRUST_STATS.map(stat => <div key={stat.label}>
                  <dt className="text-xs leading-relaxed text-muted sm:text-sm">{stat.label}</dt>
                  <dd className="mt-2 text-lg font-semibold text-ink sm:text-2xl">{stat.value}<span className="ml-0.5 text-xs font-medium sm:ml-1 sm:text-base">{stat.unit}</span></dd>
                </div>)}
              </dl>
              <p className="mt-5 text-center text-[12px] text-muted">{TRUST_STATS_SOURCE}</p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="first-visit" className="scroll-mt-24 bg-[var(--surface)]">
        <div className="section-padding !py-10 md:!py-16">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionBadge icon={<HelpCircle size={15} />} label="처음 방문하시는 분께" />
            <div className="mt-4">
              <TwoTone as="h2" lead="시간과 비용, " accent="미리 확인하세요" />
            </div>
            <Link href="/pricing" className="mt-5 inline-block font-semibold text-primary underline underline-offset-4">진료비·소요 시간 보기 →</Link>
          </div>

          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="card group p-5 transition-colors open:border-primary/40"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                  <h3 className="text-base font-semibold leading-relaxed text-ink group-open:text-primary">
                    Q. {faq.q}
                  </h3>
                  <span className="shrink-0 text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-base leading-7 text-muted">
                  {faq.a}
                </p>
                <Link href={faq.href} className="mt-3 inline-block text-[15px] font-medium text-primary underline underline-offset-4">{faq.linkLabel}</Link>
              </details>
            ))}
          </div>
        </SectionReveal>
        </div>
      </section>

      {/* ── 진료별 추천 질문 ── */}
      <section id="patient-readings" className="scroll-mt-24 bg-[var(--bg)]">
        <div className="section-padding !py-10 md:!py-16">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<HelpCircle size={15} />} label="증상별 질문과 답" />
              <div className="mt-4"><TwoTone as="h2" lead="궁금한 점, " accent="짧게 살펴보세요" /></div>
            </div>
            <div className="mt-7 rounded-2xl bg-surface p-5"><h3 className="mb-3 text-lg font-semibold text-ink">아픈 부위로 찾기</h3><PainBodyLinks /></div>
            <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {RECOMMENDED_READINGS.map(item => <Link key={item.href} href={item.href} className="card group relative flex flex-col py-4 pl-5 pr-11 md:p-6">
                <p className="text-sm font-semibold text-primary">{item.category}</p>
                <h3 className="mt-1 text-base font-semibold leading-relaxed text-ink group-hover:text-primary">{item.title}</h3>
                <span aria-hidden="true" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary md:static md:mt-3 md:translate-y-0">→</span>
              </Link>)}
            </div>
            <div className="mt-8 text-center"><Link href="/blog" className="btn-ghost">질문과 글 전체 보기 →</Link></div>
          </SectionReveal>
        </div>
      </section>

      {/* ── YouTube ── */}
      <section id="clinic-videos" className="border-t border-line bg-[var(--bg)]">
        <div className="section-padding !pt-10">
        <SectionReveal>
          <div className="text-center">
            <SectionBadge icon={<PlayerPlay size={15} />} label="영상" />
            <div className="mt-4">
              <TwoTone as="h2" lead="진료실 " accent="이야기" />
            </div>
          </div>

          <div className="mx-auto mt-7 grid max-w-4xl gap-4 sm:grid-cols-2">
            {videos.map((v) => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card group grid grid-cols-[35%_1fr] items-center overflow-hidden sm:block"
              >
                <div className="relative aspect-video">
                  <VideoPoster id={v.id} />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold leading-relaxed text-ink group-hover:text-primary">
                    {v.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 text-center"><Link href="/media" className="btn-ghost">의료진 영상 더보기 →</Link></div>
        </SectionReveal>
        </div>
      </section>

      {/* ── Hours & Contact Summary ── */}
      <section id="visit-info" className="scroll-mt-24 bg-[var(--surface)]">
        <div className="section-padding !py-10 md:!py-16">
          <SectionReveal>
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <div className="text-center">
                  <SectionBadge icon={<Clock size={15} />} label="진료시간" />
                  <div className="mt-4">
                    <TwoTone as="h2" lead="진료 " accent="시간" />
                  </div>
                </div>
                <ul className="mt-6 space-y-3 text-base">
                  <li className="flex justify-between border-b border-line pb-3">
                    <span className="text-ink">월 – 금</span>
                    <span className="text-ink">{CLINIC_HOURS_WEEKDAY}</span>
                  </li>
                  <li className="flex justify-between border-b border-line pb-3">
                    <span className="text-ink">
                      {CLINIC_WEEKEND_HOLIDAY_LABEL}
                    </span>
                    <span className="text-ink">{CLINIC_HOURS_WEEKEND}</span>
                  </li>
                  <li className="flex justify-between border-b border-line pb-3">
                    <span className="text-muted">점심시간 (평일)</span>
                    <span className="text-muted">{CLINIC_HOURS_LUNCH}</span>
                  </li>
                </ul>
                <p className="mt-4 text-[0.82rem] text-primary">
                  주말·공휴일은 점심시간 없이 진료합니다
                </p>
                {/* 명절 휴진 — 「토·일·공휴일 16:00까지」만으로는 드러나지 않는다.
                    문안은 clinic.ts 가 정본이다. */}
                <p className="mt-1 text-[0.82rem] text-primary">{CLINIC.holidayClosedNote}</p>
                <p className="mt-1 text-[0.82rem] text-muted">
                  {CLINIC.closedNote}
                </p>
                <p className="mt-3 text-sm font-medium text-ink">{CLINIC.receptionNote}</p>
              </div>

              <div>
                <div className="text-center">
                  <SectionBadge icon={<MapPin size={15} />} label="오시는 길" />
                  <div className="mt-4">
                    <TwoTone as="h2" lead="이마트 풍산점 " accent="3층입니다" />
                  </div>
                </div>
                <div className="mt-8 space-y-5">
                  {/* NAP 는 lib/clinic.ts 가 정본 (네이버 플레이스 등록 정보 기준) */}
                  <div>
                    <p className="text-[0.8rem] text-primary">주소</p>
                    <p className="mt-1 text-ink">{CLINIC_ADDRESS_STREET}</p>
                    <p className="text-ink">{CLINIC.building}</p>
                  </div>
                  <div>
                    <p className="text-[0.8rem] text-primary">상담 · 예약</p>
                    <p className="mt-2 text-base text-muted">진료시간 내 의료진이 답변드립니다.</p>
                    <ConsultationActions className="mt-3 !justify-start" />
                  </div>
                  <div>
                    <p className="text-[0.8rem] text-primary">교통</p>
                    <p className="mt-1 text-[0.9rem] text-ink">
                      {CLINIC.transit}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.8rem] text-primary">주차</p>
                    <p className="mt-1 text-[0.9rem] text-muted">
                      {CLINIC.parkingDetail}
                    </p>
                  </div>
                </div>
                <Link href="/contact" className="btn-primary mt-8 inline-block">
                  오시는 길·주차 안내 →
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
      <MobileConsultationBar />
    </div>
  );
}
