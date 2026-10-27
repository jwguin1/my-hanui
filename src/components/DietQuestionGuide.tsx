import Link from "next/link";
import { DIET_COST_ANSWER, DIET_QUESTIONS } from "@/lib/diet-questions";

export default function DietQuestionGuide({ showCost = false }: { showCost?: boolean }) {
  return (
    <section aria-labelledby="diet-questions-title" className="section-padding !py-10">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-medium text-primary">일산감비환 · 상담 전 안내</p>
        <h2 id="diet-questions-title" className="mt-3 font-serif text-2xl font-semibold text-ink">다이어트 한약, 먼저 궁금한 것부터</h2>
        {showCost && <div className="mt-5 rounded-2xl border border-line bg-surface p-6">
          <h3 className="font-semibold text-ink">일산감비환 가격과 한 상자 분량</h3>
          <p className="mt-3 text-base leading-7 text-muted">{DIET_COST_ANSWER}</p>
          <Link href="/diet/program#prices" className="mt-4 inline-block text-primary underline underline-offset-4">첫 상담과 가격표 확인하기 →</Link>
        </div>}
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {DIET_QUESTIONS.map(question => <li key={question.href}>
            <Link href={question.href} className="group block rounded-lg px-2 py-5 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <h3 className="text-base font-semibold leading-7 text-ink group-hover:text-primary">{question.title} <span aria-hidden="true">→</span></h3>
              <p className="mt-1 text-sm leading-6 text-muted">{question.description}</p>
            </Link>
          </li>)}
        </ul>
      </div>
    </section>
  );
}
