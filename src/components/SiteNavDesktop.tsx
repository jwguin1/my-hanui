"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  SITE_NAV,
  isActiveGroup,
  isActivePath,
} from "@/lib/site-nav";

export default function SiteNavDesktop() {
  const pathname = usePathname() ?? "/";
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <nav className="hidden lg:block">
      <ul className="flex items-center gap-6">
        {SITE_NAV.map((group, i) => {
          const active = isActiveGroup(pathname, group);
          const base = `whitespace-nowrap text-[14px] transition-colors duration-200 ${
            active ? "text-primary" : "text-muted hover:text-ink"
          }`;

          // 하위 없는 단일 링크
          if (group.href) {
            return (
              <li key={group.label}>
                <Link href={group.href} className={base}>
                  {group.label}
                </Link>
              </li>
            );
          }

          const open = openIdx === i;

          return (
            <li
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpenIdx(i)}
              onMouseLeave={() => setOpenIdx((c) => (c === i ? null : c))}
              // 패널 밖으로 포커스가 나가면 닫는다 (키보드 접근)
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                  setOpenIdx((c) => (c === i ? null : c));
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpenIdx(null);
              }}
            >
              <button
                type="button"
                className={`${base} inline-flex items-center gap-1`}
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpenIdx(open ? null : i)}
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

              {/* 패널은 항상 DOM 에 두고 표시만 토글한다 —
                  조건부 렌더면 하위 링크가 SSR HTML 에서 빠져 크롤러가 보지 못한다 */}
              <div
                className={`absolute left-0 top-full z-10 mt-2 min-w-[168px] rounded-xl border border-line bg-card p-1.5 ${
                  open ? "block" : "hidden"
                }`}
              >
                <ul>
                    {group.items?.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setOpenIdx(null)}
                          className={`block whitespace-nowrap rounded-lg px-3 py-2.5 text-[14px] transition-colors duration-200 hover:bg-surface ${
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
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
