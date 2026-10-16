import ConsultationActions from "@/components/ConsultationActions";
import Link from "next/link";
import Hero from "@/components/Hero";
import { VISIT_FAQS as FAQS } from "@/lib/visit-guide";
import SectionReveal from "@/components/SectionReveal";
import VerifyClinicSection from "@/components/VerifyClinicSection";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import {
  Clock,
  HelpCircle,
  ListCheck,
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
import { CARE_GUIDE } from "@/lib/care-guide";
import JsonLd from "@/components/JsonLd";
import {
  buildGraph,
  faqEntities,
  itemListNode,
} from "@/lib/schema";

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
  { badge: "직접 확인", heading: "아픈 부위를 확인합니다", body: "근골격계 초음파로 필요한 부위를 살펴 진찰 결과와 함께 설명합니다. 다른 병원의 검사 결과도 현재 증상과 함께 확인합니다.", href: "/pain/chronic", linkLabel: "통증 진료 방식 보기" },
  { badge: "6인 의료진", heading: "진료하는 의료진을 확인하세요", body: "6인의 한의사가 근골격계·내과·미용 진료를 나누어 담당합니다. 의료진 소개에서 각 원장의 경력과 진료 분야를 살펴보실 수 있습니다.", href: "/doctor", linkLabel: "의료진 소개 보기" },
  { badge: "경과 확인", heading: "치료 후 변화를 다시 봅니다", body: "근육성 통증은 3회, 만성 통증은 5회 치료 후 경과를 다시 평가합니다. 통증과 움직임이 어떻게 달라졌는지 확인해 다음 치료를 상담합니다.", href: "/pain/acute#visit-guide", linkLabel: "치료 과정과 재평가 안내" },
];

const PHILOSOPHY = [
  { quote: "필요한 치료와 그 이유를 설명합니다.", body: "가장 불편한 증상을 듣고 진찰과 검사 결과를 함께 살펴봅니다. 어떤 치료가 필요한지, 지켜봐도 되는 부분은 무엇인지 말씀드립니다." },
  { quote: "치료 과정과 비용을 먼저 안내합니다.", body: "건강보험 적용 여부와 추가 치료의 비용을 확인하고, 받으실 치료를 이해한 뒤 결정하실 수 있도록 안내합니다." },
  { quote: "치료 후 변화를 확인하고 다음 계획을 정합니다.", body: "처음 불편했던 증상이 얼마나 달라졌는지 확인합니다. 치료 중 궁금한 점은 진료시간 내 카카오톡으로 의료진에게 물어보실 수 있습니다." },
];

// 최신 발행일 대신 첫 방문자의 관심 분야를 기준으로 선택한다.
// 화면과 ItemList는 같은 배열을 사용한다. 실제 질문 빈도 순위를 의미하지 않는다.
const digestiveGuide = HERBAL_GUIDES.find(g => g.slug === "dyspepsia")!;
const tonicGuide = HERBAL_GUIDES.find(g => g.slug === "constitution")!;
const RECOMMENDED_READINGS = [
  { category: "통증치료", title: "허리는 안 아픈데 다리만 저려요, 디스크일까요?", description: "다리 저림이 있을 때 확인할 증상과 진료 방향을 살펴보세요.", href: "/pain/다리만-저릴때-허리디스크" },
  { category: "교통사고", title: "엑스레이는 정상이라는데 계속 아픕니다", description: "사고 후 남는 통증과 검사에서 확인하는 내용을 정리했습니다.", href: "/pain/교통사고-엑스레이-정상" },
  { category: "보험한약", title: digestiveGuide.question, description: "반복되는 소화불량과 보험한약 적용·비용을 확인하세요.", href: herbalPath(digestiveGuide) },
  { category: "체질보약", title: tonicGuide.question, description: "피로·소화·수면을 함께 살피는 맞춤 한약 상담을 안내합니다.", href: herbalPath(tonicGuide) },
  { category: "다이어트", title: "다이어트 한약, 얼마나 먹어야 하고 비용은 어느 정도인가요?", description: "복용 기간과 비용을 먼저 확인하고 내 계획을 세워보세요.", href: "/diet/다이어트한약-기간과-비용" },
  { category: "피부 · 미용", title: "한의원에서 피코토닝을 받아도 될까요?", description: "상담부터 시술까지, 의료기관을 선택할 때 확인할 내용을 안내합니다.", href: "/skin/한의원-피코토닝-상담-시술" },
];

