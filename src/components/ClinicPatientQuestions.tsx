import Link from "next/link";
import { CLINIC } from "@/lib/clinic";
import { clinicQuestionGroups, type PatientQuestion } from "@/lib/clinic-patient-questions";

const textLink = "inline-flex min-h-11 items-center py-2 font-medium text-primary underline underline-offset-4";

function Question({ item }: { item: PatientQuestion }) {
  if (!item.a && item.href) {
    return <Link href={item.href} className="flex min-h-12 items-center justify-between gap-3 px-4 py-3 text-base font-semibold leading-7 text-ink hover:text-primary sm:px-6">
      {item.q}<span aria-hidden="true" className="shrink-0 text-primary">→</span>
    </Link>;
  }
  return <details className="faq-item group/item">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 sm:px-6">
      {item.q}<span aria-hidden="true" className="shrink-0 text-primary group-open/item:hidden">+</span>
      <span aria-hidden="true" className="hidden shrink-0 text-primary group-open/item:inline">−</span>
    </summary>
    <div id={`faq-${item.id}`} className="scroll-mt-44 px-4 pb-3 text-base leading-[1.85] text-ink sm:px-6 md:text-[17px]">
      <p>{item.a}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-5">
        {item.href && <a className={textLink} href={item.href}>{item.label}</a>}
        <a className={textLink} href={CLINIC.kakaoHref}>카카오톡으로 진료 문의</a>
      </div>
    </div>
  </details>;
}

export default function ClinicPatientQuestions({ path }: { path: string }) {
  const groups = clinicQuestionGroups(path);
  if (!groups.length) return null;
  const single = groups.length === 1;
  return <section id="patient-faq" aria-labelledby="patient-faq-title" className="mx-auto w-full max-w-3xl scroll-mt-24 px-5 py-10 md:py-14">
    <h2 id="patient-faq-title" className="text-2xl font-semibold leading-snug text-ink md:text-3xl">
      {single ? groups[0].title : "증상별로 찾아보는 질문"}
    </h2>
    <div className="mt-5 space-y-3">
      {groups.map(group => {
        const questions = <div className="divide-y divide-line rounded-xl border border-line bg-card">
          {group.items.map(item => <Question key={item.id} item={item} />)}
        </div>;
        if (single) return <div key={group.title}>{questions}</div>;
        return <details key={group.title} open={groups.length === 2} className="rounded-xl border border-line bg-surface">
          <summary className="min-h-12 cursor-pointer px-4 py-3 text-lg font-semibold leading-7 text-ink sm:px-6">{group.title}</summary>
          <div className="px-2 pb-2">{questions}</div>
        </details>;
      })}
    </div>
  </section>;
}
