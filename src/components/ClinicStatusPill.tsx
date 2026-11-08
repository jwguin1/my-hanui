"use client";

import { useEffect, useState } from "react";
import { computeStatus, type Status } from "@/lib/clinic-status";

export default function ClinicStatusPill() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    const update = () => setStatus(computeStatus(new Date()));
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const base =
    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] leading-none whitespace-nowrap";

  // 마운트 전에는 같은 크기의 자리만 잡아 레이아웃 흔들림과 hydration mismatch 를 함께 막는다
  if (!status) {
    return (
      <span className={`${base} invisible bg-surface text-muted`} aria-hidden="true">
        <span>●</span>진료중 20:00까지
      </span>
    );
  }

  return (
    <span
      className={`${base} ${
        status.open ? "bg-[#E9F5F0] text-ok" : "bg-surface text-muted"
      }`}
    >
      <span aria-hidden="true">●</span>
      {status.label}
    </span>
  );
}
