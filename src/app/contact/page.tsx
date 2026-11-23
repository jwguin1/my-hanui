import { ClinicPhotoGallery } from "@/components/ClinicPhoto";
import ConsultationActions from "@/components/ConsultationActions";
import CalendarDate from "@/components/ClinicCalendarDate";
import Link from "next/link";
import type { Metadata } from "next";
import SectionReveal from "@/components/SectionReveal";
import PillButton from "@/components/ui/PillButton";
import { pageMetadata } from "@/lib/page-metadata";
import { CAROUSEL_TARGETS } from "@/lib/carousel-targets";
import {
  CLINIC,
  CLINIC_ADDRESS_STREET,
  CLINIC_HOURS_LUNCH,
  CLINIC_HOURS_WEEKDAY,
  CLINIC_HOURS_WEEKEND,
  CLINIC_WEEKEND_HOLIDAY_LABEL,
  isPublicHoliday,
  upcomingClinicClosedDates,
  upcomingClinicHolidaySchedules,
} from "@/lib/clinic";
import JsonLd from "@/components/JsonLd";
import { buildGraph } from "@/lib/schema";
import ClinicMap from "@/components/ClinicMap";

import PageHeader from "@/components/ui/PageHeader";
import { MapPin } from "@/components/ui/icons";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: CAROUSEL_TARGETS.contact.title,
  description:
    `${CLINIC_ADDRESS_STREET} ${CLINIC.building}. ${CLINIC.transit}. ${CLINIC.parking}. 평일 ${CLINIC_HOURS_WEEKDAY}, ${CLINIC_WEEKEND_HOLIDAY_LABEL} ${CLINIC_HOURS_WEEKEND}. ${CLINIC.tel}.`,
  ogTitle: "오시는 길 – 일산한의원 위치, 진료시간",
  ogDescription:
    `${CLINIC.building}. 풍산역 도보 1분. ${CLINIC.parking}. ${CLINIC.tel}.`,
});

const graph = buildGraph({
  path: "/contact",
  name: `${CAROUSEL_TARGETS.contact.title} | 일산한의원`,
  description:
    `${CLINIC_ADDRESS_STREET} ${CLINIC.building}. ${CLINIC.transit}. ${CLINIC.parking}. 평일 ${CLINIC_HOURS_WEEKDAY}, ${CLINIC_WEEKEND_HOLIDAY_LABEL} ${CLINIC_HOURS_WEEKEND}. ${CLINIC.tel}.`,
  image: CAROUSEL_TARGETS.contact.hero.src,
});

