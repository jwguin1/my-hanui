import Link from "next/link";
import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import ConsultationActions from "@/components/ConsultationActions";
import JsonLd from "@/components/JsonLd";
import { buildGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/page-metadata";
import { CARE_GUIDE } from "@/lib/care-guide";

const description = "침·약침, CO₂ 잡티제거, 피코토닝·제네시스, 슈링크·볼뉴머·얼굴 제모 시술 후 궁금한 관리 방법과 경과 확인 안내를 모았습니다.";
export const metadata: Metadata = pageMetadata({ path: "/aftercare", title: "치료 후 관리 | 침·약침·리프팅·제모", description });
const guides = [
  { id: "spot", title: "CO₂ 점·잡티제거 후", text: "딱지와 재생테이프, 세안·화장과 자외선 차단이 궁금하신가요? 시술 부위를 관리하는 순서를 확인하세요.", href: "/skin/점뺀후-딱지-선크림", label: "딱지·재생테이프·선크림 안내" },
  { id: "toning", title: "피코토닝·제네시스 후", text: "토닝 후 색이 진해 보이거나 딱지가 생겼을 때 살펴볼 점과 보습·자외선 관리에 대한 질문을 정리했습니다.", href: "/skin/토닝후-색소침착-딱지", label: "토닝 후 피부 변화와 관리" },
  { id: "hair-removal", title: "얼굴 레이저 제모 후", text: "보습과 자외선 차단을 챙기고, 피부가 진정되는 동안 강한 마찰을 줄여주세요. 최소 4주 간격으로 다음 일정을 계획합니다.", href: "/skin/hair-removal#questions", label: "제모 후 관리와 다음 시술 간격" },
  { id: "volnewmer", title: "볼뉴머 후", text: "붉은기와 열감이 가라앉는 동안 보습과 자외선 차단으로 관리합니다. 다음 시술은 4~6개월 간격을 기준으로 피부 탄력을 살펴 계획합니다.", href: "/skin/lifting#questions", label: "볼뉴머 관리와 시술 간격" },
  { id: "lifting", title: "슈링크 유니버스 후", text: "시술 후 일상생활과 다음 방문 일정을 확인하세요. 일산한의원에서는 2~3개월 간격으로 재시술을 안내하며 얼굴선과 탄력의 변화를 살펴봅니다.", href: "/skin/슈링크-시간-횟수-주기", label: "슈링크 일상 복귀와 재시술 주기" },
];
export default function AftercarePage() {
  return <>
    <JsonLd graph={buildGraph({ path: "/aftercare", name: "치료 후 관리 – 일산한의원", description })} />
    <PageHeader badge="치료 후 안내" lead="치료받은 뒤 궁금한 점을" accent="여기서 확인하세요" stacked description={description} />
    <nav aria-label="치료별 관리 바로가기" className="flex flex-wrap justify-center gap-5 px-6 pb-6 text-primary"><Link href="#pain">침·약침</Link>{guides.map(g => <Link key={g.id} href={`#${g.id}`}>{g.title}</Link>)}</nav>
    <div className="mx-auto max-w-4xl space-y-5 px-6 pb-12">
      <section id="pain" className="scroll-mt-24 rounded-2xl border border-line bg-card p-6"><h2 className="font-serif text-xl font-semibold text-ink">침·약침 치료 후</h2><p className="mt-4 text-base leading-relaxed text-muted">침을 맞은 자리에 작은 멍이나 소량의 출혈이 생길 수 있습니다. 출혈이 있으면 깨끗한 거즈로 가볍게 눌러주세요. 붉은기·열감·붓기가 커지거나 열이 나면 진료가 필요합니다.</p><p className="mt-3 text-base leading-relaxed text-muted">약침을 받은 부위와 시각, 이후 달라진 증상을 알려주시면 경과를 확인하는 데 도움이 됩니다. 갑작스러운 호흡곤란이나 얼굴·입술 부종이 있으면 즉시 응급 진료를 받으세요.</p><p className="mt-4 text-base leading-relaxed text-muted">{CARE_GUIDE.acuteReview} {CARE_GUIDE.chronicReview}</p><Link href="/pain/acute#visit-guide" className="mt-4 inline-block text-primary underline underline-offset-4">다음 통증 진료와 재평가 안내 →</Link></section>
      {guides.map(g => <section key={g.id} id={g.id} className="scroll-mt-24 rounded-2xl border border-line bg-card p-6"><h2 className="font-serif text-xl font-semibold text-ink">{g.title}</h2><p className="mt-4 text-base leading-relaxed text-muted">{g.text}</p><Link href={g.href} className="mt-4 inline-block text-primary underline underline-offset-4">{g.label} →</Link></section>)}
    </div>
    <section className="bg-[var(--surface)] px-6 py-12 text-center"><h2 className="font-serif text-2xl font-semibold text-ink">치료 후 변화가 궁금하신가요?</h2><p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">받으신 치료와 날짜, 불편해진 시점을 카카오톡으로 알려주세요. 진료시간 내 의료진이 직접 상담합니다.</p><ConsultationActions directions className="mt-6" /></section>
  </>;
}
