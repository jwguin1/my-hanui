import Link from "next/link";
import type { ReactNode } from "react";

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-[26px] py-[14px] text-[14px] font-medium transition-colors duration-200";

const VARIANT = {
  // 호버는 배경 명도만 변화 — 이동/그림자 효과 없음
  solid: "bg-primary text-white hover:bg-[#7d4f2e]",
  outline: "border border-line bg-card text-ink hover:bg-surface",
};

export default function PillButton({
  href,
  variant = "solid",
  icon,
  children,
  className = "",
}: {
  href: string;
  variant?: "solid" | "outline";
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const cls = `${BASE} ${VARIANT[variant]} ${className}`;
  const isExternal = /^(https?:|tel:|mailto:)/.test(href);

  if (isExternal) {
    const target = href.startsWith("http")
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <a href={href} className={cls} {...target}>
        {icon}
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {icon}
      {children}
    </Link>
  );
}
