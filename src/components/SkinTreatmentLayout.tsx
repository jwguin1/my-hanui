import type { ReactNode } from "react";
import Link from "next/link";
import ConsultationActions from "./ConsultationActions";
import ClinicVisitInfo from "./ClinicVisitInfo";

export function SkinSection({id,title,children}:{id:string;title:string;children:ReactNode}) {
  return <section id={id} className="scroll-mt-28 border-b border-line py-10 sm:py-14"><h2 className="text-2xl font-bold leading-snug text-ink sm:text-3xl">{title}</h2><div className="mt-6 space-y-5 text-base leading-[1.9] text-muted">{children}</div></section>;
}
export function SkinFaq({items}:{items:readonly {q:string;a:string}[]}) {
  return <div className="space-y-3">{items.map((f,i)=><details key={f.q} open={i===0} className="group rounded-xl border border-line bg-white px-5 py-2"><summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-3 text-base font-bold leading-relaxed text-ink [&::-webkit-details-marker]:hidden">{f.q}<span aria-hidden className="shrink-0 group-open:rotate-45">＋</span></summary><p className="pb-4 pt-2 text-base leading-[1.9]">{f.a}</p></details>)}</div>;
}
export default function SkinTreatmentLayout({kind,title,description,children}:{kind:"lifting"|"hair-removal";title:ReactNode;description:string;children:ReactNode}) {
  return <div className="skin-treatment bg-[var(--bg)]">
    <header className="border-b border-line bg-[#faf5f3] px-5 py-12 sm:py-16"><div className="mx-auto max-w-4xl"><Link href="/skin/spot" className="text-sm font-bold text-[#792d44]">일산한의원 피부클리닉</Link><h1 className="mt-5 text-3xl font-extrabold leading-[1.5] tracking-tight text-ink sm:text-5xl">{title}</h1><p className="mt-5 max-w-2xl text-base leading-[1.9] text-muted sm:text-lg">{description}</p><nav aria-label="페이지 바로가기" className="mt-7 flex flex-wrap gap-3">{[["prices","가격·구성"],["questions","궁금한 질문"],["consultation","카카오톡 상담"]].map(([id,label])=><a key={id} href={`#${id}`} className="rounded-full border border-line bg-white px-5 py-3 text-sm font-semibold">{label} ↓</a>)}</nav></div></header>
    <div className="mx-auto max-w-4xl px-5 sm:px-6">{children}
      <section className="py-10"><h2 className="text-xl font-bold">함께 살펴보는 피부 진료</h2><nav aria-label="관련 피부 진료" className="mt-5 grid gap-3 sm:grid-cols-2">{[["/skin/spot","CO₂ 잡티제거 · 점·편평사마귀·쥐젖"],["/skin/pigmentation","피코토닝·제네시스 · 색소치료"],["/skin/lifting","슈링크·볼뉴머 · 리프팅"],["/skin/hair-removal","엘리멘트 TL · 얼굴 제모"]].filter(([href])=>href!==`/skin/${kind}`).map(([href,label])=><Link key={href} href={href} className="rounded-xl border border-line bg-white p-5 text-base font-semibold leading-relaxed text-primary">{label} →</Link>)}</nav></section>
      <section id="consultation" className="scroll-mt-28 border-t border-line py-12 text-center"><h2 className="text-2xl font-bold">내 피부에 맞는 구성, 함께 골라보세요.</h2><p className="mt-4 text-base leading-relaxed text-muted">고민 부위와 이전 시술 이력, 희망 일정을 카카오톡으로 남겨주세요.<br />진료시간 내 의료진이 상담해드립니다.</p><ClinicVisitInfo className="mt-6"/><ConsultationActions directions className="mt-6"/></section>
    </div>
  </div>;
}
