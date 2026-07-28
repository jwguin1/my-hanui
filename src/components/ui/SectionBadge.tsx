import type { ReactNode } from "react";

export default function SectionBadge({
  icon,
  label,
}: {
  icon?: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-4 py-[7px] text-[13px] font-medium text-primary">
      {icon ? (
        <span className="inline-flex h-[15px] w-[15px] items-center justify-center">
          {icon}
        </span>
      ) : null}
      {label}
    </span>
  );
}
