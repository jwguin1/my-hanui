import { CLINIC } from "@/lib/clinic";
import Link from "next/link";
import PillButton from "@/components/ui/PillButton";
import {
  Clock,
  HeartMonitor,
  MapPin,
  MessageCircle,
  Stethoscope,
  Users,
} from "@/components/ui/icons";

const META = [
  { icon: <Users size={15} />, label: "6인 한의사 협진" },
  { icon: <HeartMonitor size={15} />, label: "초음파 진단" },
  { icon: <Clock size={15} />, label: "평일 야간 20시" },
  { icon: <MapPin size={15} />, label: "이마트 풍산점 3층" },
];

const QUICK_LINKS = [
  { label: "통증치료", detail: "침·추나·약침·치료 비용", href: "/pain/acute" },
  { label: "교통사고", detail: "사고 후 통증·불편", href: "/accident" },
  { label: "보험한약", detail: "소화불량·생리통 등 6개 질환", href: "/herbal/insurance" },
  { label: "체질보약", detail: "맞춤보약·두통·어지럼·갱년기", href: "/herbal/tonic" },
  { label: "다이어트", detail: "처방·복용·비용 안내", href: "/diet/program" },
  { label: "잡티제거", detail: "CO₂ · 색소치료 · 리프팅", href: "/skin/spot" },
];

/**
 * 단체사진 배경(밝기 보정 후 #E3E1E3 계열)과 페이지 크림 배경(#fdfbf7)의 경계를
 * 지우기 위한 4방향 페이드.
 *
 * mask-image + mask-composite:intersect 로 하지 않는다 — 크롬이 intersect 를
 * 거부하고 add 로 폴백해 마스크가 깨졌다. 대신 크림색 그라디언트 2장을 이미지 위에
 * 겹친다. 배경 레이어의 알파 합성은 "어느 한쪽 가장자리에만 가까워도 페이드"라는
 * 의도와 정확히 같은 결과를 주고, 합성 방식에 브라우저 편차가 없다.
 *
 * 세로 정지점은 에셋 크롭 기준 — 머리 상단 ≈14%, 턱 ≈54%.
 * 상단 8% / 하단 70% 는 가장 좁게 잘리는 초광폭(1920px)에서도 얼굴을 침범하지 않는다.
 */
const FADE_OVERLAY =
  "linear-gradient(to right, var(--bg) 0%, transparent 10%, transparent 90%, var(--bg) 100%), " +
  // 하단은 선형 1구간으로 끊으면 상체가 뭉텅 잘린 것처럼 보인다.
  // 중간 정지점을 둬 ease-out 에 가깝게 길게 흘려보내고,
  // 100% 가 아니라 92% 에서 완전 불투명에 도달시킨다 — 사진 자체의 하단 잘린 edge 를
  // 덮을 여유가 없으면 코트가 직선으로 뚝 끊긴 것처럼 보인다.
  "linear-gradient(to bottom, var(--bg) 0%, transparent 8%, transparent 56%, " +
  "color-mix(in srgb, var(--bg) 40%, transparent) 74%, " +
  "color-mix(in srgb, var(--bg) 85%, transparent) 85%, " +
  "var(--bg) 92%, var(--bg) 100%)";

const bandImageStyle: React.CSSProperties = {
  // 회색 배경을 크림 톤에 맞춰 미세 보정
  filter: "sepia(5%) saturate(96%) brightness(1.02)",
  // 밴드 비율은 뷰포트에 따라 3.85:1 ~ 4.8:1 로 변한다.
  // 에셋이 4:1 이라 cover 로 흡수하고, 30% 로 얼굴을 위쪽에 고정한다.
  height: "clamp(200px, 26vw, 400px)",
  objectFit: "cover",
  objectPosition: "center 30%",
};

