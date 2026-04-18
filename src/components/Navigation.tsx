"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const links: { href: string; label: string; external?: boolean }[] = [
  { href: "/about", label: "일산한의원" },
  { href: "/doctor", label: "의료진" },
  { href: "/column", label: "의학칼럼" },
  { href: "/health-info", label: "건강정보" },
  { href: "/media", label: "유튜브" },
  { href: "/contact", label: "오시는 길" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-bg/95 backdrop-blur-[12px]"
          : "bg-bg/85 backdrop-blur-[12px]"
      }`}
      style={{ height: 64 }}
    >
      <nav className="mx-auto flex h-full max-w-[1100px] items-center justify-between px-6">
        <Link href="/" className="flex items-baseline gap-2.5">
          <span className="font-serif text-[1.05rem] font-bold tracking-[-0.02em] text-text">
            일산한의원
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden gap-7 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group relative text-[0.85rem] tracking-[0.02em] text-text-muted transition-colors duration-200 hover:text-text"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="flex flex-col gap-[5px] md:hidden"
          aria-label="메뉴 열기"
        >
          <span
            className={`block h-[1px] w-5 bg-text transition-all duration-300 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[1px] w-5 bg-text transition-opacity duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[1px] w-5 bg-text transition-all duration-300 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-bg/97 backdrop-blur-[12px] md:hidden">
          <ul className="mx-auto max-w-[1100px] px-6 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="block py-3 text-[0.9rem] text-text-muted transition-colors duration-200 hover:text-text"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