export default function ContactPage() {
  const now = new Date();
  const upcomingClosures = upcomingClinicClosedDates(now).slice(0, 5);
  const holidays = upcomingClinicHolidaySchedules(now).slice(0, 2);
  return (
    <>
      <JsonLd graph={graph} />
      {/* Hero */}
      <PageHeader
        badge="위치 안내"
        icon={<MapPin size={15} />}
        lead="오시는 "
        accent="길"
        description="이마트 풍산점 3층 · 경의중앙선 풍산역 2번 출구 도보 1분"
      />

      <section id="directions" className="mx-auto max-w-[1100px] px-5 pt-6 pb-3 md:px-8">
        <h2 className="text-xl font-semibold text-ink">{CLINIC_ADDRESS_STREET}</h2>
        <p className="mt-1 text-lg font-semibold text-primary">{CLINIC.building}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <PillButton href="https://naver.me/IItclnGB" variant="solid" icon={<MapPin size={18} />}>네이버 지도·길찾기 →</PillButton>
          <PillButton href="#parking" variant="outline">주차 안내 ↓</PillButton>
          <PillButton href="/doctor#weekly-schedule" variant="outline">의료진 진료 시간표</PillButton>
        </div>
        <div id="parking" className="mt-6 grid scroll-mt-24 gap-4 rounded-2xl bg-surface p-5 text-base leading-relaxed md:grid-cols-2">
          <div><h3 className="font-semibold text-ink">자가용 · 3시간 무료주차</h3><p className="mt-2 text-muted">이마트 4·5·6·7층에 주차 후 3층으로 내려오세요. 엘리베이터에서 내린 뒤 좌측 끝에 있습니다.</p></div>
          <div><h3 className="font-semibold text-ink">전철 · 풍산역 2번 출구</h3><p className="mt-2 text-muted">출구에서 100m, 도보 약 1분입니다. 이마트 3층 에스컬레이터에서 내려오면 바로 보입니다.</p></div>
        </div>
        <div id="from-unjeong" className="mt-6 scroll-mt-24">
          <h2 className="text-xl font-semibold text-ink">파주 운정에서 오시는 길</h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-muted">운정역에서 일산 방면 경의중앙선 일반열차를 타세요. 야당·탄현·일산역을 지나 네 번째 역인 풍산역에서 내리시면 됩니다. 2번 출구로 나와 이마트 풍산점 3층으로 올라오세요.</p>
          <p className="mt-2 max-w-3xl text-base leading-7 text-muted">차로 오실 때는 내비게이션에 ‘이마트 풍산점’을 입력하세요. 4~7층에 주차하고 엘리베이터로 3층에 내려 왼쪽 끝으로 오시면 한의원이 있습니다.</p>
          <p className="mt-2 text-base leading-7 text-ink">{CLINIC.receptionNote}</p>
          <nav aria-label="운정에서 방문하기 전 확인" className="mt-2 flex flex-wrap gap-x-6 font-semibold text-primary underline underline-offset-4">
            <Link href="#before-visit" className="inline-flex min-h-11 items-center">진료일·휴진일 확인</Link>
            <Link href="/pricing#pain" className="inline-flex min-h-11 items-center">초음파 유도 약침 비용</Link>
            <Link href="/skin/spot#skin-booking" className="inline-flex min-h-11 items-center">피부 시술 예약 안내</Link>
          </nav>
        </div>
        <nav aria-label="김포·은평에서 오시는 길" className="mt-5 flex flex-wrap gap-x-6 border-t border-line pt-2 font-semibold text-primary underline underline-offset-4">
          <Link href="/contact/gimpo" className="inline-flex min-h-11 items-center">김포에서 오시는 길</Link>
          <Link href="/contact/eunpyeong" className="inline-flex min-h-11 items-center">서울 은평에서 오시는 길</Link>
        </nav>
      </section>

      {/* Naver Map */}
      <section className="section-padding !py-6">
        <SectionReveal>
          <ClinicMap />
          <p className="mt-6 text-center text-sm text-muted">방문 전 궁금한 점은 카카오톡으로 편하게 남겨주세요.</p>
          <div id="consultation" className="scroll-mt-24"><ConsultationActions className="mt-4" /></div>

        </SectionReveal>
      </section>


      {/* Info Cards */}
      <section className="section-padding">
        <SectionReveal>
          <div className="mx-auto max-w-2xl">
            {/* 진료시간 */}
            <div className="card p-7">
              <p className="text-base font-medium tracking-wide text-accent">
                진료시간
              </p>
              <ul className="mt-3 space-y-2 text-base">
                <li className="flex justify-between">
                  <span className="text-text-muted">월 – 금</span>
                  <span className="text-text">{CLINIC_HOURS_WEEKDAY}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">
                    {CLINIC_WEEKEND_HOLIDAY_LABEL}
                  </span>
                  <span className="text-text">{CLINIC_HOURS_WEEKEND}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">점심 (평일)</span>
                  <span className="text-text-muted">{CLINIC_HOURS_LUNCH}</span>
                </li>
              </ul>
              <p className="mt-3 text-base text-accent">
                주말·공휴일은 점심시간 없이 진료
              </p>
              {/* 명절 휴진 — 「토·일·공휴일 16:00까지」만으로는 드러나지 않는다.
                  문안은 clinic.ts 가 정본이다. */}
              <p className="mt-2 text-base text-text-muted">{CLINIC.closedNote}</p>
              <p className="mt-1 text-base text-accent">{CLINIC.holidayClosedNote}</p>
            </div>
          </div>
        </SectionReveal>
      </section>

      <section id="before-visit" className="scroll-mt-24 mx-auto max-w-5xl px-6 py-10">
        <h2 className="font-serif text-2xl font-semibold text-ink">오늘 방문하시기 전에</h2>
        <div className="mt-5 rounded-xl border border-line bg-surface p-5">
          <h3 className="font-semibold text-ink">다가오는 휴진일</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {upcomingClosures.map((date) => (
              <li key={date} className="rounded-lg border border-line bg-card px-3 py-2 text-sm font-semibold text-ink">
                <CalendarDate date={date} />
              </li>
            ))}
          </ul>
        </div>
        <div id="holiday-schedule" className="mt-5 scroll-mt-24 rounded-xl border border-line bg-card p-5">
            <h3 className="font-semibold text-ink">설·추석 진료 일정</h3>
            {holidays.length === 0 && <p className="mt-2 text-muted">다음 명절의 진료 날짜는 이곳에 안내합니다.</p>}
            <ul className="mt-3 divide-y divide-line text-base leading-relaxed">
              {holidays.map(({ date, name, makeupWednesdays }) => (
                <li key={date} className="py-3 first:pt-0 last:pb-0">
                  <p className="font-semibold text-ink">{date.slice(0, 4)}년 {name}</p>
                  <p className="mt-1"><CalendarDate date={date} /> {name} 당일 휴진</p>
                  {makeupWednesdays.length === 1 ? (
                    <p className="mt-1 text-primary"><CalendarDate date={makeupWednesdays[0]} /> 진료 {isPublicHoliday(makeupWednesdays[0]) ? CLINIC_HOURS_WEEKEND : CLINIC_HOURS_WEEKDAY}</p>
                  ) : (
                    <p className="mt-1 text-muted"><CalendarDate date={makeupWednesdays[0]} /> 또는 <CalendarDate date={makeupWednesdays[1]} />에 진료합니다. 진료일이 정해지면 이곳에 공지합니다.</p>
                  )}
                </li>
              ))}
            </ul>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-line bg-card p-5"><h3 className="font-semibold text-ink">접수 마감</h3><p className="mt-3 leading-relaxed text-muted">{CLINIC.receptionNote}</p><p className="mt-2 text-sm text-muted">진료 종료는 평일 오후 8시, 토·일·공휴일 오후 4시입니다.</p></div>
          <div className="rounded-xl border border-line bg-card p-5"><h3 className="font-semibold text-ink">당일 진료·원장 예약</h3><p className="mt-3 leading-relaxed text-muted">침 치료는 예약 없이 당일 방문하실 수 있습니다. 피부 시술이나 특정 원장의 진료를 원하시면 카카오톡으로 희망 시간을 알려주세요.</p></div>
          <div className="rounded-xl border border-line bg-card p-5"><h3 className="font-semibold text-ink">미리 챙겨오세요</h3><p className="mt-3 leading-relaxed text-muted">다른 병원 검사 결과와 복용 중인 약을 알려주시면 진료에 도움이 됩니다.</p></div>
        </div>
        <p className="mt-5 leading-relaxed text-muted">카카오톡에는 {CLINIC.consultationPrompt}</p>
      </section>
      <ClinicPhotoGallery photos={["entrance", "reception"]} title="이 간판과 데스크를 찾아오세요" id="arrival-photos" />


    </>
  );
}
