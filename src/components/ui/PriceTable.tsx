export type PriceRow = {
  name: string;
  /** 구성 항목. 없으면 표시하지 않는다 */
  includes?: string;
  /** "30,000원", "본인부담금 3만원대" 등 자유 문자열 — 숫자 포맷을 강제하지 않는다 */
  price: string;
  /** 3열 모드에서만 사용하는 두 번째 금액 */
  price2?: string;
};

export default function PriceTable({
  caption,
  rows,
  note,
  headers,
}: {
  caption: string;
  rows: PriceRow[];
  note?: string;
  /** 지정하면 3열 모드 — [1열 금액 라벨, 2열 금액 라벨] */
  headers?: [string, string];
}) {
  const threeCol = Boolean(headers);

  return (
    <div>
      <div className="overflow-hidden rounded-2xl border border-line bg-card">
        <p className="border-b border-line bg-surface px-5 py-3.5 text-[14px] font-semibold text-ink">
          {caption}
        </p>

        {threeCol && headers ? (
          <>
            {/* 3열 모드 — sm 이상 */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-4 border-b border-line bg-surface px-5 py-2.5">
                <p className="min-w-0 flex-1 text-[13px] text-muted">부위</p>
                <p className="w-[112px] shrink-0 text-right text-[13px] text-muted">
                  {headers[0]}
                </p>
                <p className="w-[128px] shrink-0 text-right text-[13px] text-muted">
                  {headers[1]}
                </p>
              </div>
              {rows.map((row) => (
                <div
                  key={row.name}
                  className="flex items-center gap-4 border-b border-line px-5 py-4 last:border-b-0"
                >
                  <p className="min-w-0 flex-1 text-[15px] font-medium text-ink">
                    {row.name}
                  </p>
                  <p className="w-[112px] shrink-0 whitespace-nowrap text-right text-[16px] font-semibold text-primary">
                    {row.price}
                  </p>
                  <p className="w-[128px] shrink-0 whitespace-nowrap text-right text-[16px] font-semibold text-primary">
                    {row.price2}
                  </p>
                </div>
              ))}
            </div>

            {/* 모바일 — 부위별 카드로 분리 */}
            <div className="sm:hidden">
              {rows.map((row) => (
                <div
                  key={row.name}
                  className="border-b border-line px-5 py-4 last:border-b-0"
                >
                  <p className="text-[15px] font-medium text-ink">{row.name}</p>
                  <dl className="mt-2.5 space-y-1.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-[13px] text-muted">{headers[0]}</dt>
                      <dd className="whitespace-nowrap text-[15px] font-semibold text-primary">
                        {row.price}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-[13px] text-muted">{headers[1]}</dt>
                      <dd className="whitespace-nowrap text-[15px] font-semibold text-primary">
                        {row.price2}
                      </dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </>
        ) : (
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
        )}
      </div>

      {note ? (
        <p className="mt-3 text-[12px] leading-relaxed text-muted">{note}</p>
      ) : null}
    </div>
  );
}
