export default function StageCard({
  step,
  badge,
  title,
  note,
  tags,
  treatment,
  highlight = false,
}: {
  step: number;
  badge: string;
  title: string;
  note: string;
  tags: string[];
  treatment: string;
  /** 강조 카드 — 테두리를 --primary 로 */
  highlight?: boolean;
}) {
  return (
    <div
      // 본문 길이가 달라도 하단 "치료:" 박스가 나란히 정렬되도록 flex 컬럼
      className={`flex h-full flex-col rounded-2xl border bg-card p-6 ${
        highlight ? "border-primary" : "border-line"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-[15px] font-medium text-white">
          {step}
        </span>
        <span className="inline-flex rounded-full bg-surface px-2.5 py-1 text-[12px] text-muted">
          {badge}
        </span>
      </div>

      <h3 className="mt-4 text-[17px] font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-[14px] leading-[1.8] text-muted">{note}</p>

      {/* 남는 높이를 태그 영역이 흡수해 하단 "치료:" 박스가 나란히 정렬된다 */}
      <ul className="mt-4 flex flex-1 flex-wrap content-start gap-1.5">
        {tags.map((tag) => (
          <li
            key={tag}
            className="rounded-full bg-surface px-2.5 py-1 text-[13px] text-ink"
          >
            {tag}
          </li>
        ))}
      </ul>

      <p className="mt-4 rounded-lg bg-surface px-3.5 py-3.5 text-[14px] leading-relaxed">
        <span className="font-medium text-primary">치료: </span>
        <span className="text-ink">{treatment}</span>
      </p>
    </div>
  );
}
