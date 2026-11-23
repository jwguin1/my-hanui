import Link from "next/link";
import { CLINIC } from "@/lib/clinic";
import { DOCTOR_WORKDAYS, WEEKDAYS } from "@/lib/doctor-profile";
import { DOCTOR_SLUGS } from "@/lib/schema";

export default function DoctorSchedule() {
  return (
    <section id="weekly-schedule" aria-labelledby="schedule-title" className="mx-auto max-w-4xl scroll-mt-24 px-4 py-8 sm:px-6 md:py-12">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="schedule-title" className="text-2xl font-semibold text-ink md:text-3xl">의료진 진료 시간표</h2>
        <span className="shrink-0 text-sm font-medium text-primary"><span aria-hidden="true">● </span>진료일</span>
      </div>
      <div className="mt-4 overflow-hidden rounded-xl border border-line bg-card">
        <table className="w-full table-fixed border-collapse text-center text-base text-ink">
          <caption className="sr-only">원장별 정규 진료 요일. 이름을 선택하면 원장 소개로 이동합니다.</caption>
          <thead className="bg-surface">
            <tr>
              <th scope="col" className="w-[4.5rem] py-3 font-semibold sm:w-32">원장</th>
              {WEEKDAYS.map(day => <th key={day} scope="col" className="py-3 font-semibold">{day}<span className="sr-only">요일</span></th>)}
            </tr>
          </thead>
          <tbody>
            {Object.entries(DOCTOR_WORKDAYS).map(([name, days]) => (
              <tr key={name} className="border-t border-line">
                <th scope="row" className="font-semibold">
                  <Link href={`#${DOCTOR_SLUGS[name]}`} aria-label={`${name} 원장 소개`} className="inline-flex min-h-11 items-center px-1 text-primary underline decoration-primary/40 underline-offset-4">{name}</Link>
                </th>
                {WEEKDAYS.map(day => {
                  const onDuty = days.some(workday => workday === day);
                  return <td key={day}>
                    <span aria-hidden="true" className={onDuty ? "text-primary" : "text-muted"}>{onDuty ? "●" : "–"}</span>
                    <span className="sr-only">{onDuty ? "진료" : "진료 없음"}</span>
                  </td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-base leading-relaxed text-muted">{CLINIC.closedNote} {CLINIC.holidayClosedNote}</p>
      <nav aria-label="진료일과 예약" className="mt-1 flex flex-wrap gap-x-6 text-base font-semibold text-primary underline underline-offset-4">
        <Link href="/contact#holiday-schedule" className="inline-flex min-h-11 items-center">명절 진료 일정</Link>
        <a href={CLINIC.kakaoHref} className="inline-flex min-h-11 items-center">원장 지정 카카오톡 문의</a>
      </nav>
    </section>
  );
}
