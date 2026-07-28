export default function NumberedStep({
  index,
  title,
  body,
  last = false,
}: {
  index: number;
  title: string;
  body: string;
  /** 마지막 항목이면 세로선을 그리지 않는다 */
  last?: boolean;
}) {
  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      {/* 좌측 세로선 */}
      {last ? null : (
        <span
          aria-hidden="true"
          className="absolute left-[14px] top-8 h-[calc(100%-2rem)] w-px bg-line"
        />
      )}

      <span className="relative z-10 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-card text-[13px] font-medium text-primary">
        {index}
      </span>

      <div className="pt-0.5">
        <h3 className="text-[16px] font-semibold text-ink">{title}</h3>
        <p className="mt-1.5 text-[14px] leading-[1.8] text-muted">{body}</p>
      </div>
    </li>
  );
}
