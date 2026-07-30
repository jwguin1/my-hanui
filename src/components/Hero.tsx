import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import BrushUnderline from "@/components/ui/BrushUnderline";
import PillButton from "@/components/ui/PillButton";
import TwoTone from "@/components/ui/TwoTone";
import {
  Check,
  Clock,
  HeartMonitor,
  MapPin,
  MessageCircle,
  Stethoscope,
  Users,
} from "@/components/ui/icons";

// 스케치 일러스트가 아직 없을 수 있으므로 빌드 시점에 존재 여부를 확인한다.
const hasSketch = fs.existsSync(
  path.join(process.cwd(), "public", "images", "hero-sketch.png")
);

const META = [
  { icon: <Users size={15} />, label: "6인 한의사 협진" },
  { icon: <HeartMonitor size={15} />, label: "초음파 진단" },
  { icon: <Clock size={15} />, label: "평일 야간 20시" },
  { icon: <MapPin size={15} />, label: "이마트 풍산점 3층" },
];

// 점선 원 궤도 위 12 / 3 / 7 / 10시 방향
const ORBS = [
  { left: "50%", top: "0%", size: 18, color: "var(--brush)" },
  { left: "100%", top: "50%", size: 14, color: "#EDE2D0" },
  { left: "25%", top: "93.3%", size: 22, color: "var(--brush)" },
  { left: "6.7%", top: "25%", size: 16, color: "#EDE2D0" },
];

export default function Hero() {
  return (
    <section className="bg-[var(--bg)]">
      <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-6 pb-[72px] pt-12 lg:grid-cols-[55%_45%] lg:pb-[112px] lg:pt-[88px]">
        {/* ── 좌측 ── */}
        <div>
          <div className="w-fit">
            <TwoTone
              as="h1"
              stacked
              lead={'"이건 치료'}
              accent={'안 하셔도 됩니다"'}
            />
            <div className="mt-[2px]">
              <BrushUnderline />
            </div>
          </div>

          <p className="mt-[28px] text-[15px] text-muted">
            저희가 진료실에서 자주 드리는 말씀입니다.
          </p>
          <p className="mt-2 text-[18px] font-medium leading-relaxed text-ink">
            초음파로 직접 보면서 진단하니까, 필요한 치료만 남습니다.
          </p>

          <ul className="mt-[30px] flex flex-wrap items-center gap-x-2 gap-y-2 text-[13px] text-[#6B5B4B]">
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

          <div className="mt-[34px] flex flex-col gap-2.5 sm:flex-row">
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

        {/* ── 우측: 스케치 영역 ── */}
        <div className="mx-auto w-full max-w-[340px]">
          <div className="relative aspect-square w-full">
            {/* 점선 원 */}
            <div className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-brush" />

            {/* 장식 원 4개 — 모바일에서는 숨김 */}
            {ORBS.map((o, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="absolute hidden -translate-x-1/2 -translate-y-1/2 rounded-full md:block"
                style={{
                  left: o.left,
                  top: o.top,
                  width: o.size,
                  height: o.size,
                  background: o.color,
                }}
              />
            ))}

            {/* 체크 뱃지 — 원 테두리 위(우상단 45°)에 걸치도록 중심을 궤도에 맞춘다 */}
            <span
              aria-hidden="true"
              className="absolute left-[85.36%] top-[14.64%] hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white md:inline-flex"
            >
              <Check size={26} />
            </span>

            {/* 이미지 슬롯 — 16:9 일러스트가 원 안에 들어가는 한계 폭은 지름의 약 87%.
                85% 로 잡아 여유를 두고, 흰 배경은 multiply 로 페이지 배경에 녹인다. */}
            <div className="absolute left-1/2 top-1/2 flex w-[85%] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
              {hasSketch ? (
                <Image
                  src="/images/hero-sketch.png"
                  alt="일산한의원 이마트 풍산점 입구 일러스트"
                  width={1672}
                  height={941}
                  priority
                  sizes="(max-width: 1024px) 290px, 290px"
                  className="h-auto w-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center rounded-3xl border-[1.5px] border-dashed border-brush">
                  <span className="text-[13px] text-muted">
                    스케치 이미지 자리
                  </span>
                </div>
              )}
            </div>
          </div>

          <p className="mt-4 flex justify-center">
            <span className="rounded-full border border-line bg-card px-[18px] py-2.5 text-[13px] text-ink">
              필요한 치료만 권해드립니다
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
