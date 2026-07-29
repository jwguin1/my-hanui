export type CompareRow = { label: string; left: string; right: string };

export default function CompareTable({
  rows,
  headers = ["급성", "만성"],
}: {
  rows: CompareRow[];
  headers?: [string, string];
}) {
  return (
    <>
      {/* 데스크톱·태블릿 — 3열 표 */}
      <table className="hidden w-full table-fixed overflow-hidden rounded-2xl border border-line text-left sm:table">
        <thead>
          <tr className="bg-surface">
            <th className="w-[18%] px-5 py-3.5 text-[13px] font-medium text-muted">
              구분
            </th>
            <th className="px-5 py-3.5 text-[14px] font-semibold text-ink">
              {headers[0]}
            </th>
            <th className="px-5 py-3.5 text-[14px] font-semibold text-ink">
              {headers[1]}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-line bg-card">
              <th
                scope="row"
                className="px-5 py-4 text-[13px] font-normal text-muted"
              >
                {row.label}
              </th>
              <td className="px-5 py-4 text-[14px] leading-relaxed text-ink">
                {row.left}
              </td>
              <td className="px-5 py-4 text-[14px] leading-relaxed text-ink">
                {row.right}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 모바일 — 급성 / 만성 카드 2개로 분리 */}
      <div className="grid gap-4 sm:hidden">
        {([0, 1] as const).map((col) => (
          <div
            key={headers[col]}
            className="overflow-hidden rounded-2xl border border-line"
          >
            <p className="bg-surface px-5 py-3 text-[14px] font-semibold text-ink">
              {headers[col]}
            </p>
            <dl className="bg-card">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex gap-4 border-t border-line px-5 py-3.5"
                >
                  <dt className="w-16 shrink-0 text-[13px] text-muted">
                    {row.label}
                  </dt>
                  <dd className="text-[14px] leading-relaxed text-ink">
                    {col === 0 ? row.left : row.right}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </>
  );
}
