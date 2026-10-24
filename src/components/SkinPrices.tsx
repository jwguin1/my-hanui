import { HAIR_REMOVAL_PRICES, LIFTING_PACKAGE, SHURINK_PRICES, VOLNEWMER_PRICES, SKIN_CARE_INCLUDED, skinPrice } from "@/lib/pricing";

export function LiftingPrices() {
  return <div className="space-y-6">
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <table className="w-full text-left text-base text-ink">
        <caption className="bg-surface px-4 py-4 text-left font-bold">리프팅 단독 · 1회 시술</caption>
        <thead><tr className="border-y border-line text-sm"><th scope="col" className="p-4">시술</th><th scope="col" className="px-2 py-4">300샷</th><th scope="col" className="px-2 py-4">600샷</th></tr></thead>
        <tbody>{[SHURINK_PRICES, VOLNEWMER_PRICES].map(p => <tr key={p.name} className="border-b border-line last:border-0"><th scope="row" className="p-4 text-[15px] font-semibold">{p.name}</th><td className="px-2 py-5 whitespace-nowrap">{skinPrice(p.single)}</td><td className="px-2 py-5 whitespace-nowrap font-bold text-[#792d44]">{skinPrice(p.shots600)}</td></tr>)}</tbody>
      </table>
    </div>
    <div className="rounded-2xl border border-[#ddc5cd] bg-[#fbf5f6] p-5 sm:p-7">
      <p className="text-sm font-semibold text-[#792d44]">추천 패키지</p>
      <h3 className="mt-2 text-xl font-bold text-ink">{LIFTING_PACKAGE.name}</h3>
      <dl className="mt-6 grid gap-5 sm:grid-cols-2">
        <div><dt className="text-base text-muted">매회 각 300샷</dt><dd className="mt-2 text-3xl font-bold text-[#792d44]">{skinPrice(LIFTING_PACKAGE.shots300)}</dd></div>
        <div><dt className="text-base text-muted">매회 각 600샷</dt><dd className="mt-2 text-2xl font-bold text-ink">{skinPrice(LIFTING_PACKAGE.shots600)}</dd></div>
      </dl>
      <p className="mt-5 text-sm leading-relaxed text-muted">샷 수는 매회 기준입니다. 슈링크 3회와 볼뉴머 1회에 각각 선택한 샷 수가 적용됩니다.</p>
    </div>
    <p className="text-base leading-relaxed text-muted">{SKIN_CARE_INCLUDED}<br />시술 간격: 슈링크 2~3개월 · 볼뉴머 4~6개월</p>
    <p className="text-sm text-muted">모든 가격은 부가세 포함입니다.</p>
  </div>;
}

export function HairRemovalPrices() {
  return <div>
    <div className="hidden overflow-hidden rounded-2xl border border-line bg-white md:block">
      <table className="w-full text-left text-base text-black"><caption className="bg-surface p-4 text-left font-bold">남녀 공통 얼굴 레이저 제모</caption><thead><tr className="border-y border-line">{["부위", "선택", "1회", "5회", "1년 무제한"].map(h => <th key={h} scope="col" className="p-4 font-medium">{h}</th>)}</tr></thead><tbody>{HAIR_REMOVAL_PRICES.map(r => <tr key={r.area+r.option} className="border-b border-line last:border-0"><th scope="row" className="p-4 font-normal">{r.area}</th><td className="p-4">{r.option}</td>{[r.single,r.five,r.annual].map((v,i) => <td key={i} className="p-4 whitespace-nowrap">{skinPrice(v)}</td>)}</tr>)}</tbody></table>
    </div>
    <div className="grid gap-4 md:hidden">{HAIR_REMOVAL_PRICES.map(r => <div key={r.area+r.option} className="rounded-xl border border-line bg-white p-5 text-black"><h3 className="text-lg font-bold">{r.area} <span className="text-base font-normal">· {r.option}</span></h3><dl className="mt-4 space-y-3">{[["1회",r.single],["5회",r.five],["1년 무제한",r.annual]].map(([label,amount]) => <div key={label} className="flex justify-between gap-4 text-base"><dt>{label}</dt><dd>{skinPrice(Number(amount))}</dd></div>)}</dl></div>)}</div>
    <p className="mt-5 text-base leading-relaxed text-muted">케어 포함: {SKIN_CARE_INCLUDED}<br />얼굴전체는 이마 제외<br />최소 4주 간격 · 1년권은 첫 시술일부터 1년간 적용</p>
    <p className="mt-3 text-sm text-muted">모든 가격은 부가세 포함입니다.</p>
  </div>;
}
