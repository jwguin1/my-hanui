import Link from "next/link";
import { CLINIC } from "@/lib/clinic";
import { CLINIC_PHYSICIAN_COUNT } from "@/lib/schema";
import PillButton from "@/components/ui/PillButton";
import {
  Activity, BodyScan, Clock, HeartMonitor, Herb, ListCheck, MapPin,
  MessageCircle, Scan, Soup, Spine, Users,
} from "@/components/ui/icons";

const META = [
  { icon: <Users size={16} />, label: `${CLINIC_PHYSICIAN_COUNT}인 의료진 시간표`, href: "/doctor#weekly-schedule" },
  { icon: <HeartMonitor size={16} />, label: "초음파 진단" },
  { icon: <Clock size={16} />, label: `평일 ${CLINIC.hours.weekdayAfternoon.closes} · 주말 ${CLINIC.hours.weekend.closes}까지` },
];

const QUICK_LINKS = [
  { label: "통증치료", href: "/pain", Icon: Spine },
  { label: "교통사고", href: "/accident", Icon: BodyScan },
  { label: "보험한약", href: "/herbal/insurance", Icon: ListCheck },
  { label: "체질보약", href: "/herbal/tonic", Icon: Soup },
  { label: "일산감비환", href: "/diet/program", Icon: Activity },
  { label: "피부·레이저", href: "/skin", Icon: Scan },
  { label: "방문진료", href: "/home-visit", Icon: MapPin },
  { label: "오늘의 한약", href: "/herbs", Icon: Herb },
];

export default function Hero() {
  return (
    <section className="home-hero bg-[var(--bg)]">
      <link rel="preload" as="image" type="image/avif" href="/images/team-seven-natural.avif" media="(min-width: 768px)" fetchPriority="high" />
      <link rel="preload" as="image" type="image/avif" href="/images/team-seven-natural-mobile.avif" media="(max-width: 767px)" fetchPriority="high" />

      <div className="mx-auto max-w-[1160px] px-5 pb-10 sm:px-8 lg:pb-14">
        <div className="grid items-center gap-5 pb-5 pt-6 sm:gap-8 md:grid-cols-[1fr_1.08fr] md:gap-10 md:py-12 lg:gap-14 lg:py-14">
          <div>
            <p className="text-sm font-semibold leading-relaxed text-primary">고양시 일산동구 · {CLINIC.building}</p>
            <h1 className="mt-3 text-[clamp(30px,8.9vw,36px)] font-bold leading-[1.18] tracking-[-0.04em] text-ink md:mt-5 md:text-[clamp(38px,4.3vw,56px)]">
              <span className="block">“이건 치료</span>
              <span className="relative isolate mt-1 inline-block text-primary">
                안 하셔도 됩니다”
                <span aria-hidden="true" className="absolute inset-x-1 -bottom-0.5 -z-10 h-1.5 -rotate-1 rounded-full bg-brush/70 md:h-2" />
              </span>
            </h1>
            <p className="mt-5 text-base leading-[1.65] text-muted md:mt-6 md:text-lg">
              저희가 자주 드리는 말씀입니다.<br />
              <strong className="font-semibold text-ink">필요한 치료만, 충분히 설명하고 권합니다.</strong>
            </p>
            <p className="mt-2 text-base leading-[1.65] text-muted">통증·다이어트·피부 미용·기능성 소화불량을 진료합니다.</p>
            <PillButton href={CLINIC.kakaoHref} variant="kakao" icon={<MessageCircle size={18} />} className="mt-6 min-h-12 !text-base max-lg:!hidden">
              카카오톡 상담
            </PillButton>
          </div>
          <Link href="/doctor" className="group relative mx-auto block w-full max-w-[21rem] rounded-2xl sm:max-w-md md:max-w-none">
            <picture>
              <source media="(max-width: 767px)" srcSet="/images/team-seven-natural-mobile.avif" type="image/avif" />
              <source media="(max-width: 767px)" srcSet="/images/team-seven-natural-mobile.webp" type="image/webp" />
              <source srcSet="/images/team-seven-natural.avif" type="image/avif" />
              <source srcSet="/images/team-seven-natural.webp" type="image/webp" />
              <img src="/images/team-seven-natural.webp" alt="일산한의원 한의사 7명 단체사진"
                width={1615} height={974} fetchPriority="high" loading="eager" decoding="async"
                className="block h-auto w-full rounded-2xl" />
            </picture>
            <span className="absolute bottom-2 right-2 rounded-full border border-line bg-white/95 px-3 py-1 text-sm font-semibold text-primary group-hover:underline">의료진 소개</span>
          </Link>
        </div>

        <nav id="treatment-guide" aria-label="첫 화면 진료 바로가기" className="scroll-mt-24 border-t border-line pt-4 md:pt-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-bold tracking-tight text-ink md:text-2xl">어떤 진료를 찾으세요?</h2>
            <Link href="/treatment" className="inline-flex min-h-11 shrink-0 items-center text-sm font-semibold text-primary underline underline-offset-4">진료 안내 보기</Link>
          </div>
          <ul className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {QUICK_LINKS.map(({ label, href, Icon }) => (
              <li key={href}>
                <Link href={href} className="flex min-h-[54px] items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5 text-base font-semibold leading-snug text-ink transition-colors hover:border-primary/50 hover:bg-surface focus-visible:outline-primary md:min-h-16 md:px-5">
                  <span aria-hidden="true" className="text-primary"><Icon size={20} /></span>{label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul aria-label="의료진과 진료시간" className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium leading-relaxed text-primary">
          {META.map(({ icon, label, href }) => (
            <li key={label} className="flex items-center gap-1.5">
              {icon && <span aria-hidden="true">{icon}</span>}
              {href ? <Link href={href} className="inline-flex min-h-11 items-center underline underline-offset-4">{label}</Link> : label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
