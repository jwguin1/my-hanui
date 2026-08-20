import Link from "next/link";
import Hero from "@/components/Hero";
import SectionReveal from "@/components/SectionReveal";
import PostCard from "@/components/PostCard";
import VerifyClinicSection from "@/components/VerifyClinicSection";
import SectionBadge from "@/components/ui/SectionBadge";
import StatCard from "@/components/ui/StatCard";
import TwoTone from "@/components/ui/TwoTone";
import {
  ChartBar,
  Clock,
  HelpCircle,
  ListCheck,
  MapPin,
  Microscope,
  PlayerPlay,
  Quote,
  Stethoscope,
} from "@/components/ui/icons";
import { fetchLatestVideos } from "@/lib/youtube";
import { CATEGORY_META, SITE_URL } from "@/lib/categories";
import { CAROUSEL_ORDER, CAROUSEL_TARGETS } from "@/lib/carousel-targets";
import {
  CLINIC,
  CLINIC_ADDRESS_STREET,
  CLINIC_HOURS_LUNCH,
  CLINIC_HOURS_WEEKDAY,
  CLINIC_HOURS_WEEKEND,
} from "@/lib/clinic";
import { getLatestPostCards, latestPostsListNode } from "@/lib/latest-posts";
import JsonLd from "@/components/JsonLd";
import {
  buildGraph,
  faqEntities,
  itemListNode,
  physicianStubs,
} from "@/lib/schema";

/**
 * 진료 실적 수치.
 *
 * 숫자만 크게 띄우면 기간도 근거도 없는 광고 문구로 읽힌다.
 * **산출 기준(개원 이래 · 원내 진료기록)은 TRUST_STATS_SOURCE 로 반드시 함께 노출한다.**
 * 수치를 고칠 때 기준도 같이 확인할 것.
 */
const TRUST_STATS = [
  // "명"은 연인원이 아니라 실인원이다 — 아래 80,000회(연인원)와 구분해서 읽혀야 한다
  { value: "13,000", unit: "명", label: "내원 환자 수 (실인원)" },
  { value: "80,000", unit: "회", label: "총 내원 횟수" },
  { value: "9,000", unit: "건+", label: "다이어트 처방 건수" },
  { value: "6", unit: "인", label: "한의사 협진 의료진" },
  { value: "20:00", unit: "까지", label: "평일 야간진료" },
];

/**
 * 위 수치의 산출 기준. 화면에서 TRUST_STATS 바로 아래에 함께 노출한다.
 * 기간과 근거가 붙어야 과장 광고 소지가 사라지고, AI 가 인용할 수 있는 형태가 된다.
 */
const TRUST_STATS_SOURCE = `${CLINIC.foundingYear}년 개원 이래 누적 · 원내 진료기록(EMR) 기준`;

const WHY_CARDS = [
  {
    badge: "6인 협진",
    heading: "6인 한의사 협진",
    body: "6인의 한의사가 상주하며 근골격계, 내과, 미용 진료를 협진합니다. 분과별 숙련된 의료진이 체계적인 진료를 제공합니다.",
  },
  {
    badge: "임상 경험",
    heading: "누적 80,000회 내원, 9,000건 이상 다이어트 처방",
    body: "누적 13,000명의 환자분이 80,000회 내원해 주셨습니다. 2023년 개원 이래 누적 9,000건 이상의 한방 다이어트 처방 경험. APCA RMSK(근골격계 초음파) 자격 보유 의료진이 초음파 진단으로 정확한 치료를 진행합니다.",
  },
  {
    badge: "접근성",
    heading: "야간·주말 진료, 풍산역 도보 1분",
    body: "평일 매일 오후 8시까지 야간진료, 주말 진료 운영. 이마트 풍산점 3층 위치, 대형 주차장 완비. 경의중앙선 풍산역 2번 출구 도보 1분.",
  },
];

