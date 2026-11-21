import FaqList from "./ui/FaqList";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import ConsultationActions from "./ConsultationActions";
import ClinicVisitInfo from "./ClinicVisitInfo";
import { CLINIC } from "@/lib/clinic";
import { SKIN_DEVICES, TREATMENT_DEVICES, type SkinDeviceId } from "@/lib/skin-devices";

type Treatment = keyof typeof TREATMENT_DEVICES;
type HeaderProps = { kind: Treatment; title: ReactNode; description: string };

export function SkinTreatmentHeader({ kind, title, description }: HeaderProps) {
  const ids: readonly SkinDeviceId[] = TREATMENT_DEVICES[kind];
  const devices = SKIN_DEVICES.filter((device) => ids.includes(device.id));
  const firstJump = kind === "agnes" ? { id: "treatment", label: "치료 안내" } : { id: "prices", label: "가격·구성" };
  const jumpClass = "inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-3 py-2 text-base font-semibold text-ink hover:border-primary/50 sm:px-4";
  return (
    <header className="skin-treatment border-b border-line bg-surface px-5 py-5 sm:px-8 md:py-10">
      <div className="mx-auto grid max-w-5xl items-center gap-5 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-8">
        <div>
          <Link href="/skin" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-4 hover:underline">일산한의원 피부클리닉</Link>
          <h1 className="mt-1 text-[clamp(1.8rem,3.6vw,2.85rem)] font-bold leading-[1.27] tracking-tight text-ink">{title}</h1>
          <p className="mt-3 max-w-xl text-base leading-[1.65] text-muted sm:text-lg">{description}</p>
          <nav aria-label="페이지 바로가기" className="mt-4 flex flex-wrap gap-2 sm:mt-6">
            <a href={`#${firstJump.id}`} className={jumpClass}>{firstJump.label}</a>
            <a href={kind === "spot" ? "#skin-faq" : "#questions"} className={jumpClass}>궁금한 질문</a>
            <a href={CLINIC.kakaoHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#fee500] px-3 py-2 text-base font-semibold text-[#3c1e1e] hover:bg-[#f2d900] sm:px-4">카카오톡 상담</a>
          </nav>
        </div>
        <section aria-label="시술에 쓰는 장비" className={`grid gap-2 ${devices.length > 1 ? "grid-cols-2" : ""}`}>
          {devices.map((device) => (
            <figure key={device.id} className={`flex items-center justify-center gap-3 rounded-2xl border border-line bg-white p-3 ${devices.length > 1 ? "flex-col text-center" : ""} md:flex-col md:p-4 md:text-center`}>
              <Image src={`/images/devices/${device.id}.webp`} alt={`${device.name} 장비`} width={180} height={180}
                sizes="(min-width: 768px) 140px, 70px" className="h-[70px] w-[70px] object-contain md:h-[140px] md:w-[140px]" />
              <figcaption>
                <strong className="block text-base leading-snug text-ink">{device.name}</strong>
                <span className="block text-sm leading-snug text-muted">{device.type}</span>
              </figcaption>
            </figure>
          ))}
        </section>
      </div>
    </header>
  );
}

export function SkinSection({id,title,children}:{id:string;title:string;children:ReactNode}) {
  return <section id={id} className="scroll-mt-28 border-b border-line py-10 sm:py-14"><h2 className="text-2xl font-bold leading-snug text-ink sm:text-3xl">{title}</h2><div className="mt-6 space-y-5 text-base leading-[1.9] text-muted">{children}</div></section>;
}
export function SkinFaq({items}:{items:readonly {q:string;a:string}[]}) {
  return <><FaqList items={items} openFirst /><a href={CLINIC.kakaoHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-base font-semibold text-primary underline underline-offset-4">내 피부 상태, 카카오톡으로 문의하기</a></>;
}
export default function SkinTreatmentLayout({kind,title,description,children}:HeaderProps & {children:ReactNode}) {
  return <div className="skin-treatment bg-[var(--bg)]">
    <SkinTreatmentHeader kind={kind} title={title} description={description} />
    <div className="mx-auto max-w-4xl px-5 sm:px-6">{children}
      <section className="py-10"><h2 className="text-xl font-bold">함께 살펴보는 피부 진료</h2><nav aria-label="관련 피부 진료" className="mt-5 grid gap-3 sm:grid-cols-2">{[["/skin/spot","CO₂ 잡티제거 · 점·편평사마귀·쥐젖"],["/skin/pigmentation","색소·홍조·재생치료"],["/skin/toning","토닝관리 · 제네시스·피코토닝"],["/skin/lifting","슈링크·볼뉴머 · 리프팅"],["/skin/hair-removal","엘리멘트 TL · 얼굴 제모"],["/skin/agnes","아그네스 · 미세침 고주파"],["/skin/questions","피부 고민별 질문 · 치료 선택"]].filter(([href])=>href!==`/skin/${kind}`).map(([href,label])=><Link key={href} href={href} className="rounded-xl border border-line bg-white p-5 text-base font-semibold leading-relaxed text-primary">{label} →</Link>)}</nav></section>
      <section id="consultation" className="scroll-mt-28 border-t border-line py-12 text-center"><h2 className="text-2xl font-bold">내 피부에 맞는 구성, 함께 골라보세요.</h2><p className="mt-4 text-base leading-relaxed text-muted">고민 부위와 이전 시술 이력, 희망 일정을 카카오톡으로 남겨주세요.<br />진료시간 내 의료진이 상담해드립니다.</p><ClinicVisitInfo className="mt-6"/><ConsultationActions directions className="mt-6"/></section>
    </div>
  </div>;
}
