import type { ReactNode } from "react";
import Link from "next/link";
import SectionJumpNav from "@/components/SectionJumpNav";
import PageHeader from "@/components/ui/PageHeader";
import PriceTable from "@/components/ui/PriceTable";
import ConsultationActions from "@/components/ConsultationActions";
import JsonLd from "@/components/JsonLd";
import { buildGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/page-metadata";
import { CLINIC, CLINIC_HOURS_WEEKDAY, CLINIC_HOURS_WEEKEND, CLINIC_HOURS_LUNCH } from "@/lib/clinic";
import { CARE_GUIDE } from "@/lib/care-guide";
import { HOME_VISIT, HOME_VISIT_PRICES } from "@/lib/home-visit";
import { SHURINK_CARE } from "@/lib/skin-guides";
import {
  PAIN_PRICES, PAIN_INSURANCE_NOTE, PHARMACOPUNCTURE_NOTE,
  HERBAL_PRICES, HERBAL_INSURANCE_CONDITIONS, HERBAL_INSURANCE_LIMIT,
  DIET_PRICES, SPOT_PRICE_ROWS, SPOT_PRICE_HEADERS, AFTERCARE_PRODUCTS,
  PIGMENTATION_PRICES, SHURINK_PRICES, painWon, won,
} from "@/lib/pricing";

const description = `일산한의원 초진 ${painWon(PAIN_PRICES.firstVisit)}, 단순추나 ${painWon(PAIN_PRICES.simpleChuna)}, 복잡추나 ${painWon(PAIN_PRICES.complexChuna)}. 보험한약·체질보약·다이어트·피부 시술 비용과 방문 소요 시간을 한눈에 확인하세요.`;
export const metadata = pageMetadata({ path: "/pricing", title: "진료비·시간 안내 | 통증·한약·피부 치료 비용", description });

function PriceSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} className="scroll-mt-36 border-b border-line py-10 last:border-0 md:scroll-mt-24">
    <h2 className="font-serif text-2xl font-semibold text-ink">{title}</h2>
    <div className="mt-6 space-y-5 text-base leading-relaxed text-muted md:text-[15px]">{children}</div>
  </section>;
}
function DetailLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link href={href} className="inline-block font-medium text-primary underline underline-offset-4">{children} →</Link>;
}

