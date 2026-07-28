"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Close, Menu, MessageCircle, Phone } from "@/components/ui/icons";
import {
  SITE_NAV,
  isActiveGroup,
  isActivePath,
} from "@/lib/site-nav";

export default function SiteNavMobile() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(0);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex h-9 w-9 items-center justify-center text-ink lg:hidden"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
      >
        {open ? <Close size={22} /> : <Menu size={22} />}
      </button>

      {open ? (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[999] flex flex-col bg-card lg:hidden">
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
            <ul>
              {SITE_NAV.map((group, i) => {
                const active = isActiveGroup(pathname, group);

                // 하위 없는 단일 링크
                if (group.href) {
                  return (
                    <li key={group.label} className="border-b border-line">
                      <Link
                        href={group.href}
                        onClick={close}
                        className={`block py-4 text-[15px] font-medium ${
                          active ? "text-primary" : "text-ink"
                        }`}
                      >
                        {group.label}
                      </Link>
                    </li>
                  );
                }

                const isOpen = expanded === i;

                return (
                  <li key={group.label} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className={`flex w-full items-center justify-between py-4 text-[15px] font-medium ${
                        active ? "text-primary" : "text-ink"
                      }`}
                    >
                      {group.label}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        className={isOpen ? "rotate-180" : ""}
                      >
                        <path d="M5 9l7 7 7-7" />
                      </svg>
                    </button>

                    {isOpen ? (
                      <ul className="pb-2">
                        {group.items?.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={close}
                              className={`block rounded-lg py-3 pr-3 text-[14px] ${
                                item.indent ? "pl-7" : "pl-3"
                              } ${
                                isActivePath(pathname, item.href)
                                  ? "bg-surface text-primary"
                                  : "text-muted"
                              }`}
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 하단 고정 CTA */}
          <div className="flex gap-2 border-t border-line bg-card px-6 py-4">
            <a
              href="tel:031-976-7706"
              onClick={close}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-[14px] font-medium text-ink"
            >
              <Phone size={16} />
              전화
            </a>
            <a
              href="https://pf.kakao.com/_eXXun"
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-[14px] font-medium text-white"
            >
              <MessageCircle size={16} />
              카카오톡 상담
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
