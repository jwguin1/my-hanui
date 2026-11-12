export type FaqItem = { q: string; a: string };

/** Keep every answer in the HTML, including collapsed answers. */
export default function FaqList({ items, openFirst = false }: { items: readonly FaqItem[]; openFirst?: boolean }) {
  return <div className="space-y-3">{items.map((item, index) => (
    <details key={item.q} open={openFirst && index === 0} className="faq-item group rounded-xl border border-line bg-card px-5 sm:px-6">
      <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
        <span>{item.q}</span><span aria-hidden="true" className="shrink-0 text-primary transition-transform group-open:rotate-45">＋</span>
      </summary>
      <p className="whitespace-pre-line border-t border-line pb-5 pt-4">{item.a}</p>
    </details>
  ))}</div>;
}
