import Link from "next/link";

export type JourneyStep = { title: string; text: string; href?: string; linkLabel?: string };

/** 실제 운영 중인 진료 순서를 서버 HTML로 제공한다. */
export default function PatientJourney({ id, title, intro, steps }: {
  id: string; title: string; intro: string; steps: JourneyStep[];
}) {
  return <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-y border-line bg-surface">
    <div className="section-padding !py-10 md:!py-14">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold text-primary">처음 방문하시는 분께</p>
        <h2 id={`${id}-title`} className="mt-3 text-2xl font-semibold leading-snug text-ink md:text-3xl">{title}</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted">{intro}</p>
        <ol className="mt-7 grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => <li key={step.title} className="min-w-0 rounded-2xl border border-line bg-card p-5 sm:p-6">
            <p aria-hidden="true" className="text-sm font-semibold text-primary">0{index + 1}</p>
            <h3 className="mt-2 text-lg font-semibold leading-relaxed text-ink">{step.title}</h3>
            <p className="mt-3 text-base leading-7 text-muted">{step.text}</p>
            {step.href && <Link href={step.href} className="mt-3 inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4">{step.linkLabel} →</Link>}
          </li>)}
        </ol>
      </div>
    </div>
  </section>;
}
