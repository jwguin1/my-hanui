import Link from "next/link";
import { PAIN_CARE_FAQS, HERBAL_CARE_FAQS } from "@/lib/care-guide";
import { CLINIC } from "@/lib/clinic";

export default function CareGuide({ herbal = false }: { herbal?: boolean }) {
  const faqs = herbal ? HERBAL_CARE_FAQS : PAIN_CARE_FAQS;
  return (
    <section id={herbal ? "herbal-guide" : "visit-guide"} className="scroll-mt-24 bg-[var(--bg)]">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-sm font-semibold text-primary">{herbal ? "한약 조제와 복용 상담" : "방문 전 진료 안내"}</p>
          <h2 className="mt-3 text-center font-serif text-3xl font-semibold text-ink">{herbal ? "내 한약이 준비되는 과정" : "진료 시간과 치료 과정을 확인하세요"}</h2>
          {herbal ? <ol className="mt-7 grid gap-4 sm:grid-cols-2">
            <li className="rounded-xl border border-line bg-card p-5"><h3 className="font-semibold text-primary">01 · 상담·처방</h3><p className="mt-3 text-base leading-relaxed text-muted">증상과 복용 중인 약을 확인하고 처방을 정합니다.</p></li>
            {faqs.map((faq, i) => <li key={faq.q} className="rounded-xl border border-line bg-card p-5"><p className="text-sm font-semibold text-primary">0{i + 2} · {["약재 사진·원내 탕전", "준비 기간·수령", "복용 중 상담"][i]}</p><h3 className="mt-3 text-base font-semibold text-ink">{faq.q}</h3><p className="mt-3 text-base leading-relaxed text-muted">{faq.a}</p></li>)}
          </ol> : <dl className="mt-8 divide-y divide-line rounded-2xl border border-line bg-card px-6 sm:px-8">
            {faqs.map(faq => <div key={faq.q} className="py-6"><dt className="text-lg font-semibold leading-relaxed text-ink">{faq.q}</dt><dd className="mt-3 text-[16px] leading-[1.9] text-ink/80">{faq.a}</dd></div>)}
          </dl>}
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-[15px] font-medium text-primary">
            <Link href={herbal ? "#herbal-prices" : "#prices"} className="underline underline-offset-4">{herbal ? "한약 비용 확인하기" : "통증 치료 비용 확인하기"}</Link>
            <Link href="/aftercare" className="underline underline-offset-4">치료 후 관리 모음</Link>
            <a href={CLINIC.kakaoHref} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">의료진에게 카카오톡 문의</a>
          </div>
        </div>
      </div>
    </section>
  );
}
