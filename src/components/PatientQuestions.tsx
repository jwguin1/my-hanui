export default function PatientQuestions({ items }: { items: { quote: string; answer: string }[] }) {
  return <div className="mx-auto mt-8 max-w-4xl space-y-3">
    {items.map(item => <details key={item.quote} className="group rounded-xl border border-line bg-card p-5 sm:p-6">
      <summary className="flex min-h-11 cursor-pointer list-none items-start justify-between gap-4 text-base font-semibold leading-7 text-ink [&::-webkit-details-marker]:hidden">
        {item.quote}<span aria-hidden="true" className="shrink-0 text-primary group-open:rotate-45">＋</span>
      </summary>
      <p className="mt-4 text-base leading-8 text-muted">{item.answer}</p>
    </details>)}
  </div>;
}