// "진료 범위" 섹션의 단일 소스 — 화면 카드와 아래 ItemList 노드가 이 배열에서 함께 생성된다.
// 상세 진료 안내로 직접 연결하고, 전체 글 목록은 하단과 푸터에서 안내한다.
const CLINIC_CARDS = [
  { href: "/pain/acute", badge: "통증", heading: "통증치료", blurb: "침·추나·약침, 치료 과정과 비용", ogImage: "/images/cards/pain-acute.png" },
  { href: "/accident", badge: "자동차보험", heading: "교통사고", blurb: "사고 후 통증과 불편, 접수부터 치료까지", ogImage: "/images/cards/accident.png" },
  { href: "/herbal/insurance", badge: "건강보험", heading: "보험한약", blurb: "소화불량·생리통 등 6개 질환, 10일 4만원대", ogImage: "/herbal/insurance/opengraph-image" },
  { href: "/herbal/tonic", badge: "비급여 한약", heading: "체질보약", blurb: "체질맞춤·두통·어지럼·갱년기, 기간별 비용", ogImage: "/herbal/tonic/opengraph-image" },
  { href: "/diet/program", badge: "체중 관리", heading: "다이어트", blurb: "처방·복용·식사 관리와 비용", ogImage: "/images/cards/diet-program.png" },
  { href: "/skin/spot", badge: "피부 · 미용", heading: "잡티제거", blurb: "CO₂ 제거부터 색소치료·슈링크 리프팅까지", ogImage: "/images/cards/skin-spot.png" },
] as const;

// 네이버 사이트 컬렉션(카드 슬라이드) 노출용 — 화면 카드와 1:1 대응
const treatmentListNode = itemListNode(
  "/",
  "treatment-list",
  "일산한의원 진료 안내",
  CLINIC_CARDS.map((card) => ({
    url: `${SITE_URL}${card.href}`,
    name: card.heading,
    image: `${SITE_URL}${card.ogImage}`,
  }))
);

