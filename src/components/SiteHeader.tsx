import Link from "next/link";
import ClinicStatusPill from "@/components/ClinicStatusPill";
import SiteHeaderNav from "@/components/SiteHeaderNav";
import PillButton from "@/components/ui/PillButton";
import { MessageCircle, Phone } from "@/components/ui/icons";

const LINKS = [
  { href: "/pain", label: "통증" },
  { href: "/diet", label: "다이어트" },
  { href: "/skin", label: "피부" },
  { href: "/autonomic", label: "자율신경" },
  { href: "/column", label: "의학칼럼" },
  { href: "/contact", label: "오시는 길" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-[1000] border-b border-line bg-card">
      <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between gap-3 px-6">
        {/* 좌: 로고 + 진료 상태 */}
        <div className="flex min-w-0 items-center gap-2.5">
          <Link
            href="/"
            className="whitespace-nowrap text-[17px] font-bold tracking-[-0.02em] text-ink"
          >
            일산한의원
          </Link>
          <ClinicStatusPill />
        </div>

        {/* 중: 주요 진료 카테고리 */}
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="whitespace-nowrap text-[14px] text-muted transition-colors duration-200 hover:text-ink"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* 우: 전화 + 카카오톡 상담 */}
        <div className="flex items-center gap-1.5">
          <a
            href="tel:031-976-7706"
            aria-label="일산한의원 전화 031-976-7706"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-primary transition-colors duration-200 hover:bg-surface"
          >
            <Phone size={20} />
          </a>
          {/* PillButton 자체가 display 유틸을 갖고 있어, 숨김은 래퍼에서 처리한다 */}
          <span className="hidden lg:block">
            <PillButton
              href="https://pf.kakao.com/_eXXun"
              variant="solid"
              icon={<MessageCircle size={16} />}
              className="whitespace-nowrap"
            >
              카카오톡 상담
            </PillButton>
          </span>
          <SiteHeaderNav links={LINKS} />
        </div>
      </div>
    </header>
  );
}
