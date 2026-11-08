import { CLINIC, holidayFor, isClinicClosedDay, isRegularClinicClosedDay } from "./clinic.ts";

export type Status = { open: boolean; label: string };

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
const HOLIDAY_OPEN = min(CLINIC.hours.holiday.opens);
const HOLIDAY_CLOSE = min(CLINIC.hours.holiday.closes);
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
 * 그날의 마감 시각.
 *
 * **공휴일이 요일보다 먼저다.** 공휴일은 요일과 무관하게 주말과 같은 시간대로 본다.
 * 이 순서가 뒤바뀌면 평일에 걸린 공휴일(추석 금요일, 한글날, 성탄절 …)에
 * 「진료중 20:00까지」가 뜬다. 실제로는 16시에 닫으므로, 그 안내를 보고
 * 저녁에 오신 분은 문 닫힌 곳에 도착한다.
 */
function closeMinuteOf(weekday: number, holiday: boolean) {
  if (holiday) return HOLIDAY_CLOSE;
  return weekday === 0 || weekday === 6 ? WEEKEND_CLOSE : WEEKDAY_CLOSE;
}

function openMinuteOf(holiday: boolean) {
  return holiday ? HOLIDAY_OPEN : OPEN_MIN;
}

function hhmm(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60
  ).padStart(2, "0")}`;
}

/**
 * 다음 진료일 안내 문구 — 「내일 10:00 오픈」.
 * 확정 휴진일과 명절 당일은 건너뛴다. 8일까지만 본다 (그 이상은 표가 이상한 것).
 */
function nextOpenLabel(today: Date): string {
  for (let i = 1; i <= 8; i += 1) {
    const next = new Date(today.getTime() + i * 86_400_000);
    const ny = next.getUTCFullYear();
    const nm = next.getUTCMonth() + 1;
    const nd = next.getUTCDate();
    const nextYmd = ymd(ny, nm, nd);
    if (isClinicClosedDay(nextYmd)) continue;
    const when = i === 1 ? "내일" : `${DAY_NAMES[next.getUTCDay()]}요일`;
    const nextOpen = openMinuteOf(holidayFor(nextYmd)?.open === true);
    return `${when} ${hhmm(nextOpen)} 오픈`;
  }
  return `${hhmm(OPEN_MIN)} 오픈`;
}

export function computeStatus(now: Date): Status {
  const { y, m, d, minutes } = kstParts(now);
  const today = new Date(Date.UTC(y, m - 1, d));
  const weekday = today.getUTCDay();
  const today0 = ymd(y, m, d);
  const holidayToday = holidayFor(today0);
  // 설·추석 당일은 공휴일이지만 **휴진**이다. 여는 공휴일과 갈라 본다.
  const holiday = holidayToday?.open === true;
  const closeMin = closeMinuteOf(weekday, holiday);
  const openMin = openMinuteOf(holiday);
  const openToday = !isClinicClosedDay(today0);
  if (!openToday) {
    const reason = isRegularClinicClosedDay(today0) ? "정기 휴진" : holidayToday?.open === false ? `${holidayToday.name} 휴진` : "휴진";
    return { open: false, label: `${reason} · ${nextOpenLabel(today)}` };
  }

  if (openToday && minutes >= openMin && minutes < closeMin) {
    /* 점심시간은 **평일에만** 있다. 공휴일은 주말과 마찬가지로 이어서 본다 —
       공휴일을 요일로만 판정하면 여기서 13시에 「점심시간」이 떠 버린다. */
    const isLunch =
      !holiday &&
      weekday >= 1 &&
      weekday <= 5 &&
      minutes >= LUNCH_START &&
      minutes < LUNCH_END;
    if (isLunch) {
      return { open: false, label: `점심시간 · ${hhmm(LUNCH_END)} 진료 재개` };
    }
    return { open: true, label: `진료중 ${hhmm(closeMin)}까지` };
  }

  // 다음 진료일 찾기 (오늘 개원 전이면 오늘)
  if (openToday && minutes < openMin) {
    return { open: false, label: `진료종료 · 오늘 ${hhmm(openMin)} 오픈` };
  }
  return { open: false, label: `진료종료 · ${nextOpenLabel(today)}` };
}