export default async function Home() {
  const videos = await fetchLatestVideos(3);

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

      {/* ── 의료기관 확인 ── */}
      <VerifyClinicSection />

      {/* ── Philosophy ── */}
      <section id="philosophy" className="scroll-mt-24 bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<Quote size={15} />} label="진료철학 · 세 가지 약속" />
              <div className="mt-4">
                <TwoTone as="h2" lead="필요한 치료를 " accent="함께 정합니다" />
              </div>
            </div>

            <div className="mx-auto mt-10 max-w-3xl space-y-7">
              {PHILOSOPHY.map((item) => (
                <div key={item.quote}>
                  <p className="font-serif text-[1.15rem] font-semibold leading-relaxed text-ink">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p className="mt-3 text-[0.95rem] leading-[2] text-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/about" className="btn-ghost">
                일산한의원 소개 보기
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── Differentiation ── */}
      <section id="care-approach" className="scroll-mt-24 bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<Stethoscope size={15} />} label="진료 방식" />
              <div className="mt-4">
                <TwoTone as="h2" lead="진료실에서는 " accent="이렇게 확인합니다" />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
              {WHY_CARDS.map((card) => (
                <div key={card.badge} className="card p-7">
                  <SectionBadge label={card.badge} />
                  <h3 className="font-serif mt-3 text-[1.1rem] font-semibold text-ink">
                    {card.heading}
                  </h3>
                  <p className="mt-4 text-[0.95rem] leading-[1.9] text-muted">
                    {card.body}
                  </p>
                  <Link href={card.href} className="mt-5 inline-block text-[15px] font-medium text-primary underline underline-offset-4">{card.linkLabel} →</Link>
                </div>
              ))}
            </div>
            <div className="mx-auto mt-10 max-w-5xl border-t border-line pt-8">
              <h3 className="text-center text-lg font-semibold text-ink">일산한의원이 쌓아온 진료 경험</h3>
              <dl className="mt-5 grid gap-5 text-center sm:grid-cols-3">
                {TRUST_STATS.map(stat => <div key={stat.label}>
                  <dt className="text-sm text-muted">{stat.label}</dt>
                  <dd className="mt-2 text-2xl font-semibold text-ink">{stat.value}<span className="ml-1 text-base font-medium">{stat.unit}</span></dd>
                </div>)}
              </dl>
              <p className="mt-5 text-center text-[12px] text-muted">{TRUST_STATS_SOURCE}</p>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── Treatment Scope ── */}
      <section id="treatment-guide" className="scroll-mt-24 bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="진료 범위" />
              <div className="mt-4">
                <TwoTone as="h2" lead="어떤 치료가 " accent="필요하신가요?" />
              </div>
              <p className="mt-4 text-[14px] text-muted">
                증상별 치료 안내입니다. 6인 한의사가 분과를 나눠 진료합니다
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {CLINIC_CARDS.map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className="card group block p-7"
                >
                  <SectionBadge label={card.badge} />
                  <h3 className="font-serif mt-2 text-[1.15rem] font-semibold text-ink transition-colors group-hover:text-primary">
                    {card.heading}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-[1.9] text-muted">
                    {card.blurb}
                  </p>
                </Link>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="first-visit" className="scroll-mt-24 bg-[var(--surface)]">
        <div className="section-padding">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionBadge icon={<HelpCircle size={15} />} label="처음 방문하시는 분께" />
            <div className="mt-4">
              <TwoTone as="h2" lead="시간과 비용, " accent="미리 확인하세요" />
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl space-y-3">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="card group p-5 transition-colors open:border-primary/40"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                  <h3 className="font-serif text-[1rem] font-semibold leading-snug text-ink group-open:text-primary">
                    Q. {faq.q}
                  </h3>
                  <span className="shrink-0 text-primary transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-[0.95rem] leading-[2] text-muted">
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
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<HelpCircle size={15} />} label="증상별 질문과 답" />
              <div className="mt-4"><TwoTone as="h2" lead="내 고민과 닮은 " accent="질문을 읽어보세요" /></div>
              <p className="mt-4 text-[16px] leading-relaxed text-muted">진료를 결정하기 전에 궁금한 내용부터 살펴보세요.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {RECOMMENDED_READINGS.map(item => <Link key={item.href} href={item.href} className="card group flex flex-col p-6">
                <p className="text-sm font-semibold text-primary">{item.category}</p>
                <h3 className="mt-3 text-lg font-semibold leading-relaxed text-ink group-hover:text-primary">{item.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-[1.8] text-muted">{item.description}</p>
                <span className="mt-5 text-[15px] font-medium text-primary">답변 읽기 →</span>
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

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((v) => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card group overflow-hidden transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="relative aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    loading="lazy"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full pointer-events-none"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-[1rem] font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-primary">
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
        <div className="section-padding">
          <SectionReveal>
            <div className="grid gap-10 md:grid-cols-2">
              <div>
                <div className="text-center">
                  <SectionBadge icon={<Clock size={15} />} label="진료시간" />
                  <div className="mt-4">
                    <TwoTone as="h2" lead="언제 " accent="오시면 되나요?" />
                  </div>
                </div>
                <ul className="mt-8 space-y-3 text-[0.9rem]">
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
                    <p className="mt-2 text-sm text-muted">{CARE_GUIDE.consultation}</p>
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
                  자세한 안내 →
                </Link>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    </div>
  );
}
