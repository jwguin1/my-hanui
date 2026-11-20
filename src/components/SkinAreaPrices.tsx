import PriceTable from "@/components/ui/PriceTable";
import Image from "next/image";
import { FLAT_WART_PRICE_GROUPS, PIGMENTATION_AREA_PRICES, PIGMENTATION_PACKAGE_NOTE, PIGMENTATION_COUPON_NOTE, SPOT_RETOUCH_POLICY, painWon } from "@/lib/pricing";

export function FlatWartPrices() {
  return <div className="space-y-6" data-price-kind="flat-wart">
    <p className="text-base leading-relaxed text-ink">얼굴부터 몸까지, 필요한 부위를 선택하세요.<br /><strong>선택한 부위 내 편평사마귀를 개수 제한 없이 제거합니다.</strong></p>
    <div className="grid items-start gap-6 md:grid-cols-2">{FLAT_WART_PRICE_GROUPS.map(group => <PriceTable key={group.title} caption={group.title} rows={group.rows.map(row => ({ ...row, price: painWon(row.price) }))} />)}</div>
    <p className="text-base leading-relaxed text-ink">얼굴＋상반신 전체는 얼굴·목·윗가슴·복부·등·허리를 포함하며, 팔은 제외됩니다.</p>
    <PriceTable caption="편평사마귀 리터치" rows={[{ name: "개별 병변", price: `개당 ${painWon(SPOT_RETOUCH_POLICY.perLesion)}` }, { name: "개수 무제한", price: `1회 ${painWon(SPOT_RETOUCH_POLICY.unlimited)}` }]} />
    <p className="text-base leading-relaxed text-muted">최초 시술 후 6개월 이내, 기존에 시술받은 부위에 적용됩니다. 리터치 비용은 방문 시마다 적용되며, ‘개수 무제한’은 해당 회차의 제거 개수를 의미합니다.</p>
    <p className="text-base leading-relaxed text-muted">모든 금액은 부가세 포함입니다. 시술 전 진찰을 통해 병변 종류와 시술 범위를 확인한 후 진행합니다.</p>
    <PricePoster kind="flat-wart" />
  </div>;
}

export function PigmentationAreaPrices() {
  return <div className="space-y-5" data-price-kind="pigmentation">
    <PriceTable caption="색소·착색 제거 치료 · 부위별 1회 가격" rows={PIGMENTATION_AREA_PRICES.map(row => ({ ...row, price: painWon(row.price) }))} />
    <p className="text-base font-semibold leading-relaxed text-ink">얼굴·목은 전체, 나머지 부위는 양쪽 기준입니다. 모든 금액은 부가세 포함입니다.</p>
    <div className="rounded-xl border border-line bg-surface p-5 text-base leading-relaxed"><p className="font-semibold text-primary">{PIGMENTATION_PACKAGE_NOTE}</p><p className="mt-3 text-ink">{PIGMENTATION_COUPON_NOTE}</p></div>
    <PricePoster kind="pigmentation" />
  </div>;
}

function PricePoster({ kind }: { kind: "flat-wart" | "pigmentation" }) {
  const wart = kind === "flat-wart";
  return <details className="rounded-xl border border-line bg-white p-4">
    <summary className="cursor-pointer py-2 text-base font-semibold text-primary">부위별 가격표 그림 보기</summary>
    <a href={`/images/skin/${kind}-prices-20261121.png`} target="_blank" rel="noopener noreferrer" className="mt-4 block" aria-label={`${wart ? "편평사마귀" : "색소·착색"} 가격표 원본 크게 보기`}>
      <Image src={`/images/skin/${kind}-prices-20261121.png`} width={wart ? 992 : 1054} height={wart ? 1585 : 1492} alt={wart ? "편평사마귀 제거 부위와 가격, 리터치 안내 그림. 상세 가격은 위 본문에 표시되어 있습니다." : "색소·착색 치료 부위와 양쪽 기준 가격 안내 그림. 상세 가격은 위 본문에 표시되어 있습니다."} sizes="(max-width: 768px) 90vw, 700px" className="h-auto w-full" />
    </a>
    <p className="mt-2 text-sm text-muted">그림을 누르면 크게 볼 수 있습니다.</p>
  </details>;
}