const PHILOSOPHY = [
  {
    quote: "진료비라는 무거운 짐을 얹어드리지 않겠습니다.",
    body: "건강보험 진료를 우선하며, 오직 온전한 회복에만 집중할 수 있는 정직한 공간이 되겠습니다.",
  },
  {
    quote: "객관적이고 정교한 비수술 치료",
    // 모델명은 장비 라벨 실물 확인 전까지 넣지 않는다.
    // 틀린 모델명은 모델명 없는 것보다 나쁘다 — 검증 가능한 "3대"만 쓴다.
    body: "근골격계 초음파 3대와 혈액검사 장비로 상태를 객관적으로 파악하고, 수술 없이 일상을 지킬 수 있는 치료를 제공합니다.",
  },
  {
    quote: "내 몸에 꼭 맞는 해답을 찾는 동행",
    body: "아픔의 근본적인 원인을 살피고 깊이 공감하며, 함께 해결책을 찾아가는 든든한 동반자가 되겠습니다.",
  },
];

const FAQS = [
  {
    q: "일산에서 한의사가 여러 명 있어서 협진 잘 되는 한의원이 어디인가요?",
    a: "일산한의원은 6인의 한의사가 4개 분과를 협진합니다. 근골격계, 내과, 미용 분야 숙련된 의료진이 상주하여 분과별 체계적인 진료가 가능합니다.",
  },
  {
    q: "고양시에서 교통사고 통증과 피부레이저를 한 곳에서 할 수 있는 한의원이 있나요?",
    a: "일산한의원에서는 교통사고 후유증 치료(초음파 진단, 초음파약침, 체형교정추나)와 피부레이저 시술을 한 곳에서 받으실 수 있습니다. 6인 의료진이 각 분야를 담당하여 체계적인 치료를 제공합니다.",
  },
  {
    q: "일산 풍산역 근처에 주차 편하고 야간에도 여는 한의원이 있나요?",
    a: "일산한의원은 이마트 풍산점 3층에 위치하여 대형 주차장을 이용하실 수 있습니다. 평일 매일 오후 8시까지 야간진료, 주말 진료를 운영합니다. 경의중앙선 풍산역 2번 출구에서 도보 1분 거리입니다.",
  },
  {
    q: "근골격계 통증과 내과 질환을 함께 볼 수 있는 일산 한의원이 있나요?",
    a: "일산한의원은 MSK(근골격계), 자율신경·내과, 다이어트, 피부미용 4개 분과를 6인 한의사가 협진합니다. APCA RMSK 자격 보유 의료진의 초음파 진단으로 정확한 원인 파악 후 치료를 진행합니다.",
  },
  {
    q: "고양시에서 한방 다이어트로 유명한 한의원이 어디인가요?",
    a: "일산한의원은 2023년 개원 이래 누적 9,000건 이상의 한방 다이어트 처방 실적을 보유하고 있습니다(원내 진료기록 기준). 체계적인 한방비만치료와 대사증후군 관리를 진행합니다.",
  },
  {
    q: "일산에서 이명, 두통, 자율신경 치료를 잘 하는 한의원이 있나요?",
    a: "일산한의원 자율신경 클리닉에서는 자율신경실조증, 이명, 두통, 불면, 기능성소화불량, 과민성대장증후군 등을 한의학적으로 접근하여 치료합니다.",
  },
];

// "진료 범위" 섹션의 단일 소스 — 화면 카드와 아래 ItemList 노드가 이 배열에서 함께 생성된다.
// 진료 페이지로 직접 보내는 카드 — 아카이브(/pain 등)는 하단 "의학정보" 섹션에만 둔다
/**
 * 카드 이미지는 **7개가 전부 달라야 한다.**
 *
 * 예전에는 카테고리 대표 OG 4장을 나눠 썼다 — `pain-og` 3회, `autonomic-og` 2회.
 * 카드 7장 중 3장이 같은 그림이면 네이버가 캐러셀로 보지 않는다
 * (경쟁사는 6개 전부 다른 이미지를 쓰고 캐러셀이 붙는다).
 *
 * 사진을 새로 찍는 대신 글 카드와 같은 방식의 제목 카드를 만들었다:
 *   node scripts/generate-title-cards.mjs --clinic-cards
 * 그 스크립트가 생성 직후 파일 해시를 대조해 중복이 없는지 확인한다.
 */
