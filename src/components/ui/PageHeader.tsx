import type { ReactNode } from "react";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";

/**
 * 하위 페이지 공통 헤더 — 한글 배지 + 투톤 h1 + 부제.
 * 홈 히어로와 같은 톤을 쓰되 배경은 --surface 단색(그라디언트·애니메이션 없음).
 * accent 를 비우면 단색 h1 으로 렌더된다.
 */
export default function PageHeader({
  badge,
  icon,
  lead,
  accent = "",
  stacked = false,
  description,
}: {
  badge: string;
  icon?: ReactNode;
  lead: string;
  accent?: string;
  stacked?: boolean;
  description?: string;
}) {
  return (
    <section className="bg-[var(--surface)]">
      <div className="mx-auto max-w-[1100px] px-6 py-16 text-center md:px-8 md:py-20">
        <SectionBadge icon={icon} label={badge} />
        <div className="mt-4">
          <TwoTone as="h1" lead={lead} accent={accent} stacked={stacked} />
        </div>
        {description ? (
          <p className="mx-auto mt-4 max-w-md text-[14px] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
