import BrushUnderline from "@/components/ui/BrushUnderline";
import PillButton from "@/components/ui/PillButton";
import TwoTone from "@/components/ui/TwoTone";
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

      {/* ── 카피 블록 (중앙 정렬) ── */}
      <div className="mx-auto flex max-w-[1180px] flex-col items-center px-6 pb-8 pt-9 text-center lg:pb-10 lg:pt-[56px]">
        {/* 모바일에서만 헤드라인 한 단계 축소 */}
        <div className="w-fit [&_h1]:text-[28px] md:[&_h1]:text-[44px] lg:[&_h1]:text-[60px]">
          <TwoTone
            as="h1"
            stacked
            lead={'"이건 치료'}
            accent={'안 하셔도 됩니다"'}
          />
          <div className="mt-[2px] flex justify-center">
            <BrushUnderline />
          </div>
        </div>

        <p className="mt-[26px] text-[15px] text-muted">
          저희가 진료실에서 자주 드리는 말씀입니다.
        </p>
        <p className="mt-2 text-[18px] font-medium leading-relaxed text-ink">
          초음파로 직접 보면서 진단하니까, 필요한 치료만 남습니다.
        </p>

        <ul className="mt-[26px] flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-[13px] text-[#6B5B4B]">
          {META.map((m, i) => (
            <li key={m.label} className="flex items-center gap-2">
              {i > 0 ? (
                <span aria-hidden="true" className="hidden text-line sm:inline">
                  ·
                </span>
              ) : null}
              <span className="flex items-center gap-1.5">
                <span className="text-tan-soft">{m.icon}</span>
                {m.label}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-[30px] flex w-full flex-col justify-center gap-2.5 sm:w-auto sm:flex-row">
          <PillButton
            href="/pain/acute"
            variant="solid"
            icon={<Stethoscope size={16} />}
            className="w-full sm:w-auto"
          >
            진료 안내 보기
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