const CLINIC_CARDS = [
  {
    href: "/pain/acute",
    badge: "통증",
    heading: "급성 통증",
    blurb: "침·물리치료로 3~5회 안에",
    ogImage: "/images/cards/pain-acute.png",
  },
  {
    href: "/pain/chronic",
    badge: "통증",
    heading: "만성 통증",
    blurb: "추나·초음파약침, 비용 공개",
    ogImage: "/images/cards/pain-chronic.png",
  },
  {
    href: "/accident",
    badge: "통증",
    heading: "교통사고",
    blurb: "자동차보험 본인부담 없이",
    ogImage: "/images/cards/accident.png",
  },
  {
    href: "/internal/dyspepsia",
    badge: "내과",
    heading: "소화불량",
    blurb: "급체는 당일, 만성은 한약",
    ogImage: "/images/cards/internal-dyspepsia.png",
  },
  {
    href: "/autonomic/care",
    badge: "내과",
    heading: "이명·어지럼·두통",
    blurb: "침으로 먼저 반응 확인",
    ogImage: "/images/cards/autonomic-care.png",
  },
  {
    href: "/diet/program",
    badge: "대사",
    heading: "다이어트 처방",
    blurb: "식단을 지속하게 돕는 처방",
    ogImage: "/images/cards/diet-program.png",
  },
  {
    href: "/skin/spot",
    badge: "미용",
    heading: "잡티 제거",
    blurb: "점·편평사마귀·쥐젖, 비용 공개",
    ogImage: "/images/cards/skin-spot.png",
  },
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
  // 화면 카드와 ItemList JSON-LD 의 유일한 출처 (개수·순서·제목이 반드시 일치해야 함)
  const postCards = getLatestPostCards(5);
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
      latestPostsListNode(postCards),
      // 카드의 author 참조가 끊기지 않도록 Physician 스텁을 함께 싣는다
      ...physicianStubs(postCards.map((c) => c.author)),
    ],
  });

  return (
    <>
      <JsonLd graph={graph} />
      {/* ── Hero ── */}
      <Hero />

      {/* ── Trust Indicators ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ChartBar size={15} />} label="진료 실적" />
              <div className="mt-4">
                <TwoTone as="h2" lead="숫자로 보는 " accent="일산한의원" />
              </div>
              <p className="mt-4 text-[14px] text-muted">
                13,000명이 80,000번 찾아주셨습니다.
                <br />
                한 분이 평균 여섯 번 다시 오신 기록입니다.
              </p>
              <p className="mt-3 text-[12px] text-muted">
                {TRUST_STATS_SOURCE}
              </p>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {TRUST_STATS.map((stat) => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  unit={stat.unit}
                  label={stat.label}
                />
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 의료기관 확인 ── */}
      <VerifyClinicSection />

      {/* ── Differentiation ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<Stethoscope size={15} />} label="진료 방식" />
              <div className="mt-4">
                <TwoTone as="h2" lead="일산한의원이 " accent="다른 이유" />
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
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── Treatment Scope (4 Clinics) ── */}
      <section className="bg-[var(--bg)]">
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

      {/* ── 둘러보기 (네이버 하위링크 카드 후보 6개) ──
          네이버가 웹사이트 결과 아래 거는 하위링크는 이 6개다.
          홈 본문에서 6개를 한 블록으로 묶어 걸어 후보를 명확히 한다.
          앵커 문구는 푸터 사이트맵·각 페이지 title 과 동일하다
          (단일 소스: lib/carousel-targets.ts) */}
      <section className="bg-[var(--bg)]">
        {/* 바로 위 "진료 범위"와 같은 배경이라 pt 를 줄여 한 블록처럼 이어 붙인다 */}
        <div className="section-padding !pt-4">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="둘러보기" />
              <div className="mt-4">
                <TwoTone as="h2" lead="어디부터 " accent="보시겠어요?" />
              </div>
            </div>

            <nav
              aria-label="주요 안내"
              className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2"
            >
              {CAROUSEL_ORDER.map((key) => {
                const t = CAROUSEL_TARGETS[key];
                return (
                  <Link
                    key={t.path}
                    href={t.path}
                    className="card group flex items-center justify-between gap-4 p-5"
                  >
                    <span className="min-w-0 text-[0.95rem] font-medium leading-snug text-ink transition-colors group-hover:text-primary">
                      {t.title}
                    </span>
                    <span aria-hidden="true" className="shrink-0 text-primary">
                      →
                    </span>
                  </Link>
                );
              })}
            </nav>
          </SectionReveal>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<Quote size={15} />} label="우리의 약속" />
              <div className="mt-4">
                <TwoTone as="h2" lead="저희의 " accent="진료 철학" />
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-3xl space-y-10">
              {PHILOSOPHY.map((item) => (
                <div key={item.quote}>
                  <p className="font-serif text-[1.05rem] font-semibold leading-relaxed text-ink">
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
                자세히 보기
              </Link>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 최신 의학정보 (자사 상세글) ── */}
      {postCards.length > 0 && (
        <section className="bg-[var(--bg)]">
          <div className="section-padding">
            <SectionReveal>
              <div className="text-center">
                <SectionBadge icon={<Microscope size={15} />} label="의학정보" />
                <div className="mt-4">
                  <TwoTone as="h2" lead="근거를 " accent="함께 봅니다" />
                </div>
                <p className="mt-4 text-[14px] text-muted">
                  진료 현장에서 마주한 사례와 최신 연구를 정리합니다
                </p>
              </div>

              <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {postCards.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link href="/blog" className="btn-ghost">
                  글 더보기
                </Link>
                <Link href="/column" className="btn-ghost">
                  네이버 의학칼럼
                </Link>
              </div>
            </SectionReveal>
          </div>
        </section>
      )}

      {/* ── YouTube ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
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

          <div className="mt-10 flex flex-col items-center gap-8">
            <Link href="/media" className="btn-ghost">
              영상 더보기
            </Link>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://pf.kakao.com/_eXXun"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#FEE500] px-7 py-3 text-[0.9rem] font-semibold text-[#3C1E1E] transition-opacity hover:opacity-90"
              >
                💬 카카오톡 상담
              </a>
              <a
                href="https://naver.me/IItclnGB"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#03C75A] px-7 py-3 text-[0.9rem] font-semibold text-white transition-opacity hover:opacity-90"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.27 10.6L6.44 1H1v18h5.73V9.4L13.56 19H19V1h-5.73z" />
                </svg>
                네이버 플레이스 보기
              </a>
            </div>
          </div>
        </SectionReveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionBadge icon={<HelpCircle size={15} />} label="자주 묻는 질문" />
            <div className="mt-4">
              <TwoTone as="h2" lead="궁금하신 점, " accent="먼저 답해드립니다" />
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-3xl space-y-4">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="card group p-6 transition-colors open:border-primary/40"
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
              </details>
            ))}
          </div>
        </SectionReveal>
        </div>
      </section>

      {/* ── Hours & Contact Summary ── */}
      <section className="bg-[var(--surface)]">
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
                    <span className="text-ink">토 · 일</span>
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
                    <p className="text-[0.8rem] text-primary">전화</p>
                    <a
                      href={CLINIC.telHref}
                      className="mt-1 block text-[1.1rem] font-semibold text-ink transition-colors hover:text-primary"
                    >
                      {CLINIC.tel}
                    </a>
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
    </>
  );
}