export default function PricingPage() {
  return <>
    <JsonLd graph={buildGraph({ path: "/pricing", name: "진료비·시간 안내 – 일산한의원", description })} />
    <PageHeader badge="방문 전 안내" lead="진료비와 소요 시간," accent="미리 확인하세요" stacked description="받으실 치료의 비용과 포함 항목을 살펴보고, 방문 일정을 편하게 정하세요." />
    <SectionJumpNav label="진료비 안내 항목" items={[["pain", "통증·추나·약침"], ["home-visit", "방문진료"], ["herbal", "보험한약·체질보약"], ["diet", "다이어트"], ["skin", "잡티·토닝·리프팅"], ["hours", "진료·접수 시간"]]} />
    <div className="mx-auto max-w-4xl px-6">
      <PriceSection id="pain" title="통증치료 · 추나 · 초음파 유도 약침">
        <PriceTable caption="건강보험 진료 · 본인부담금" rows={[
          { name: "일반 근골격계 초진", price: painWon(PAIN_PRICES.firstVisit) },
          { name: "단순추나", includes: "기본 진료비 포함", price: painWon(PAIN_PRICES.simpleChuna) },
          { name: "복잡추나", includes: "기본 진료비 포함", price: painWon(PAIN_PRICES.complexChuna) },
        ]} />
        <p>{PAIN_INSURANCE_NOTE}</p>
        <PriceTable caption="초음파 유도 약침 · 1회 비급여" rows={[
          { name: "기본 통원약침", includes: "포도당 5%", price: painWon(PAIN_PRICES.dextrose) },
          { name: "PDRN 약침", price: painWon(PAIN_PRICES.pdrn) },
        ]} />
        <p className="font-medium text-ink">{PHARMACOPUNCTURE_NOTE}</p>
        <div className="rounded-2xl bg-[var(--surface)] p-5">
          <h3 className="font-semibold text-ink">방문 시간과 기본 구성</h3>
          <p className="mt-3">{CARE_GUIDE.time}</p>
          <p className="mt-3">{CARE_GUIDE.basic}</p>
          <p className="mt-3">{CARE_GUIDE.extra}</p>
        </div>
        <div className="flex flex-wrap gap-5"><DetailLink href="/pain/acute#visit-guide">통증 치료 과정</DetailLink><DetailLink href="/pain/chronic#treatment-photos">추나·약침 치료 모습</DetailLink><DetailLink href="/accident">교통사고 자동차보험 안내</DetailLink></div>
      </PriceSection>
      <PriceSection id="home-visit" title="집으로 찾아가는 방문진료">
        <p>거동이 불편해 내원이 어려운 분을 위한 한의 방문진료 시범사업 비용입니다.</p>
        <PriceTable caption="방문진료 · 본인부담금" rows={HOME_VISIT_PRICES.map(p => ({ name: p.label, includes: p.rate, price: p.price }))} />
        <p>{HOME_VISIT.costNote} 장기요양 1·2등급은 와상 여부를 확인하며, 산소치료·인공호흡기 요양비 급여 대상자도 15%가 적용됩니다.</p>
        <DetailLink href="/home-visit#cost">보험 적용 기준·포함 비용·방문 신청</DetailLink>
      </PriceSection>
      <PriceSection id="herbal" title="보험한약 · 체질보약">
        <PriceTable caption="건강보험 한약" rows={[{ name: "10일 처방", includes: "건강보험 적용 후 본인부담금", price: HERBAL_PRICES.insuredTenDays }]} />
        <p>적용 대상은 {HERBAL_INSURANCE_CONDITIONS.join("·")}입니다. {HERBAL_INSURANCE_LIMIT}</p>
        <DetailLink href="/herbal/insurance">보험한약 대상 질환과 질문</DetailLink>
        <PriceTable caption="체질보약 · 비급여 한약" rows={[
          { name: "1개월", includes: "60팩", price: won(HERBAL_PRICES.oneMonth) },
          { name: "2개월", price: won(HERBAL_PRICES.twoMonths) },
          { name: "3개월", price: won(HERBAL_PRICES.threeMonths) },
        ]} />
        <p>{CARE_GUIDE.herbalProcess} {CARE_GUIDE.herbalTiming}</p>
        <DetailLink href="/herbal/tonic">체질맞춤·두통·어지럼·갱년기 한약</DetailLink>
      </PriceSection>
      <PriceSection id="diet" title="다이어트 처방">
        <PriceTable caption="일산감비환 · 1상자 100포" rows={[
          { name: "노랑 감비환", price: won(DIET_PRICES.yellow) },
          { name: "분홍 감비환", price: won(DIET_PRICES.pink) },
        ]} />
        <p>첫 상담은 약 {DIET_PRICES.consultationMinutes}분입니다. 식사·수면 패턴과 복용 중인 약을 확인하고 처방을 상담합니다. 접수나 추가 검사 시간은 별도입니다.</p>
        <p>100포는 하루 1포 기준 100일, 하루 2포 기준 50일 분량입니다. 복용량은 진료 후 정합니다.</p>
        <DetailLink href="/diet/program">다이어트 처방과 복용 안내</DetailLink>
      </PriceSection>
      <PriceSection id="skin" title="잡티제거 · 색소치료 · 리프팅">
        <PriceTable caption="CO₂ 레이저 잡티제거 · 비급여" headers={SPOT_PRICE_HEADERS} rows={SPOT_PRICE_ROWS.map(row => ({ name: row.name, price: won(row.upTo100), price2: won(row.unlimited) }))} />
        <p>점·편평사마귀·쥐젖을 살펴보고 치료 범위를 정합니다. 시술 시간은 부위와 개수에 따라 방문 전 안내해드립니다.</p>
        <p>재생크림은 별도 구매입니다. {AFTERCARE_PRODUCTS.map(p => `${p.name} ${p.volume} ${won(p.price)}`).join(" · ")}.</p>
        <DetailLink href="/skin/spot">잡티제거 과정과 관리</DetailLink>
        <PriceTable caption="피코 트리플 토닝 · 비급여" rows={[
          { name: "1회", price: won(PIGMENTATION_PRICES.single) },
          { name: "10회", price: won(PIGMENTATION_PRICES.tenSessions) },
        ]} />
        <p>{PIGMENTATION_PRICES.selection} {PIGMENTATION_PRICES.booster}</p>
        <p>레이저 시술 시간은 20분 이내이며, 상담·준비 시간은 별도입니다.</p>
        <DetailLink href="/skin/pigmentation">피코토닝·제네시스 질문과 답</DetailLink>
        <PriceTable caption="슈링크 유니버스 · 1회 300샷 · 비급여" rows={[
          { name: "1회", price: won(SHURINK_PRICES.single) },
          { name: "3회", price: won(SHURINK_PRICES.threeSessions) },
        ]} />
        <p>{SHURINK_CARE.steps.map(s => `${s.title} ${s.minutes}분`).join(" → ")}. 전체 약 {SHURINK_CARE.totalMinutes}분이며, 재시술은 {SHURINK_CARE.intervalWeeks}주 간격으로 안내합니다.</p>
        <DetailLink href="/skin/lifting">슈링크 효과·시간·횟수 안내</DetailLink>
      </PriceSection>
      <PriceSection id="hours" title="진료시간과 접수 마감">
        <dl className="space-y-3 text-base text-ink">
          <div className="flex flex-wrap justify-between gap-2"><dt>평일</dt><dd>{CLINIC_HOURS_WEEKDAY}</dd></div>
          <div className="flex flex-wrap justify-between gap-2"><dt>토·일·공휴일</dt><dd>{CLINIC_HOURS_WEEKEND}</dd></div>
          <div className="flex flex-wrap justify-between gap-2"><dt>평일 점심시간</dt><dd>{CLINIC_HOURS_LUNCH}</dd></div>
        </dl>
        <p className="font-semibold text-ink">{CLINIC.receptionNote}</p>
        <p>주말·공휴일은 점심시간 없이 진료합니다. {CLINIC.holidayClosedNote} {CLINIC.closedNote}</p>
        <DetailLink href="/contact">위치·주차·방문 준비 안내</DetailLink>
      </PriceSection>
    </div>
    <section className="bg-[var(--surface)] px-6 py-12 text-center">
      <h2 className="font-serif text-2xl font-semibold text-ink">내 진료의 비용과 시간이 궁금하신가요?</h2>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">불편한 부위와 받고 싶은 진료, 방문 희망 시간을 카카오톡으로 남겨주세요. 진료시간 내 의료진이 직접 상담합니다.</p>
      <ConsultationActions directions className="mt-6" />
    </section>
  </>;
}
