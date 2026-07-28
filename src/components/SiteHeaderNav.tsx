"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Close } from "@/components/ui/icons";

export default function SiteHeaderNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);

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
        <div className="absolute left-0 right-0 top-16 border-b border-line bg-card lg:hidden">
          <ul className="mx-auto max-w-[1180px] px-6 py-2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line py-3 text-[14px] text-ink last:border-b-0"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
