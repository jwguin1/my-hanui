"use client";

import Link from "next/link";
import { useState } from "react";

export type QuestionEntry = { title: string; description: string; href: string; group: string; keywords: string };
const GROUPS = ["전체", "통증치료", "교통사고", "보험한약", "체질보약", "일산감비환", "잡티제거", "치료선택", "방문준비"];

export default function QuestionDirectory({ entries }: { entries: QuestionEntry[] }) {
  const [group, setGroup] = useState("전체");
  const [query, setQuery] = useState("");
  const words = query.normalize("NFC").trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const visible = entries.filter(e => (group === "전체" || e.group === group) && words.every(w => `${e.title} ${e.description} ${e.keywords}`.toLocaleLowerCase().replace(/\s/g, "").includes(w.replace(/\s/g, ""))));
  return <section className="mx-auto max-w-6xl px-6 py-10">
    <label htmlFor="question-search" className="block text-lg font-semibold text-ink">어떤 점이 궁금하세요?</label>
    <input id="question-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="예: 허리, 생리통, 토닝 비용, 치료 후" className="mt-3 w-full rounded-xl border border-line bg-card px-4 py-4 text-base text-ink focus:outline-2 focus:outline-primary" />
    <div role="group" aria-label="진료별 질문 분류" className="mt-5 flex flex-wrap gap-2">
      {GROUPS.map(g => <button key={g} type="button" aria-pressed={group === g} onClick={() => setGroup(g)} className={`rounded-full border px-4 py-2.5 text-sm font-medium ${group === g ? "border-primary bg-primary text-white" : "border-line bg-card text-ink"}`}>{g === "잡티제거" ? "잡티제거·색소·리프팅" : g === "일산감비환" ? "일산감비환 · 다이어트" : g === "치료선택" ? "피부 고민·치료 선택" : g === "방문준비" ? "의료기관 선택·방문" : g}</button>)}
    </div>
    <p role="status" className="my-5 text-sm text-muted">{visible.length}개의 질문·안내</p>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {visible.map(e => <article key={e.href} className="rounded-2xl border border-line bg-card p-5">
        <p className="text-sm font-medium text-primary">{e.group}</p>
        <h2 className="mt-2 text-lg font-semibold leading-relaxed text-ink"><Link href={e.href} className="hover:text-primary">{e.title}</Link></h2>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{e.description}</p>
        <Link href={e.href} className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4">답변 읽기 →</Link>
      </article>)}
    </div>
    {visible.length === 0 && <div className="rounded-xl border border-line p-6"><p>일치하는 질문이 없습니다. 다른 단어로 검색하거나 전체 분류를 살펴보세요.</p><button type="button" onClick={() => { setQuery(""); setGroup("전체"); }} className="mt-4 text-primary underline">전체 질문 보기</button></div>}
  </section>;
}
