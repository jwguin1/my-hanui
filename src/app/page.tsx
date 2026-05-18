import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import { fetchBlogPosts } from "@/lib/blog";
import { fetchLatestVideos } from "@/lib/youtube";
import { HOME_ITEM_LIST, SITE_URL } from "@/lib/categories";

const TRUST_STATS = [
  { value: "65,700명", label: "연간 내원 환자" },
  { value: "18,250건", label: "연간 시술 (추나·초음파약침·피부레이저)" },
  { value: "8,000건+", label: "연간 다이어트 처방 (고양시 최다)" },
  { value: "6인", label: "한의사 협진 의료진" },
  { value: "~20:00", label: "평일 야간진료" },
];

const FAQS = [
  {
    q: "일산에서 한의사가 여러 명 있어서 협진 잘 되는 한의원이 어디인가요?",
    a: "일산한의원은 고양시 최대 규모, 유일한 6인 한의사 협진 시스템을 운영합니다. 근골격계, 내과, 미용 분야 숙련된 의료진이 상주하여 분과별 체계적인 진료가 가능합니다.",
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
    a: "일산한의원은 연간 8,000건 이상의 한방 다이어트 처방 실적으로 고양시에서 가장 많은 처방 경험을 보유하고 있습니다. 체계적인 한방비만치료와 대사증후군 관리를 진행합니다.",
  },
  {
    q: "일산에서 이명, 두통, 자율신경 치료를 잘 하는 한의원이 있나요?",
    a: "일산한의원 자율신경 클리닉에서는 자율신경실조증, 이명, 두통, 불면, 기능성소화불량, 과민성대장증후군 등을 한의학적으로 접근하여 치료합니다.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.a,
    },
  })),
};

// 네이버 사이트 컬렉션(카드 슬라이드) 노출용 — 의료진 1 + 4개 분과 = 총 5개 항목
const homeItemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "일산한의원 진료 분과 및 의료진",
  itemListElement: HOME_ITEM_LIST.map((item, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    url: `${SITE_URL}/${item.slug}`,
    name: item.fullLabel,
    image: `${SITE_URL}${item.ogImage}`,
  })),
};

