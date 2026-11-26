import PriceTable from "@/components/ui/PriceTable";
import Image from "next/image";
import { FLAT_WART_FACE_PRICES, FLAT_WART_PRICE_GROUPS, EXTRA_REMOVAL_TARGETS, EXTRA_REMOVAL_PRICES, LENTIGO_PRICES, PIGMENTATION_PRICE_GROUPS, PIGMENTATION_PACKAGE_NOTE, PIGMENTATION_COUPON_NOTE, SPOT_PRICE_ROWS, SPOT_PRICE_HEADERS, SPOT_PRICE_NOTE, SPOT_RETOUCH_POLICY, painWon, won } from "@/lib/pricing";

const areaGuide = "/images/skin/flat-wart-area-guide.webp";

// Viewports in the original 2480 × 3508 illustration. Both views share one download.
function AreaDiagram({ area }: { area: "face" | "body" }) {
  const [x, y, width, height] = area === "face" ? [1140, 680, 365, 365] : [1033, 684, 1218, 1165];
  return (
    <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: `${width} / ${height}` }}>
      <Image src={areaGuide} width={1600} height={2263} unoptimized
        alt={area === "face" ? "이마에서 턱선까지 보라색으로 표시한 얼굴 시술 범위" : "앞면은 목·윗가슴·복부, 뒷면은 등·허리로 나눈 편평사마귀 시술 부위"}
        className="absolute h-auto max-w-none"
        style={{ width: `${2480 / width * 100}%`, left: `${-x / width * 100}%`, top: `${-y / height * 100}%` }} />
    </div>
  );
}

export function SpotRemovalPrices() {
  const [torso, ...otherGroups] = FLAT_WART_PRICE_GROUPS;
  return <div className="space-y-6 tabular-nums [&_li>p]:text-lg" data-price-kind="flat-wart">
    <section aria-label="점·편평사마귀·검버섯 기본 가격" className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="flex items-center gap-4 border-b border-line bg-surface px-5 py-4 sm:gap-6">
        <div className="w-20 shrink-0 sm:w-28"><AreaDiagram area="face" /></div>
        <div><h3 className="text-xl font-bold text-ink">점·편평사마귀·검버섯 기본 제거비</h3><p className="mt-1 text-base text-muted">첫 시술 기준 · 부가세 포함</p></div>
      </div>
      <dl className="divide-y divide-line px-5">
        {FLAT_WART_FACE_PRICES.map(row => <div key={row.name} className="flex items-baseline justify-between gap-3 py-4">
          <dt className="text-base font-medium text-ink">{row.name}</dt>
          <dd className="whitespace-nowrap text-xl font-bold text-primary">{painWon(row.price)}</dd>
        </div>)}
      </dl>
    </section>
    <section aria-label="돌출점·쥐젖·비립종 추가 비용">
      <h3 className="text-xl font-bold text-ink">돌출점·쥐젖·비립종 추가 비용</h3>
      <p className="mb-4 mt-2 text-base leading-relaxed text-muted">{EXTRA_REMOVAL_TARGETS}은 기본 제거비에 아래 금액을 더합니다. 1~4개는 개당 금액, 5개부터는 해당 구간의 합계입니다.</p>
      <PriceTable caption="제거 개수별 추가 금액" rows={EXTRA_REMOVAL_PRICES.map(row => ({ name: row.name, price: painWon(row.price) }))} />
    </section>
    <details className="rounded-xl border border-line bg-card px-5">
      <summary className="cursor-pointer py-4 text-base font-semibold text-primary">얼굴과 목을 함께 제거할 때의 기본 가격</summary>
      <div className="pb-5"><PriceTable caption="점·편평사마귀·검버섯 얼굴·목 기본 제거비" headers={SPOT_PRICE_HEADERS}
        rows={SPOT_PRICE_ROWS.map(row => ({name: row.name, price: won(row.upTo100), price2: won(row.unlimited)}))}
        note={SPOT_PRICE_NOTE} /></div>
    </details>
    <div className="pt-3"><h3 className="text-xl font-bold text-ink">목·몸통·팔·다리 기본 제거비</h3>
      <p className="mt-2 text-base leading-relaxed text-muted">아래 금액은 선택한 부위의 점·편평사마귀·검버섯을 한 번에 개수 제한 없이 제거하는 비용입니다.</p>
    </div>
    <div className="grid items-start gap-5 sm:grid-cols-2">
      <figure className="mx-auto w-full max-w-sm"><AreaDiagram area="body" />
        <figcaption><a href={areaGuide} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-base font-semibold text-primary underline underline-offset-4">팔·다리까지 부위별 무제한 가격표 크게 보기</a></figcaption>
      </figure>
      <PriceTable caption={torso.title} rows={torso.rows.map(row => ({ ...row, price: painWon(row.price) }))} />
      {otherGroups.map(group => <PriceTable key={group.title} caption={group.title} rows={group.rows.map(row => ({ ...row, price: painWon(row.price) }))} />)}
    </div>
    <PriceTable caption="편평사마귀 리터치" rows={[{ name: "개별 병변", price: `개당 ${painWon(SPOT_RETOUCH_POLICY.perLesion)}` }, { name: "개수 무제한", price: `1회 ${painWon(SPOT_RETOUCH_POLICY.unlimited)}` }]} />
    <p className="text-base leading-relaxed text-muted">최초 시술 후 6개월 이내, 기존에 시술받은 부위에 적용됩니다. 리터치 비용은 방문 시마다 적용되며, ‘개수 무제한’은 해당 회차의 제거 개수를 의미합니다.</p>
    <p className="text-base leading-relaxed text-muted">모든 금액은 부가세 포함입니다. 시술 전 진찰을 통해 병변 종류와 시술 범위를 확인한 후 진행합니다.</p>
  </div>;
}

