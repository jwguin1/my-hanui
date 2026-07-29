export type PriceRow = {
  name: string;
  /** 구성 항목. 없으면 표시하지 않는다 */
  includes?: string;
  /** "30,000원", "본인부담금 3만원대" 등 자유 문자열 — 숫자 포맷을 강제하지 않는다 */
  price: string;
};

export default function PriceTable({
  caption,
  rows,
  note,
}: {
  caption: string;
  rows: PriceRow[];
  note?: string;
}) {
  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        <p className="border-b border-line bg-surface px-5 py-3.5 text-[14px] font-semibold text-ink">
          {caption}
        </p>

        <ul>
          {rows.map((row) => (
            <li
              key={row.name}
              className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 last:border-b-0"
            >
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-ink">{row.name}</p>
                {row.includes ? (
                  <p className="mt-1 text-[13px] leading-relaxed text-muted">
                    {row.includes}
                  </p>
                ) : null}
              </div>
              <p className="shrink-0 whitespace-nowrap text-right text-[16px] font-semibold text-primary">
                {row.price}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {note ? (
        <p className="mt-3 text-[12px] leading-relaxed text-muted">{note}</p>
      ) : null}
    </div>
  );
}
