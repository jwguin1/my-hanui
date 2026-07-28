"use client";

import { useEffect, useState } from "react";

/**
 * 진료 상태 판정 (KST 고정)
 *  - 월~금 10:00-20:00, 점심 13:00-14:00 제외
 *  - 토·일 10:00-16:00
 *  - 매달 2·4번째 수요일 휴무
 * 서버/클라이언트 시각 차이로 인한 hydration mismatch 를 피하려고 마운트 후에만 계산한다.
 */
type Status = { open: boolean; label: string };

const OPEN_MIN = 10 * 60;
const LUNCH_START = 13 * 60;
const LUNCH_END = 14 * 60;
const WEEKDAY_CLOSE = 20 * 60;
const WEEKEND_CLOSE = 16 * 60;
const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function kstParts(now: Date) {
  const f = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const get = (t: string) => Number(f.find((p) => p.type === t)?.value ?? 0);
  const y = get("year");
  const m = get("month");
  const d = get("day");
  // 24시는 0시로 정규화
  const hour = get("hour") % 24;
  return { y, m, d, minutes: hour * 60 + get("minute") };
}

/** 매달 2·4번째 수요일 휴무 */
function isHolyday(y: number, m: number, d: number) {
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return weekday === 3 && [2, 4].includes(Math.ceil(d / 7));
}

function closeMinuteOf(weekday: number) {
  return weekday === 0 || weekday === 6 ? WEEKEND_CLOSE : WEEKDAY_CLOSE;
}

function hhmm(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60
  ).padStart(2, "0")}`;
}

function computeStatus(now: Date): Status {
  const { y, m, d, minutes } = kstParts(now);
  const today = new Date(Date.UTC(y, m - 1, d));
  const weekday = today.getUTCDay();
  const closeMin = closeMinuteOf(weekday);
  const openToday = !isHolyday(y, m, d);

  if (openToday && minutes >= OPEN_MIN && minutes < closeMin) {
    const isLunch =
      weekday >= 1 && weekday <= 5 && minutes >= LUNCH_START && minutes < LUNCH_END;
    if (isLunch) {
      return { open: false, label: `점심시간 · ${hhmm(LUNCH_END)} 진료 재개` };
    }
    return { open: true, label: `진료중 ${hhmm(closeMin)}까지` };
  }

  // 다음 진료일 찾기 (오늘 개원 전이면 오늘)
  if (openToday && minutes < OPEN_MIN) {
    return { open: false, label: `진료종료 · 오늘 ${hhmm(OPEN_MIN)} 오픈` };
  }
  for (let i = 1; i <= 8; i += 1) {
    const next = new Date(today.getTime() + i * 86_400_000);
    const ny = next.getUTCFullYear();
    const nm = next.getUTCMonth() + 1;
    const nd = next.getUTCDate();
    if (isHolyday(ny, nm, nd)) continue;
    const when = i === 1 ? "내일" : `${DAY_NAMES[next.getUTCDay()]}요일`;
    return { open: false, label: `진료종료 · ${when} ${hhmm(OPEN_MIN)} 오픈` };
  }
  return { open: false, label: `진료종료 · ${hhmm(OPEN_MIN)} 오픈` };
}

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
