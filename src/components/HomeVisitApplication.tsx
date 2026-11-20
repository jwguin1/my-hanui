"use client";

import { useRef, useState } from "react";

const TEMPLATE = `방문진료 신청
환자 성함:
보호자 성함·관계:
연락받을 전화번호:
방문할 동네:
불편한 증상:
희망 요일·시간:`;

export default function HomeVisitApplication({ kakaoHref }: { kakaoHref: string }) {
  const templateRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState("");
  const [copying, setCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyTemplate() {
    setCopying(true);
    setStatus("");
    setCopied(false);
    try {
      await navigator.clipboard.writeText(TEMPLATE);
      setCopied(true);
      setStatus("복사 완료. 2번 버튼을 눌러주세요.");
    } catch {
      templateRef.current?.focus({ preventScroll: true });
      templateRef.current?.select();
      templateRef.current?.setSelectionRange(0, TEMPLATE.length);
      setStatus("양식을 선택했습니다. ‘복사’를 눌러 카카오톡에 붙여넣어 주세요.");
    } finally {
      setCopying(false);
    }
  }

  return <div className="my-6">
    <div id="home-visit-actions" className="rounded-xl border border-line bg-[var(--surface)] p-4 sm:p-5">
      <div role="group" aria-label="방문진료 신청 순서" className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={copyTemplate} disabled={copying} className="flex min-h-14 w-full items-center justify-center whitespace-nowrap rounded-xl border border-primary bg-white px-3 py-3 text-base font-semibold text-primary transition-colors hover:bg-[var(--bg)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-60">{copying ? "복사 중…" : copied ? "1. 복사 완료" : "1. 양식 복사"}</button>
        <a href={kakaoHref} target="_blank" rel="noopener noreferrer" className="flex min-h-14 w-full items-center justify-center whitespace-nowrap rounded-xl bg-[#FEE500] px-3 py-3 text-base font-semibold text-[#3C1E1E] transition-colors hover:bg-[#f2d900] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">2. 카카오톡 신청</a>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="mt-3 min-h-12 text-base leading-relaxed text-primary">{status || "1번으로 양식을 복사한 뒤 2번을 눌러주세요."}</p>
      <p className="mt-2 text-base leading-relaxed text-ink">채팅창이 열리면 양식을 붙여넣고, 빈칸을 채워 보내주세요.</p>
    </div>
    <label htmlFor="home-visit-template" className="mb-3 mt-6 block text-base font-semibold text-ink">복사되는 신청 양식</label>
    <textarea ref={templateRef} id="home-visit-template" value={TEMPLATE} readOnly rows={8} spellCheck={false} aria-describedby="home-visit-template-help" className="block w-full resize-none rounded-xl border border-line bg-[var(--surface)] p-4 text-base leading-8 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
    <p id="home-visit-template-help" className="my-4 text-base leading-relaxed text-muted">본인 신청이면 보호자 칸은 비워두세요.<br />동네는 ‘고양시 중산동’ 또는 ‘파주시 문산읍’처럼 적어주세요. 일정은 ‘상담 후 결정’으로 적으셔도 됩니다.</p>
  </div>;
}
