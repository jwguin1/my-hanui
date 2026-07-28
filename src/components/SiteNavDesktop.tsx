"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SITE_NAV, isActiveGroup, isActivePath } from "@/lib/site-nav";

/** 대각선으로 이동하다 잠깐 벗어나도 버티도록 하는 닫힘 지연 */
const CLOSE_DELAY_MS = 200;

export default function SiteNavDesktop() {
  const pathname = usePathname() ?? "/";
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const cancelClose = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const openGroup = (i: number) => {
    cancelClose();
    setOpenIdx(i);
  };

  const scheduleClose = () => {
    cancelClose();
    timerRef.current = window.setTimeout(
      () => setOpenIdx(null),
      CLOSE_DELAY_MS
    );
  };

  const closeNow = () => {
    cancelClose();
    setOpenIdx(null);
  };

  useEffect(() => cancelClose, []);

  // 패널 바깥 클릭 시 닫기
  useEffect(() => {
    if (openIdx === null) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) closeNow();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [openIdx]);

  return (
    <nav ref={navRef} className="hidden lg:block">
      <ul className="flex items-center gap-6">
        {SITE_NAV.map((group, i) => {
          const active = isActiveGroup(pathname, group);
          const open = openIdx === i;
          const triggerCls = `whitespace-nowrap text-[14px] transition-colors duration-200 ${
            open || active ? "text-primary" : "text-muted hover:text-ink"
          }`;

          // 하위 없는 단일 링크
          if (group.href) {
            return (
              <li key={group.label}>
                <Link href={group.href} className={triggerCls}>
                  {group.label}
                </Link>
              </li>
            );
          }

          return (
            // 열림 상태는 이 li 가 소유한다 — 트리거에만 걸면 패널 위에서 닫힌다
            <li
              key={group.label}
              className="relative"
              onMouseEnter={() => openGroup(i)}
              onMouseLeave={scheduleClose}
              onFocus={() => openGroup(i)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  closeNow();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape" && openIdx === i) {
                  closeNow();
                  triggerRefs.current[i]?.focus();
                }
              }}
            >
              <button
                ref={(el) => {
                  triggerRefs.current[i] = el;
                }}
                type="button"
                className={`${triggerCls} inline-flex items-center gap-1`}
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => (open ? closeNow() : openGroup(i))}
              >
                {group.label}
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 9l7 7 7-7" />
                </svg>
              </button>

              {/* 래퍼가 트리거 하단에 빈틈없이 붙고, 시각적 간격 8px 은
                  margin 이 아니라 padding 으로 만든다 — 이 8px 도 hover 영역이다.
                  패널은 조건부 렌더가 아니라 표시만 토글해 SSR HTML 에 링크를 남긴다. */}
              {/* 패널 폭이 168px 이고 nav 가 중앙 정렬이라 우측 넘침이 발생하지 않는다.
                  전 그룹 좌측 정렬로 통일한다. */}
              <div
                className={`absolute left-0 top-full z-10 pt-2 ${
                  open ? "block" : "hidden"
                }`}
              >
                <div className="min-w-[190px] rounded-xl border border-line bg-card p-1.5">
                  {group.sections?.map((section, si) => (
                    <div
                      key={section.label ?? si}
                      className={
                        si > 0 ? "mt-1.5 border-t border-line pt-1.5" : ""
                      }
                    >
                      {/* 계층은 라벨이 표현한다 — 클릭/포커스 대상이 아니다 */}
                      {section.label ? (
                        <div className="px-4 pb-1.5 pt-2.5 text-[12px] tracking-[0.04em] text-muted">
                          {section.label}
                        </div>
                      ) : null}
                      <ul>
                        {section.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={closeNow}
                              className={`block whitespace-nowrap rounded-lg px-4 py-2.5 text-[14px] transition-colors duration-200 hover:bg-surface ${
                                isActivePath(pathname, item.href)
                                  ? "text-primary"
                                  : "text-ink"
                              }`}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
