import { CLINIC } from "@/lib/clinic";
import Link from "next/link";
import PillButton from "@/components/ui/PillButton";
import {
  Clock,
  HeartMonitor,
  MessageCircle,
  Stethoscope,
  Users,
} from "@/components/ui/icons";

const META = [
  { icon: <Users size={15} />, label: "7인 한의사 협진" },
  { icon: <HeartMonitor size={15} />, label: "초음파 진단" },
  { icon: <Clock size={15} />, label: `평일 ${CLINIC.hours.weekdayAfternoon.closes} · 주말 ${CLINIC.hours.weekend.closes}까지` },
];

const QUICK_LINKS = [
  { label: "통증치료", href: "/pain" },
  { label: "교통사고", href: "/accident" },
  { label: "보험한약", href: "/herbal/insurance" },
  { label: "체질보약", href: "/herbal/tonic" },
  { label: "일산감비환", href: "/diet/program" },
  { label: "피부·레이저", href: "/skin" },
  { label: "방문진료", href: "/home-visit" },
  { label: "오늘의 한약", href: "/herbs" },
];

export default function Hero() {
  return (
    <section className="home-hero bg-[var(--bg)]">
      {/* LCP 대비 — 프리로드 스캐너보다 먼저 밴드 이미지를 잡아둔다 */}
      <link
        rel="preload"
        as="image"
        href="/images/team-seven-natural.avif"
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href="/images/team-seven-natural-mobile.avif"
        media="(max-width: 767px)"
        fetchPriority="high"
      />

      <div className="mx-auto grid max-w-[1180px] gap-8 px-5 pb-8 pt-8 md:grid-cols-[1.35fr_1fr] md:items-center md:gap-10 md:px-6 md:py-14 lg:gap-14 lg:py-16">
        <div>
          <p className="mb-5 text-sm font-medium leading-relaxed text-primary md:mb-6">고양시 일산동구 · {CLINIC.building}</p>
          <h1 className="text-[clamp(30px,8.9vw,36px)] font-extrabold leading-[1.25] tracking-[-0.04em] text-ink md:text-[clamp(40px,4.5vw,60px)]">
            <span className="block">“이건 치료</span>
            <span className="relative isolate mt-1 inline-block whitespace-nowrap text-primary">
              안 하셔도 됩니다”
              <span aria-hidden="true" className="absolute -bottom-1 left-0 right-1 -z-10 h-[7px] -rotate-1 rounded-full bg-brush/70 md:h-[9px]" />
            </span>
          </h1>
          <p className="mt-6 text-base leading-[1.7] text-[#665b50]">
            저희가 자주 드리는 말씀입니다.<br />
            <strong className="font-semibold text-[#554b43]">필요한 치료만, 충분히 설명하고 권합니다.</strong>
          </p>
          <p className="mt-3 text-base leading-[1.7] text-muted">통증·다이어트·피부 미용·기능성 소화불량을 진료합니다.</p>

          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium leading-relaxed text-[#665b50]">
            {META.map((m) => <li key={m.label} className="flex items-center gap-1.5"><span aria-hidden="true" className="text-tan">{m.icon}</span>{m.label}</li>)}
          </ul>

          <div className="mt-6 flex gap-3">
            <PillButton href={CLINIC.kakaoHref} variant="kakao" icon={<MessageCircle size={16} />} className="max-lg:!hidden min-h-12 whitespace-nowrap !px-5 !text-base">
              카카오톡 상담
            </PillButton>
            <PillButton href="/treatment" variant="outline" icon={<Stethoscope size={16} />} className="min-h-12 whitespace-nowrap !px-5 !text-base">
              진료 안내 보기
            </PillButton>
          </div>
        </div>

        <nav id="treatment-guide" aria-label="첫 화면 진료 바로가기" className="scroll-mt-24 rounded-2xl border border-line bg-white px-5 py-6 sm:px-7 sm:py-8">
          <h2 className="text-[22px] font-bold leading-snug tracking-tight text-ink">어떤 진료를 찾으세요?</h2>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {QUICK_LINKS.map((item) => <li key={item.href}>
              <Link href={item.href} className="group relative flex min-h-[72px] items-center whitespace-nowrap rounded-xl border border-line bg-[var(--bg)] px-3 py-4 text-base font-semibold leading-normal text-ink transition-colors hover:border-primary/40 hover:bg-surface hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:px-4">
                {item.label}<span aria-hidden="true" className="absolute right-2.5 top-2 text-xs text-primary/60">↗</span>
              </Link>
            </li>)}
          </ul>
        </nav>
      </div>

      <div className="mx-auto max-w-[1000px] px-5 pb-10 md:px-6">
        <picture>
          <source media="(max-width: 767px)" srcSet="/images/team-seven-natural-mobile.avif" type="image/avif" />
          <source media="(max-width: 767px)" srcSet="/images/team-seven-natural-mobile.webp" type="image/webp" />
          <source srcSet="/images/team-seven-natural.avif" type="image/avif" />
          <source srcSet="/images/team-seven-natural.webp" type="image/webp" />
          <img src="/images/team-seven-natural.webp" alt="일산한의원 한의사 7명 단체사진"
            width={1615} height={974} fetchPriority="high" loading="eager" decoding="async"
            className="block h-auto w-full rounded-2xl" />
        </picture>
      </div>
    </section>
  );
}
