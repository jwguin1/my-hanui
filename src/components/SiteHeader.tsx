import Link from "next/link";
import ClinicStatusPill from "@/components/ClinicStatusPill";
import SiteNavDesktop from "@/components/SiteNavDesktop";
import SiteNavMobile from "@/components/SiteNavMobile";
import PillButton from "@/components/ui/PillButton";
import { MessageCircle, Phone } from "@/components/ui/icons";
import { CLINIC } from "@/lib/clinic";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-[1000] border-b border-line bg-card">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6">
        {/* 좌: 로고 + 진료 상태 */}
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            href="/"
            className="whitespace-nowrap text-[17px] font-bold tracking-[-0.02em] text-ink"
          >
            일산한의원
          </Link>
          <span className="hidden sm:block"><ClinicStatusPill /></span>
        </div>

        {/* 중: 드롭다운 네비게이션 */}
        <SiteNavDesktop />

        {/* 카카오톡 상담을 모바일에서도 바로 찾을 수 있게 표시한다. */}
        <div className="flex shrink-0 items-center gap-1.5">
          <PillButton href={CLINIC.kakaoHref} variant="kakao" icon={<MessageCircle size={16} />} className="whitespace-nowrap !px-3 !py-2.5 lg:!px-5">
            카카오톡 상담
          </PillButton>
          <a href={CLINIC.telHref} aria-label={`일산한의원 전화 ${CLINIC.tel}`} className="hidden h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface lg:inline-flex">
            <Phone size={20} />
          </a>
          <SiteNavMobile />
        </div>
      </div>
    </header>
  );
}
