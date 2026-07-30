export type CompareRow = { label: string; left: string; right: string };

/**
 * 급성/만성 등 2열 비교표.
 *
 * 같은 텍스트를 데스크톱 표와 모바일 카드로 두 번 렌더하면 HTML 에 중복 노출되므로,
 * DOM 은 하나만 두고 CSS(grid + 라벨 표시 전환)로 레이아웃을 바꾼다.
 * - sm 이상: 3열 그리드 (구분 / 왼쪽 / 오른쪽) + 헤더행
 * - sm 미만: 행마다 세로 스택, 각 값 앞에 열 이름을 붙여 보여준다
 */
export default function CompareTable({
  rows,
  headers = ["급성", "만성"],
}: {
  rows: CompareRow[];
  headers?: [string, string];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      {/* 헤더행 — sm 미만에서는 감춘다 (모바일은 값마다 열 이름을 붙임) */}
      <div className="hidden bg-surface sm:grid sm:grid-cols-[18%_41%_41%]">
        <p className="px-5 py-3.5 text-[13px] font-medium text-muted">구분</p>
        <p className="px-5 py-3.5 text-[14px] font-semibold text-ink">
          {headers[0]}
        </p>
        <p className="px-5 py-3.5 text-[14px] font-semibold text-ink">
          {headers[1]}
        </p>
      </div>

      <dl className="bg-card">
        {rows.map((row) => (
          <div
            key={row.label}
            className="border-t border-line first:border-t-0 sm:grid sm:grid-cols-[18%_41%_41%] sm:first:border-t"
          >
            <dt className="px-5 pt-4 text-[13px] text-muted sm:py-4">
              {row.label}
            </dt>
            <dd className="px-5 pt-2 text-[14px] leading-relaxed text-ink sm:py-4 sm:pt-4">
              <span className="mr-1.5 text-[13px] text-muted sm:hidden">
                {headers[0]}
              </span>
              {row.left}
            </dd>
            <dd className="px-5 pb-4 pt-1.5 text-[14px] leading-relaxed text-ink sm:py-4">
              <span className="mr-1.5 text-[13px] text-muted sm:hidden">
                {headers[1]}
              </span>
              {row.right}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
