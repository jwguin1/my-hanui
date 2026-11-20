"use client";

import { useRef, useState } from "react";

const TEMPLATE = `방문진료 신청
환자 성함:
보호자 성함·관계:
연락받을 전화번호:
방문할 동네:
불편한 증상:
희망 요일·시간:`;

export default function HomeVisitApplication() {
  const templateRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState("");
  const [copying, setCopying] = useState(false);

  async function copyTemplate() {
    setCopying(true);
    setStatus("");
    try {
      await navigator.clipboard.writeText(TEMPLATE);
      setStatus("복사했습니다. 카카오톡 채팅에 붙여넣고 빈칸을 채워주세요.");
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
    <label htmlFor="home-visit-template" className="mb-3 block text-base font-semibold text-ink">카카오톡에 보낼 신청 양식</label>
    <textarea ref={templateRef} id="home-visit-template" value={TEMPLATE} readOnly rows={8} spellCheck={false} aria-describedby="home-visit-template-help" className="block w-full resize-none rounded-xl border border-line bg-[var(--surface)] p-4 text-base leading-8 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary" />
    <p id="home-visit-template-help" className="my-4 text-base leading-relaxed text-muted">본인 신청이면 보호자 칸은 비워두세요.<br />동네는 ‘고양시 중산동’ 또는 ‘파주시 문산읍’처럼 적어주세요. 일정은 ‘상담 후 결정’으로 적으셔도 됩니다.</p>
    <button type="button" onClick={copyTemplate} disabled={copying} className="flex min-h-14 w-full items-center justify-center rounded-full border border-primary bg-white px-4 py-3 text-base font-semibold text-primary transition-colors hover:bg-[var(--surface)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:opacity-60 sm:w-auto sm:px-7">{copying ? "복사 중…" : "신청 양식 복사하기"}</button>
    <p role="status" aria-live="polite" aria-atomic="true" className="mt-3 min-h-12 text-base leading-relaxed text-primary">{status}</p>
  </div>;
}
