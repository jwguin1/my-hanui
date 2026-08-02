"use client";

import { useEffect, useRef, useState } from "react";
import SectionReveal from "@/components/SectionReveal";
import SectionBadge from "@/components/ui/SectionBadge";
import { ListCheck } from "@/components/ui/icons";

/**
 * 의료기관 확인 섹션 — 심평원에서 직접 조회할 수 있는 경로를 안내한다.
 *
 * 🔴 이 컴포넌트를 수정하기 전에 읽을 것
 *
 * 1. 헤드라인은 절대 두 줄로 넘기지 않는다.
 *    whitespace-nowrap + text-[clamp(1.5rem,6.4vw,3rem)] 조합과
 *    섹션의 px-4 sm:px-6 이 그걸 담보한다 — 셋 다 바꾸지 않는다.
 *    문구는 13.6em 이내(한글 1em, 공백 0.3em 환산). 360px 뷰포트의
 *    여유가 2px 뿐이라 한 글자만 늘려도 폰트가 본문보다 작아진다.
 *
 * 2. 문구는 검증 가능한 사실만 진술한다. 의료법 제56조상 다른 의료기관을
 *    비방하는 광고는 금지다. 가짜·사칭·유사·주의·진짜·원조·유일한 같은
 *    표현과 특정 경쟁 기관 언급은 어떤 형태로도 넣지 않는다.
 *
 * 3. 심평원 로고·이미지를 넣지 않는다. 기관명 텍스트 표기만 쓴다.
 *
 * 4. HIRA_URL 에 검색어 파라미터를 붙이지 않는다. 병원찾기는 해시 기반
 *    지도 앱이라 검색어가 URL 에 실리지 않는다 — 추측해 붙이면 조용히
 *    깨진다. 검색어는 클립보드 복사로 넘긴다.
 *
 * 5. 경고색(빨강·주황·노랑)을 쓰지 않는다. 경고 톤이 되는 순간
 *    비방 뉘앙스가 생긴다. 홈의 크림+브라운 팔레트를 그대로 따른다.
 */

const HIRA_URL = "https://www.hira.or.kr/ra/hosp/getHealthMap.do";
const SEARCH_TERM = "일산한의원";

/** 복사 안내 문구가 떠 있는 시간 */
const NOTICE_MS = 4000;

type CopyState = "idle" | "copied" | "failed";

export default function VerifyClinicSection() {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function notify(state: CopyState) {
    setCopyState(state);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopyState("idle"), NOTICE_MS);
  }

  /**
   * 복사는 부수효과일 뿐이다 — preventDefault 를 하지 않으므로 클립보드
   * 권한이 거부돼도 <a> 의 기본 동작으로 새 탭은 그대로 열린다.
   */
  function handleCopy() {
    if (!navigator.clipboard?.writeText) {
      notify("failed");
      return;
    }
    navigator.clipboard.writeText(SEARCH_TERM).then(
      () => notify("copied"),
      () => notify("failed")
    );
  }

  const notice =
    copyState === "copied"
      ? `‘${SEARCH_TERM}’을 복사했습니다. 심평원 검색창에 붙여넣어 주세요.`
      : copyState === "failed"
        ? `심평원 검색창에 ‘${SEARCH_TERM}’을 입력해 주세요.`
        : "";

  return (
    <section className="bg-[var(--surface)]">
      {/* px-4 는 모바일 헤드라인 한 줄 유지를 위한 것 — px-6 로 되돌리지 않는다 */}
      <div className="mx-auto max-w-[1100px] px-4 py-20 sm:px-6 md:px-8 lg:py-24">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionBadge icon={<ListCheck size={15} />} label="의료기관 확인" />

            {/* 🔴 whitespace-nowrap + clamp 조합을 바꾸지 않는다 (상단 주석 1번) */}
            <h2 className="font-serif mt-4 whitespace-nowrap text-[clamp(1.5rem,6.4vw,3rem)] font-bold leading-snug tracking-[-0.02em] text-ink">
              ‘일산한의원’은 한 곳입니다
            </h2>

            <div
              aria-hidden="true"
              className="mx-auto mt-6 h-px w-16 bg-[var(--line)]"
            />

            <p className="mt-6 text-[0.95rem] leading-[1.9] text-muted">
              건강보험심사평가원에 ‘일산한의원’이라는 이름으로 등록된 요양기관은
              전국에 한 곳입니다. 경기 고양시 일산동구 무궁화로 237, 이마트
              풍산점 3층에 있는 저희 한의원입니다.
            </p>
          </div>

          {/* 확인 경로 — 클릭하면 검색어를 복사하고 심평원을 새 탭으로 연다 */}
          <div className="mx-auto mt-10 max-w-2xl">
            <a
              href={HIRA_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCopy}
              className="card group flex items-center justify-between gap-5 p-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] sm:p-7"
            >
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-[0.78rem] font-medium tracking-wide text-[var(--tan)]">
                  건강보험심사평가원
                </span>
                <span className="font-serif mt-1.5 block text-[1.05rem] font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-primary sm:text-[1.15rem]">
                  병원·약국 찾기에서 직접 확인하기
                </span>
                <span className="mt-2 block text-[0.85rem] leading-relaxed text-muted">
                  누르시면 검색어가 복사되고 심평원 사이트가 새 창으로 열립니다.
                  검색창에 붙여넣어 주세요.
                </span>
              </span>
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--card)] transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>

            {/* 복사 결과는 스크린리더에도 알린다. 문구가 없을 때도 높이를
                유지해 레이아웃이 튀지 않게 한다. */}
            <p
              aria-live="polite"
              className="mt-4 min-h-[1.5rem] text-center text-[0.85rem] text-[var(--tan)]"
            >
              {notice}
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
