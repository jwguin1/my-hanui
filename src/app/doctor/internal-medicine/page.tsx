import Image from "next/image";
import Link from "next/link";
import ConsultationActions from "@/components/ConsultationActions";
import JsonLd from "@/components/JsonLd";
import { CLINIC } from "@/lib/clinic";
import { DOCTOR_WORKDAYS } from "@/lib/doctor-profile";
import { pageMetadata } from "@/lib/page-metadata";
import { buildGraph, physicianStub } from "@/lib/schema";

const path = "/doctor/internal-medicine";
const title = "일산 한방내과 전문의 진료일·예약 | 오서혜 원장";
const workdays = DOCTOR_WORKDAYS.오서혜.map(day => `${day}요일`).join(" · ");
const description = `일산한의원 한방내과 전문의 오서혜 원장의 정규 진료일은 ${workdays}입니다. 기능성 소화불량·식욕 저하·피로 진료를 카카오톡이나 전화로 예약하세요.`;
export const metadata = pageMetadata({ path, title, description });

const linkClass = "inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4";

export default function InternalMedicineDoctorPage() {
  return (
    <>
      <JsonLd graph={buildGraph({ path, name: title, description, about: physicianStub("오서혜"), breadcrumbName: "한방내과 전문의 진료일" })} />
      <article className="mx-auto max-w-2xl space-y-8 px-5 py-8 text-base leading-7 text-muted sm:px-8 sm:py-12">
        <header className="flex items-center gap-4 sm:gap-6">
          <Image src="/images/doctor-7.webp" alt="오서혜 원장" width={88} height={110} className="h-[110px] w-[88px] shrink-0 rounded-xl object-cover object-top" />
          <div>
            <h1 className="text-2xl font-bold leading-tight text-ink sm:text-3xl">한방내과 전문의 진료일</h1>
            <p className="mt-2 text-lg font-semibold text-ink">일산한의원 오서혜 원장</p>
            <Link href="/doctor#oh-seohye" className={linkClass}>약력과 진료 이야기</Link>
          </div>
        </header>
        <section className="rounded-2xl border border-line bg-card p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-ink">오서혜 원장은 언제 진료하나요?</h2>
          <p className="my-2 break-keep text-lg font-semibold text-primary">{workdays}</p>
          <p>카카오톡이나 전화로 “오서혜 원장님 진료를 받고 싶어요”라고 말씀해 주세요. 방문하고 싶은 날짜와 시간을 알려주시면 예약을 안내합니다.</p>
          <ConsultationActions className="mt-4 sm:justify-start" kakaoLabel="카카오톡 지정 예약 문의" />
        </section>
        <section>
          <h2 className="text-xl font-semibold text-ink">어떤 증상으로 상담할 수 있나요?</h2>
          <p className="mt-2">식후에 속이 더부룩하거나 식사량이 줄고 피로가 겹칠 때, 식사와 수면, 복용 중인 약부터 살펴봅니다. 진찰 결과를 바탕으로 침 치료와 한약 처방을 계획합니다.</p>
          <div className="mt-1 flex flex-wrap gap-x-5">
            <Link href="/internal/dyspepsia" className={linkClass}>기능성 소화불량 진료</Link>
            <Link href="/herbal/tonic/constitution" className={linkClass}>피로·체질보약 상담</Link>
          </div>
        </section>
        <footer className="border-t border-line pt-4">
          <p>{CLINIC.building}에서 진료합니다. {CLINIC.receptionNote}</p>
          <div className="mt-1 flex flex-wrap gap-x-5">
            <Link href="/contact#before-visit" className={linkClass}>진료시간과 휴진일</Link>
            <Link href="/doctor#weekly-schedule" className={linkClass}>전체 의료진 시간표</Link>
          </div>
        </footer>
      </article>
    </>
  );
}
