import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SkinTreatmentLayout, { SkinSection, SkinFaq } from "@/components/SkinTreatmentLayout";
import { pageMetadata } from "@/lib/page-metadata";
import { buildGraph, faqEntities } from "@/lib/schema";
import { TONING_FAQS } from "@/lib/skin-laser-care";
import { TONING_PRICES, painWon } from "@/lib/pricing";
import { postPath } from "@/lib/slug";

const description = "일산한의원 토닝관리. 엘리멘트 TL 제네시스 토닝과 피코하이 피코토닝 각 1회 33,000원. 얼굴 크기에 따라 최소 2,000샷에서 3,000샷까지. 장비·차이·관리 방법을 확인하세요.";
export const metadata = pageMetadata({ path: "/skin/toning", title: "일산 토닝관리 | 제네시스·피코토닝 33,000원·장비·샷 수", description, routeOgImage:true });
export default function ToningPage() {
  return <><JsonLd graph={buildGraph({path:"/skin/toning",name:"토닝관리 – 일산한의원",description,faq:faqEntities([...TONING_FAQS])})}/>
    <SkinTreatmentLayout kind="toning" title={<>토닝관리<br /><span className="text-primary">피부결과 피부톤을 고르게.</span></>} description="거친 피부결은 제네시스 토닝으로, 고르지 않은 피부톤은 피코토닝으로. 피부 상태에 맞춰 선택하고 꾸준히 관리하세요.">
      <SkinSection id="prices" title="두 가지 토닝, 각 1회 33,000원">
        <div className="grid gap-5 sm:grid-cols-2">
          <article className="rounded-2xl border border-line bg-white p-6"><p className="text-sm font-semibold text-primary">엘리멘트 TL · 1064nm</p><h3 className="mt-2 text-2xl font-bold text-ink">제네시스 토닝</h3><p className="mt-4 text-3xl font-bold text-primary">{painWon(TONING_PRICES.genesis)}<span className="ml-2 text-base font-normal">/ 1회</span></p><p className="mt-5">1064nm 롱펄스 레이저로 피부에 열 자극을 전달합니다. 콜라겐 재형성을 유도해 피부결과 잔주름을 관리하는 재생 중심의 토닝입니다.</p></article>
          <article className="rounded-2xl border border-line bg-white p-6"><p className="text-sm font-semibold text-primary">피코하이 · 1064nm</p><h3 className="mt-2 text-2xl font-bold text-ink">피코토닝</h3><p className="mt-4 text-3xl font-bold text-primary">{painWon(TONING_PRICES.pico)}<span className="ml-2 text-base font-normal">/ 1회</span></p><p className="mt-5">피코초 단위의 짧은 레이저 펄스로 멜라닌 색소에 작용합니다. 얼굴 전반의 고르지 않은 피부톤과 색소를 관리하는 토닝입니다.</p></article>
        </div>
        <p>각 시술의 1회 가격이며, 모두 부가세가 포함되어 있습니다.</p>
      </SkinSection>
      <SkinSection id="shots" title="얼굴 크기에 맞춰 2,000~3,000샷">
        <div className="rounded-2xl bg-surface p-6 sm:p-8"><p className="text-xl font-bold text-ink">1회 최소 2,000샷 이상</p><p className="mt-3">얼굴 면적이 넓으면 3,000샷까지 진행합니다. 얼굴 크기에 맞춰 고르게 조사하고, 피부 반응을 살피며 강도를 조절합니다.</p></div>
        <p>갈색 반점이나 실핏줄처럼 집중해서 치료할 부위가 있다면 진찰 때 함께 알려주세요. <Link href="/skin/pigmentation" className="font-semibold text-primary underline underline-offset-4">색소·홍조·재생치료</Link>에서는 병변별로 장비와 파장을 정해 맞춤 치료합니다.</p>
      </SkinSection>
      <SkinSection id="questions" title="토닝을 받기 전 궁금한 질문"><SkinFaq items={TONING_FAQS}/></SkinSection>
      <SkinSection id="guides" title="내 피부에 맞는 관리 알아보기">
        <nav className="grid gap-3">{[["피코토닝-제네시스-차이","피코토닝과 제네시스의 차이"],["제네시스토닝-효과","제네시스 토닝과 피부결 관리"],["피코토닝-효과-횟수","피코토닝 효과와 반복 관리"],["토닝후-색소침착-딱지","토닝 후 세안·보습·자외선 관리"]].map(([slug,title])=><Link key={slug} href={postPath("skin",slug)} className="rounded-xl border border-line bg-white p-5 font-semibold text-primary">{title} →</Link>)}</nav>
      </SkinSection>
      <p className="py-5 text-sm text-muted">장비 안내: <a href="https://kr.hironic.com/p/picohi" className="underline">하이로닉 피코하이</a> · <a href="https://elemenic.com/element-tl/" className="underline">엘레메닉 엘리멘트 TL</a></p>
    </SkinTreatmentLayout></>;
}
