import Link from "next/link";
import PriceTable from "@/components/ui/PriceTable";
import { PAIN_PRICES, HERBAL_PRICES, PAIN_INSURANCE_NOTE, PHARMACOPUNCTURE_NOTE, HERBAL_INSURANCE_CONDITIONS, HERBAL_INSURANCE_LIMIT, won } from "@/lib/pricing";

export function TreatmentPriceLink({ herbal = false }: { herbal?: boolean }) {
  return (
    <nav aria-label="진료 비용 바로가기" className="border-y border-line bg-card px-6 py-4 text-center">
      <Link href={herbal ? "#herbal-prices" : "#prices"} className="inline-block text-[16px] font-semibold text-primary underline underline-offset-4">
        {herbal ? "건강보험 한약·1~3개월 한약 비용 보기" : "초진·추나·초음파 유도 약침 비용 보기"}
      </Link>
    </nav>
  );
}

export function PainPrices() {
  return (
    <section id="prices" aria-labelledby="pain-prices-title" className="scroll-mt-24 bg-[var(--surface)]">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-sm font-semibold text-primary">통증 치료 비용</p>
          <h2 id="pain-prices-title" className="mt-3 text-center font-serif text-3xl font-semibold text-ink">처음 진료부터 추나·약침까지</h2>
          <p className="mt-4 text-center text-[16px] leading-relaxed text-muted">받으실 치료의 비용을 미리 확인하세요.</p>
          <div className="mt-8 space-y-6">
            <PriceTable caption="일반 근골격계 진료·추나치료" rows={[
              { name: "일반 근골격계 초진", price: won(PAIN_PRICES.firstVisit) },
              { name: "단순추나", price: won(PAIN_PRICES.simpleChuna) },
              { name: "복잡추나", price: won(PAIN_PRICES.complexChuna) },
            ]} />
            <p className="text-[15px] leading-relaxed text-ink">{PAIN_INSURANCE_NOTE}</p>
            <PriceTable caption="초음파 유도 약침 · 1회" rows={[
              { name: "기본 통원약침", includes: "포도당 5%", price: won(PAIN_PRICES.dextrose) },
              { name: "PDRN 약침", price: won(PAIN_PRICES.pdrn) },
            ]} />
            <p className="text-[15px] font-medium leading-relaxed text-ink">{PHARMACOPUNCTURE_NOTE}</p>
          </div>
          <p className="mt-6 text-center text-[15px]"><Link href="/internal/dyspepsia#herbal-prices" className="font-medium text-primary underline underline-offset-4">한약 처방 비용도 확인하기</Link></p>
        </div>
      </div>
    </section>
  );
}

export function HerbalPrices() {
  return (
    <section id="herbal-prices" aria-labelledby="herbal-prices-title" className="scroll-mt-24 bg-[var(--surface)]">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-sm font-semibold text-primary">한약 비용</p>
          <h2 id="herbal-prices-title" className="mt-3 text-center font-serif text-3xl font-semibold text-ink">건강보험 한약과 기간별 한약 안내</h2>
          <div className="mt-8 space-y-6">
            <PriceTable caption="건강보험 한약" rows={[
              { name: "10일 처방", includes: "건강보험 적용 후 본인부담금", price: HERBAL_PRICES.insuredTenDays },
            ]} />
            <div className="rounded-xl border border-line bg-card p-5 text-[15px] leading-relaxed text-ink">
              <h3 className="font-semibold">건강보험 적용 대상과 횟수</h3>
              <p className="mt-2">{HERBAL_INSURANCE_CONDITIONS.join(" · ")} 등 6개 질환이 대상입니다.</p>
              <p className="mt-2">{HERBAL_INSURANCE_LIMIT}</p>
            </div>
            <PriceTable caption="한약 처방" rows={[
              { name: "1개월", price: won(HERBAL_PRICES.oneMonth) },
              { name: "2개월", price: won(HERBAL_PRICES.twoMonths) },
              { name: "3개월", price: won(HERBAL_PRICES.threeMonths) },
            ]} />
          </div>
          <p className="mt-6 text-center text-[15px]"><Link href="/pain/chronic#prices" className="font-medium text-primary underline underline-offset-4">추나·초음파 유도 약침 비용 보기</Link></p>
        </div>
      </div>
    </section>
  );
}
