"use client";

import { useEffect, useState } from "react";
import { CLINIC } from "@/lib/clinic";

/**
 * 진료 상태 판정 (KST 고정)
 *  - 시각은 전부 lib/clinic.ts 파생 (여기에 숫자를 적지 않는다)

 *  - 확정 휴진일(CLINIC.closedDates)만 휴진 처리. 2·4 수요일은 「확인」 표시만
 * 서버/클라이언트 시각 차이로 인한 hydration mismatch 를 피하려고 마운트 후에만 계산한다.
 */
type Status = { open: boolean; label: string };

/** "HH:MM" → 분. 진료시간 정본은 lib/clinic.ts 하나뿐이다 — 여기에 숫자를 적지 않는다. */
const min = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

const OPEN_MIN = min(CLINIC.hours.weekdayMorning.opens);
const LUNCH_START = min(CLINIC.hours.weekdayMorning.closes);
const LUNCH_END = min(CLINIC.hours.weekdayAfternoon.opens);
const WEEKDAY_CLOSE = min(CLINIC.hours.weekdayAfternoon.closes);
const WEEKEND_CLOSE = min(CLINIC.hours.weekend.closes);
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

/** `YYYY-MM-DD` */
function ymd(y: number, m: number, d: number) {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

/**
 * 확정된 휴진일인가 — **원장이 clinic.ts 에 적어 둔 날짜만** 휴진으로 본다.
 *
 * 예전에는 「2·4번째 수요일」을 규칙으로 자동 판정해 그날 뱃지를 「진료종료」로
 * 띄웠다. 그런데 이마트 의무휴업일에도 **실제로는 대부분 문을 연다.**
 * 열려 있는 날 「진료종료 · 목요일 10:00 오픈」이 뜨면 올 사람을 돌려보낸다 —
 * 방향이 잘못된 손실이라 규칙 자동 판정을 걷어냈다.
 */
function isClosedDate(y: number, m: number, d: number) {
  return CLINIC.closedDates.includes(ymd(y, m, d));
}

/**
 * 이마트 의무휴업일 후보(2·4번째 수요일)인가.
 *
 * 휴진으로 단정하지 않는다. 정상 진료로 계산하되 뱃지 끝에 「확인」만 덧붙여,
 * 대부분 여는 날의 정보를 지키면서 예외 가능성만 알린다.
 */
function isMartClosureWednesday(y: number, m: number, d: number) {
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
  const openToday = !isClosedDate(y, m, d);
  // 의무휴업일 후보면 「진료중」 뒤에 확인 안내를 덧붙인다 (닫혔다고 말하지 않는다)
  const caution = isMartClosureWednesday(y, m, d) ? " · 확인" : "";

  if (openToday && minutes >= OPEN_MIN && minutes < closeMin) {
    const isLunch =
      weekday >= 1 && weekday <= 5 && minutes >= LUNCH_START && minutes < LUNCH_END;
    if (isLunch) {
      return { open: false, label: `점심시간 · ${hhmm(LUNCH_END)} 진료 재개` };
    }
    return { open: true, label: `진료중 ${hhmm(closeMin)}까지${caution}` };
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
    if (isClosedDate(ny, nm, nd)) continue;
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
