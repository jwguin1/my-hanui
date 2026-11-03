import { CLINIC } from "@/lib/clinic";

/** 헤더 메뉴보다 낮은 z-index. 전화나 메시지를 자동으로 발송하지 않는다. */
export default function MobileConsultationBar({ label = "카카오톡 문의" }: { label?: string }) {
  return <>
    <nav data-mobile-consultation aria-label="빠른 상담" className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3">
        <a href={CLINIC.kakaoHref} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center rounded-xl bg-[#FEE500] px-3 py-2 text-center text-sm font-semibold leading-5 text-[#3C1E1E]">{label}</a>
        <a href={CLINIC.telHref} className="flex min-h-12 items-center justify-center rounded-xl border border-line px-3 py-2 text-sm font-semibold text-ink">전화 문의</a>
      </div>
    </nav>
  </>;
}