export default function Hero() {
  return (
    <section className="bg-[var(--bg)]">
      {/* LCP 대비 — 프리로드 스캐너보다 먼저 밴드 이미지를 잡아둔다 */}
      <link
        rel="preload"
        as="image"
        href="/images/hero-team.avif"
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/images/hero-team-mobile.avif"
        media="(max-width: 767px)"
        fetchPriority="high"
      />

      <div className="mx-auto grid max-w-[1180px] gap-9 px-6 pb-8 pt-9 md:grid-cols-[1.15fr_1fr] md:items-center md:gap-10 lg:pb-10 lg:pt-14">
        <div>
          <p className="mb-5 text-[15px] font-semibold tracking-wide text-primary">이마트 풍산점 3층 · 일산한의원</p>
          <h1 className="text-[clamp(30px,7.9vw,42px)] font-bold leading-[1.25] tracking-[-0.035em] text-ink md:text-[clamp(36px,4.4vw,54px)]">
            <span className="block">“이건 치료 </span>
            <span className="block text-primary">안 하셔도 됩니다”</span>
          </h1>
          <p className="mt-6 text-[17px] leading-[1.8] text-[#554b43]">저희가 진료실에서 자주 드리는 말씀입니다.</p>
          <p className="mt-2 max-w-[29rem] text-[18px] font-medium leading-[1.8] text-ink">불편한 증상을 듣고, 필요한 검사를 함께 살펴봅니다.<br className="hidden lg:block" /> 치료가 필요한 부분과 지켜봐도 되는 부분을 설명드립니다.</p>

          <div className="mt-6 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
          <PillButton
            href={CLINIC.kakaoHref}
            variant="kakao"
            icon={<MessageCircle size={16} />}
            className="!px-2 !text-[14px] sm:!px-[26px] sm:!text-[16px]"
          >
            카카오톡 상담
          </PillButton>
          <PillButton
            href="#treatment-guide"
            variant="outline"
            icon={<Stethoscope size={16} />}
            className="!px-2 !text-[14px] sm:!px-[26px] sm:!text-[16px]"
          >
            전체 진료 보기
          </PillButton>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-2 text-[14px] font-medium text-[#554b43]">
            {META.map((m) => <li key={m.label} className="flex items-center gap-2"><span aria-hidden="true" className="text-primary">{m.icon}</span>{m.label}</li>)}
          </ul>
        </div>

        <nav aria-label="첫 화면 진료 바로가기" className="rounded-2xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-[21px] font-bold tracking-tight text-ink">어떤 진료를 찾으세요?</h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[#554b43]">궁금한 치료와 비용을 먼저 살펴보세요.</p>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {QUICK_LINKS.map((item) => <li key={item.href}>
              <Link href={item.href} className="group flex h-full flex-col rounded-xl border border-line bg-[var(--bg)] px-3 py-3.5 transition-colors hover:border-primary hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-4">
                <span className="flex items-center justify-between gap-1 text-[16px] font-semibold text-ink">{item.label}<span aria-hidden="true" className="text-primary">↗</span></span>
                <span className="mt-1.5 hidden text-[13px] leading-relaxed text-[#554b43] sm:block">{item.detail}</span>
              </Link>
            </li>)}
          </ul>
        </nav>
      </div>

      {/* ── 하단 풀블리드 단체사진 밴드 ──
          section 이 이미 전체 폭이라 100vw 없이 100% 로 풀블리드가 된다.
          (100vw 는 스크롤바 폭만큼 가로 스크롤을 만든다) */}
      <div className="relative w-full">
        <picture>
          {/* 파노라마를 모바일에 그대로 쓰면 얼굴이 뭉개져 가운데 3인 크롭으로 교체 */}
          <source
            media="(max-width: 767px)"
            srcSet="/images/hero-team-mobile.avif"
            type="image/avif"
          />
          <source
            media="(max-width: 767px)"
            srcSet="/images/hero-team-mobile.webp"
            type="image/webp"
          />
          <source srcSet="/images/hero-team.avif" type="image/avif" />
          <source srcSet="/images/hero-team.webp" type="image/webp" />
          <img
            src="/images/hero-team.webp"
            alt="일산한의원 한의사 6인 단체 사진"
            width={1916}
            height={479}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            sizes="100vw"
            className="block w-full"
            style={bandImageStyle}
          />
        </picture>

        {/* 사진 가장자리를 페이지 배경으로 녹이는 페이드. 사진 위, 뱃지 아래에 깔린다. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: FADE_OVERLAY }}
        />

        <p className="pointer-events-none absolute bottom-3 right-4 md:bottom-6 md:right-8">
          <span className="rounded-full border border-line bg-card px-[18px] py-2.5 text-[13px] text-ink shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            필요한 치료만 권해드립니다
          </span>
        </p>
      </div>
    </section>
  );
}
