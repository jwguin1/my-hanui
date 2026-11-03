import Link from "next/link";

export default function RelatedPatientGuides({ id = "related-guides", title, items }: {
  id?: string; title: string; items: { href: string; title: string; text: string }[];
}) {
  return <section id={id} className="scroll-mt-28 mx-auto max-w-5xl px-6 py-12">
    <h2 className="text-2xl font-semibold leading-snug text-ink">{title}</h2>
    <ul className="mt-6 grid gap-4 md:grid-cols-2">{items.map(item => <li key={item.href}>
      <Link href={item.href} className="block h-full rounded-2xl border border-line bg-card p-5 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary">
        <h3 className="text-lg font-semibold leading-7 text-ink">{item.title} <span aria-hidden="true">→</span></h3>
        <p className="mt-3 text-base leading-7 text-muted">{item.text}</p>
      </Link>
    </li>)}</ul>
  </section>;
}
