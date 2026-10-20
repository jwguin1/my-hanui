import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ConsultationActions from "@/components/ConsultationActions";
import JsonLd from "@/components/JsonLd";
import { buildGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/page-metadata";
import { CARE_GUIDE } from "@/lib/care-guide";
import { PAIN_PRICES, painWon } from "@/lib/pricing";

import { HOME_VISIT } from "@/lib/home-visit";

const description = "일산한의원의 기본 보험진료, 추나, 초음파 유도 약침, 원내 탕전 한약과 피부레이저 진료를 안내합니다. 치료 과정과 비용을 먼저 확인하세요.";
export const metadata: Metadata = pageMetadata({ path: "/treatment", title: "진료 안내 | 기본 치료·추나·약침·한약", description });
const treatments = [
  { title: "방문진료", body: `거동이 불편해 한의원에 오기 어려운 분을 위해 한의사가 집으로 찾아갑니다. ${HOME_VISIT.area}에서 상담하실 수 있습니다. ${HOME_VISIT.areaNote}`, note: "한의 방문진료 시범사업 참여기관 · 건강보험·의료급여 적용", href: "/home-visit", label: "방문 대상·비용·상담 신청" },
  { title: "기본 통증 치료", body: `${CARE_GUIDE.basic} ${CARE_GUIDE.time}`, note: `일반 근골격계 초진 본인부담금 ${painWon(PAIN_PRICES.firstVisit)}`, href: "/pain/acute", label: "통증 치료 과정과 비용" },
  { title: "추나치료", body: CARE_GUIDE.selection, note: `단순추나 ${painWon(PAIN_PRICES.simpleChuna)} · 복잡추나 ${painWon(PAIN_PRICES.complexChuna)}. 건강보험 적용 후 본인부담금이며 기본 진료비가 포함됩니다.`, href: "/pain/chronic#prices", label: "추나·약침 비용 확인" },
  { title: "초음파 유도 약침", body: "진찰과 초음파 검사로 필요한 부위를 확인하고 약침 치료를 계획합니다. 기본 통원약침은 포도당 5%를 사용하며, PDRN 약침도 시행합니다.", note: `1회 비급여 비용: 기본 통원약침 ${painWon(PAIN_PRICES.dextrose)} · PDRN 약침 ${painWon(PAIN_PRICES.pdrn)}. 보험 진료비는 별도입니다.`, href: "/pain/chronic", label: "초음파 진료와 치료 기준" },
  { title: "추가 물리치료실", body: CARE_GUIDE.extra, note: "추가 물리치료까지 받으시면 접수부터 전체 약 1시간 10분입니다.", href: "/pain/acute#visit-guide", label: "방문 시간과 이용 안내" },
  { title: "보험한약", body: "소화불량·생리통 등 건강보험 대상 6개 질환의 진단과 적용 여부를 확인해 처방합니다.", note: "10일 처방 본인부담금 4만원대", href: "/herbal/insurance", label: "6개 대상 질환과 보험 적용" },
  { title: "체질보약", body: `${CARE_GUIDE.herbalProcess} ${CARE_GUIDE.herbalTiming}`, note: "체질맞춤보약 · 두통·어지럼 · 갱년기 한약", href: "/herbal/tonic", label: "비급여 한약 구성과 가격" },
];
export default function TreatmentPage() {
  return <>
    <JsonLd graph={buildGraph({ path: "/treatment", name: "진료 안내 – 일산한의원", description })} />
    <PageHeader badge="진료 안내" lead="내 증상에 맞는 치료와" accent="비용을 확인하세요" stacked description={description} />
    <div className="mx-auto grid max-w-5xl gap-5 px-6 py-10 md:grid-cols-2">{treatments.map(t => <section key={t.title} className="rounded-2xl border border-line bg-card p-6"><h2 className="font-serif text-xl font-semibold text-ink">{t.title}</h2><p className="mt-4 text-base leading-relaxed text-muted">{t.body}</p><p className="mt-4 text-sm font-medium leading-relaxed text-ink">{t.note}</p><Link href={t.href} className="mt-5 inline-block text-primary underline underline-offset-4">{t.label} →</Link></section>)}</div>
    <nav aria-label="다른 진료 안내" className="mx-auto flex max-w-5xl flex-wrap gap-5 px-6 pb-10 text-primary"><Link href="/accident">교통사고 →</Link><Link href="/diet/program">다이어트 →</Link><Link href="/skin/spot">잡티제거·색소치료·리프팅 →</Link><Link href="/aftercare">치료 후 관리 →</Link></nav>
    <section className="bg-[var(--surface)] px-6 py-12 text-center"><h2 className="text-xl font-semibold text-ink">어떤 진료가 필요한지 편하게 물어보세요</h2><p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted">불편한 부위와 증상이 시작된 시기, 방문 희망일을 남겨주세요. 진료시간 내 의료진이 직접 상담합니다.</p><ConsultationActions directions className="mt-6" /></section>
  </>;
}