export function PigmentationAreaPrices() {
  return <div className="space-y-5 tabular-nums [&_li>p]:text-lg" data-price-kind="pigmentation">
    <PriceTable caption="흑자 1개 치료 비용 · 크기 기준" rows={LENTIGO_PRICES.map(row => ({ name: row.name, price: painWon(row.price) }))} />
    <section aria-label="색소·착색 부위별 1회 가격">
      <h3 className="text-xl font-bold text-ink">색소·착색 치료 부위별 1회 가격</h3>
      <p className="mb-4 mt-2 text-base leading-relaxed text-muted">얼굴과 목은 전체, 겨드랑이·팔·사타구니·다리는 양쪽 가격입니다. 모두 부가세 포함입니다.</p>
      <div className="space-y-4">
        {PIGMENTATION_PRICE_GROUPS.map(group => (
          <section key={group.image} className="overflow-hidden rounded-2xl border border-line bg-card">
            <h4 className="border-b border-line bg-surface px-4 py-3 text-lg font-semibold text-ink">{group.name}</h4>
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2.6fr)] items-center gap-3 p-3 sm:gap-6 sm:p-5">
              <Image src={`/images/skin/pigment-region-${group.image}.webp`} alt={group.alt} width={group.width} height={group.height} unoptimized
                className="mx-auto h-auto max-h-56 w-auto max-w-full object-contain" />
              <dl className="divide-y divide-line">
                {group.rows.map(row => (
                  <div key={row.name} className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 py-3">
                    <dt className="text-base font-medium text-ink">{row.name}</dt>
                    <dd className="ml-auto whitespace-nowrap text-lg font-bold text-primary">{painWon(row.price)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        ))}
      </div>
    </section>
    <div className="rounded-xl border border-line bg-surface p-5 text-base leading-relaxed"><p className="font-semibold text-primary">{PIGMENTATION_PACKAGE_NOTE}</p><p className="mt-3 text-ink">{PIGMENTATION_COUPON_NOTE}</p></div>
    <PigmentationPoster />
  </div>;
}

function PigmentationPoster() {
  const src = "/images/skin/pigmentation-prices-20261121.png";
  return <details className="rounded-xl border border-line bg-white p-4">
    <summary className="cursor-pointer py-2 text-base font-semibold text-primary">부위별 가격표 그림 보기</summary>
    <a href={src} target="_blank" rel="noopener noreferrer" className="mt-4 block" aria-label="색소·착색 가격표 원본 크게 보기">
      <Image src={src} width={1054} height={1492} alt="색소·착색 치료 부위와 양쪽 기준 가격 안내 그림. 상세 가격은 위 본문에 표시되어 있습니다." sizes="(max-width: 768px) 90vw, 700px" className="h-auto w-full" />
    </a>
    <p className="mt-2 text-sm text-muted">그림을 누르면 크게 볼 수 있습니다.</p>
  </details>;
}