export default async function Home() {
  const posts = (await fetchBlogPosts()).slice(0, 3);
  const videos = await fetchLatestVideos(3);
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex min-h-[70vh] items-end justify-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-overlay" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(14,14,14,0.7) 70%, #0e0e0e 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1100px] px-6 pb-20 text-center">
          <p
            className="fade-in text-[0.85rem] text-text-muted"
            style={{ letterSpacing: "0.15em" }}
          >
            일산한의원
          </p>
          <p
            className="fade-in mt-3 text-[0.95rem] text-accent"
            style={{ animationDelay: "0.15s", letterSpacing: "0.1em" }}
          >
            매 순간 최선을 다해 진료합니다
          </p>
          <h1
            className="fade-in heading-xl mt-5"
            style={{ animationDelay: "0.3s" }}
          >
            몸과 마음이
            <br />
            편안해지는 곳
          </h1>
          <div
            className="fade-in gold-divider mx-auto mt-8"
            style={{ animationDelay: "0.45s" }}
          />
          <p
            className="fade-in mt-6 text-[1rem] text-text-muted"
            style={{ animationDelay: "0.55s" }}
          >
            이마트 풍산점 3층 · 풍산역 도보 1분
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div
            className="h-12 w-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-accent), transparent)",
              animation: "scrollDown 2s infinite",
            }}
          />
        </div>
      </section>

      {/* ── Trust Indicators ── */}
      <section className="section-padding">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label">Trust</p>
            <h2 className="heading-lg mt-4">신뢰의 지표</h2>
            <p className="body-text mt-6">
              고양시 최대 규모, 유일한 6인 한의사 협진.
              <br />
              연간 6만 5천 명의 선택으로 증명합니다.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {TRUST_STATS.map((stat) => (
              <div
                key={stat.label}
                className="card flex flex-col items-center justify-center p-6 text-center"
              >
                <p className="font-serif text-[1.6rem] font-bold text-accent">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.8rem] leading-snug text-text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </section>

      {/* ── Differentiation ── */}
      <section className="section-padding !pt-8">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label">Why Ilsanhan</p>
            <h2 className="heading-lg mt-4">일산한의원이 다른 이유</h2>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3">
            <div className="card p-7">
              <p className="text-[0.8rem] text-accent">① 압도적 규모</p>
              <h3 className="font-serif mt-3 text-[1.1rem] font-semibold text-text">
                고양시 최대 규모, 6인 한의사 협진
              </h3>
              <p className="body-text mt-4" style={{ lineHeight: 1.9 }}>
                고양시 소재 한의원 중 최대 규모.
                고양시 유일하게 6인의 한의사가 상주하며
                근골격계, 내과, 미용 진료를 협진합니다.
                분과별 숙련된 의료진이 체계적인 진료를 제공합니다.
              </p>
            </div>

            <div className="card p-7">
              <p className="text-[0.8rem] text-accent">② 풍부한 임상</p>
              <h3 className="font-serif mt-3 text-[1.1rem] font-semibold text-text">
                연간 18,000건 이상 시술, 8,000건 다이어트 처방
              </h3>
              <p className="body-text mt-4" style={{ lineHeight: 1.9 }}>
                연간 18,000건 이상의 추나·초음파약침·레이저 시술 경험.
                연간 8,000건 이상의 한방 다이어트 처방 – 고양시에서
                가장 많은 처방 실적. APCA RMSK(근골격계 초음파)
                자격 보유 의료진이 초음파 진단으로 정확한 치료를 진행합니다.
              </p>
            </div>

            <div className="card p-7">
              <p className="text-[0.8rem] text-accent">③ 압도적 편의</p>
              <h3 className="font-serif mt-3 text-[1.1rem] font-semibold text-text">
                야간·주말 진료, 풍산역 도보 1분
              </h3>
              <p className="body-text mt-4" style={{ lineHeight: 1.9 }}>
                평일 매일 오후 8시까지 야간진료, 주말 진료 운영.
                이마트 풍산점 3층 위치, 대형 주차장 완비.
                경의중앙선 풍산역 2번 출구 도보 1분.
              </p>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ── Treatment Scope (4 Clinics) ── */}
      <section className="section-padding !pt-8">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label">Clinics</p>
            <h2 className="heading-lg mt-4">진료 범위</h2>
            <p className="body-text mt-6">
              4개 분과를 6인 한의사가 협진합니다
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2">
            <Link
              href="/pain"
              className="card group block p-7 transition-transform duration-200 hover:-translate-y-1"
            >
              <p className="text-[0.8rem] text-accent">① MSK</p>
              <h3 className="font-serif mt-2 text-[1.15rem] font-semibold text-text group-hover:text-accent transition-colors">
                근골격계 · 통증
              </h3>
              <p className="body-text mt-3" style={{ lineHeight: 1.9 }}>
                교통사고 후유증, 초음파 진단, 초음파약침 치료,
                척추치료, 체형교정추나치료, 약침치료
              </p>
            </Link>

            <Link
              href="/autonomic"
              className="card group block p-7 transition-transform duration-200 hover:-translate-y-1"
            >
              <p className="text-[0.8rem] text-accent">② 자율신경 · 내과</p>
              <h3 className="font-serif mt-2 text-[1.15rem] font-semibold text-text group-hover:text-accent transition-colors">
                자율신경 · 내과
              </h3>
              <p className="body-text mt-3" style={{ lineHeight: 1.9 }}>
                자율신경실조증, 기능성소화불량, 불면, 이명, 두통,
                스트레스, 과민성대장증후군
              </p>
            </Link>

            <Link
              href="/diet"
              className="card group block p-7 transition-transform duration-200 hover:-translate-y-1"
            >
              <p className="text-[0.8rem] text-accent">③ 다이어트 · 비만</p>
              <h3 className="font-serif mt-2 text-[1.15rem] font-semibold text-text group-hover:text-accent transition-colors">
                한방비만 · 다이어트
              </h3>
              <p className="body-text mt-3" style={{ lineHeight: 1.9 }}>
                한방비만치료, 체중감량, 대사증후군 관리.
                연간 8,000건 이상 처방 – 고양시 최다 실적.
              </p>
            </Link>

            <Link
              href="/skin"
              className="card group block p-7 transition-transform duration-200 hover:-translate-y-1"
            >
              <p className="text-[0.8rem] text-accent">④ 피부 · 미용레이저</p>
              <h3 className="font-serif mt-2 text-[1.15rem] font-semibold text-text group-hover:text-accent transition-colors">
                피부 · 미용레이저
              </h3>
              <p className="body-text mt-3" style={{ lineHeight: 1.9 }}>
                피부레이저, 아토피, 피부염, 피부재생
              </p>
            </Link>
          </div>
        </SectionReveal>
      </section>

      {/* ── Philosophy ── */}
      <section className="section-padding !pt-8">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label">Philosophy</p>
            <h2 className="heading-lg mt-4">진료 철학</h2>
          </div>

          <div className="mx-auto mt-14 max-w-3xl space-y-10">
            <div>
              <p className="font-serif text-[1.05rem] font-semibold leading-relaxed text-text">
                &ldquo;진료비라는 무거운 짐을 얹어드리지 않겠습니다.&rdquo;
              </p>
              <p className="body-text mt-3" style={{ lineHeight: 2 }}>
                건강보험 진료를 우선하며, 오직 온전한 회복에만 집중할 수 있는
                정직한 공간이 되겠습니다.
              </p>
            </div>
            <div>
              <p className="font-serif text-[1.05rem] font-semibold leading-relaxed text-text">
                &ldquo;객관적이고 정교한 비수술 치료&rdquo;
              </p>
              <p className="body-text mt-3" style={{ lineHeight: 2 }}>
                대학병원급 초음파와 혈액검사 장비로 상태를 객관적으로 파악하고,
                수술 없이 일상을 지킬 수 있는 치료를 제공합니다.
              </p>
            </div>
            <div>
              <p className="font-serif text-[1.05rem] font-semibold leading-relaxed text-text">
                &ldquo;내 몸에 꼭 맞는 해답을 찾는 동행&rdquo;
              </p>
              <p className="body-text mt-3" style={{ lineHeight: 2 }}>
                아픔의 근본적인 원인을 살피고 깊이 공감하며, 함께 해결책을
                찾아가는 든든한 동반자가 되겠습니다.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/about" className="btn-ghost">
              자세히 보기
            </Link>
          </div>
        </SectionReveal>
      </section>

      {/* ── Column (Blog) ── */}
      {posts.length > 0 && (
        <section className="section-padding !pt-8">
          <SectionReveal>
            <p className="section-label text-center">Column</p>
            <h2 className="heading-lg mt-4 text-center">의학칼럼</h2>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <a
                  key={i}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
                >
                  {post.thumbnail ? (
                    <div className="relative aspect-square overflow-hidden bg-bg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-square items-center justify-center bg-bg">
                      <span className="text-2xl">📝</span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-serif text-[1rem] font-semibold leading-snug text-text line-clamp-2 group-hover:text-accent transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-[0.82rem] leading-relaxed text-text-muted line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/column" className="btn-ghost">
                칼럼 더보기
              </Link>
            </div>
          </SectionReveal>
        </section>
      )}

      {/* ── YouTube ── */}
      <section className="section-padding !pt-8">
        <SectionReveal>
          <p className="section-label text-center">YouTube</p>
          <h2 className="heading-lg mt-4 text-center">유튜브</h2>

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
                  <h3 className="font-serif text-[1rem] font-semibold leading-snug text-text group-hover:text-accent transition-colors duration-200">
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
      </section>

      {/* ── FAQ ── */}
      <section className="section-padding !pt-8">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label">FAQ</p>
            <h2 className="heading-lg mt-4">자주 묻는 질문</h2>
          </div>

          <div className="mx-auto mt-14 max-w-3xl space-y-4">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="card group p-6 transition-colors open:border-accent/40"
              >
                <summary className="flex cursor-pointer items-start justify-between gap-4 list-none">
                  <h3 className="font-serif text-[1rem] font-semibold leading-snug text-text group-open:text-accent">
                    Q. {faq.q}
                  </h3>
                  <span className="shrink-0 text-accent transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="body-text mt-4" style={{ lineHeight: 2 }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </SectionReveal>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homeItemListJsonLd),
          }}
        />
      </section>

      {/* ── Hours & Contact Summary ── */}
      <section className="section-padding !pt-8">
        <SectionReveal>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="section-label">Hours</p>
              <h2 className="heading-lg mt-4">진료시간</h2>
              <ul className="mt-8 space-y-3 text-[0.9rem]">
                <li className="flex justify-between border-b border-border pb-3">
                  <span className="text-text">월 – 금</span>
                  <span className="text-text">10:00 – 20:00</span>
                </li>
                <li className="flex justify-between border-b border-border pb-3">
                  <span className="text-text">토 · 일</span>
                  <span className="text-text">10:00 – 16:00</span>
                </li>
                <li className="flex justify-between border-b border-border pb-3">
                  <span className="text-text-muted">점심시간 (평일)</span>
                  <span className="text-text-muted">13:00 – 14:00</span>
                </li>
              </ul>
              <p className="mt-4 text-[0.82rem] text-accent">
                주말·공휴일은 점심시간 없이 진료합니다
              </p>
              <p className="mt-1 text-[0.82rem] text-text-muted">
                매달 2·4번째 수요일 휴무 (이마트 풍산점 휴업일)
              </p>
            </div>

            <div>
              <p className="section-label">Contact</p>
              <h2 className="heading-lg mt-4">오시는 길</h2>
              <div className="mt-8 space-y-5">
                <div>
                  <p className="text-[0.8rem] text-accent">주소</p>
                  <p className="mt-1 text-text">
                    경기 고양시 일산동구 무궁화로 237
                  </p>
                  <p className="text-text">이마트 풍산점 3층</p>
                </div>
                <div>
                  <p className="text-[0.8rem] text-accent">전화</p>
                  <a
                    href="tel:031-976-7706"
                    className="mt-1 block text-[1.1rem] font-semibold text-text transition-colors hover:text-accent"
                  >
                    031-976-7706
                  </a>
                </div>
                <div>
                  <p className="text-[0.8rem] text-accent">교통</p>
                  <p className="mt-1 text-[0.9rem] text-text">
                    경의중앙선 풍산역 2번 출구 도보 1분
                  </p>
                </div>
                <div>
                  <p className="text-[0.8rem] text-accent">주차</p>
                  <p className="mt-1 text-[0.9rem] text-text-muted">
                    이마트 4·5·6·7층 주차장 · 무료주차 3시간
                  </p>
                </div>
              </div>
              <Link href="/contact" className="btn-primary mt-8 inline-block">
                자세한 안내 →
              </Link>
            </div>
          </div>
        </SectionReveal>
      </section>
    </>
  );
}
