"use client";

import { useRef } from "react";

export default function SectionJumpNav({ label, items }: { label: string; items: [string, string][] }) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  return <nav aria-label={label} className="sticky top-16 z-40 border-y border-line bg-white md:static">
    <details ref={disclosure} className="group md:hidden">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-5 py-3 text-base font-semibold text-primary [&::-webkit-details-marker]:hidden">
        항목 선택 <span aria-hidden="true" className="group-open:rotate-180">⌄</span>
      </summary>
      <div className="absolute inset-x-0 max-h-[60dvh] overflow-y-auto border-b border-line bg-white px-3 pb-3 shadow-md">
        {items.map(([id, text]) => <a key={id} href={`#${id}`} onClick={() => { if (disclosure.current) disclosure.current.open = false; }} className="block rounded-lg px-3 py-3 text-base text-primary hover:bg-surface">{text}</a>)}
      </div>
    </details>
    <div className="mx-auto hidden max-w-5xl flex-wrap justify-center gap-3 px-6 py-4 md:flex">
      {items.map(([id, text]) => <a key={id} href={`#${id}`} className="rounded-full border border-line px-4 py-2 text-sm font-medium text-primary">{text}</a>)}
    </div>
  </nav>;
}
