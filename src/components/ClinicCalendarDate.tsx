const calendarDate = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul", month: "long", day: "numeric", weekday: "short",
});

export default function ClinicCalendarDate({ date }: { date: string }) {
  return <time dateTime={date}>{calendarDate.format(new Date(`${date}T00:00:00+09:00`))}</time>;
}
