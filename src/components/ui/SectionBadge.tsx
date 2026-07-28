import type { ReactNode } from "react";

export default function SectionBadge({
  icon,
  label,
}: {
  icon?: ReactNode;
  label: string;
}) {
  return (
    // --surface 섹션 위에서도 알약 형태가 보이도록 hairline 테두리를 둔다
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-4 py-[7px] text-[13px] font-medium text-primary">
      {icon ? (
        <span className="inline-flex h-[15px] w-[15px] items-center justify-center">
          {icon}
        </span>
      ) : null}
      {label}
    </span>
  );
}
