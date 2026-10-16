import { ClinicPhotoGallery } from "@/components/ClinicPhoto";
import ConsultationActions from "@/components/ConsultationActions";
import type { Metadata } from "next";
import SectionReveal from "@/components/SectionReveal";
import PageHeroBanner from "@/components/PageHeroBanner";
import { pageMetadata } from "@/lib/page-metadata";
import { CAROUSEL_TARGETS } from "@/lib/carousel-targets";
import {
  CLINIC,
  CLINIC_ADDRESS_CITY,
  CLINIC_ADDRESS_STREET,
  CLINIC_HOURS_LUNCH,
  CLINIC_HOURS_WEEKDAY,
  CLINIC_HOURS_WEEKEND,
  CLINIC_WEEKEND_HOLIDAY_LABEL,
} from "@/lib/clinic";
import JsonLd from "@/components/JsonLd";
import { buildGraph } from "@/lib/schema";
import ClinicMap from "@/components/ClinicMap";

import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import { ListCheck, MapPin } from "@/components/ui/icons";

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

      <PageHeroBanner page="contact" />
      <section id="before-visit" className="scroll-mt-24 mx-auto max-w-5xl px-6 py-10">
        <h2 className="font-serif text-2xl font-semibold text-ink">오늘 방문하시기 전에</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-line bg-card p-5"><h3 className="font-semibold text-ink">접수 마감</h3><p className="mt-3 leading-relaxed text-muted">{CLINIC.receptionNote}</p><p className="mt-2 text-sm text-muted">진료 종료는 평일 오후 8시, 토·일·공휴일 오후 4시입니다.</p></div>
          <div className="rounded-xl border border-line bg-card p-5"><h3 className="font-semibold text-ink">당일 진료·원장 예약</h3><p className="mt-3 leading-relaxed text-muted">침 치료는 예약 없이 당일 방문하실 수 있습니다. 피부 시술이나 특정 원장의 진료를 원하시면 카카오톡으로 희망 시간을 알려주세요.</p></div>
          <div className="rounded-xl border border-line bg-card p-5"><h3 className="font-semibold text-ink">미리 챙겨오세요</h3><p className="mt-3 leading-relaxed text-muted">다른 병원 검사 결과와 복용 중인 약을 알려주시면 진료에 도움이 됩니다.</p></div>
        </div>
        <p className="mt-5 leading-relaxed text-muted">카카오톡에는 {CLINIC.consultationPrompt}</p>
      </section>
      <ClinicPhotoGallery photos={["entrance", "reception"]} title="이 간판과 데스크를 찾아오세요" id="arrival-photos" />

      {/* Info Cards */}
      <section className="section-padding">
        <SectionReveal>
          <div className="grid gap-5 md:grid-cols-3">
            {/* 주소 & 상담 */}
            <div className="card p-7">
              <p className="text-[0.8rem] font-medium tracking-wide text-accent">
                주소
              </p>
              <p className="mt-3 text-text">
                {CLINIC_ADDRESS_CITY}
                <br />
                {CLINIC.streetAddress}
              </p>
              {/* 건물·층은 아래 한 줄에서만 말한다 — 위에 함께 넣으면 중복된다 */}
              <p className="mt-1 text-[0.85rem] text-text-muted">
                {CLINIC.building}
              </p>
              <a href="#consultation" className="mt-4 inline-block text-sm text-primary underline underline-offset-4">카카오톡 상담·예약 안내 ↓</a>
            </div>

            {/* 교통 */}
            <div className="card p-7">
              <p className="text-[0.8rem] font-medium tracking-wide text-accent">
                교통
              </p>
              <p className="mt-3 text-text">
                경의중앙선 풍산역
                <br />
                2번 출구 도보 1분 (100m)
              </p>
            </div>

            {/* 진료시간 */}
            <div className="card p-7">
              <p className="text-[0.8rem] font-medium tracking-wide text-accent">
                진료시간
              </p>
              <ul className="mt-3 space-y-2 text-[0.9rem]">
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
              <p className="mt-3 text-[0.8rem] text-accent">
                주말·공휴일은 점심시간 없이 진료
              </p>
              {/* 명절 휴진 — 「토·일·공휴일 16:00까지」만으로는 드러나지 않는다.
                  문안은 clinic.ts 가 정본이다. */}
              <p className="mt-1 text-[0.8rem] text-accent">{CLINIC.holidayClosedNote}</p>
              <p className="mt-1 text-[0.8rem] text-text-muted">
                {CLINIC.closedNote}
              </p>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Naver Map */}
      <section className="section-padding !pt-0">
        <SectionReveal>
          <ClinicMap />
          <p className="mt-6 text-center text-sm text-muted">방문 전 궁금한 점은 카카오톡으로 편하게 남겨주세요.</p>
          <div id="consultation" className="scroll-mt-24"><ConsultationActions className="mt-4" /></div>
          <p className="mt-5 text-center"><a href="https://naver.me/IItclnGB" target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline underline-offset-4">네이버 플레이스에서 위치 보기 →</a></p>
        </SectionReveal>
      </section>

      {/* Directions Detail */}
      <section className="section-padding">
        <SectionReveal>
          <div className="text-center">
            <SectionBadge icon={<ListCheck size={15} />} label="교통편" />
            <div className="mt-4">
              <TwoTone as="h2" lead="찾아오시는 " accent="방법" />
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="card p-7">
              <h3 className="font-serif text-[1.05rem] font-semibold text-text">
                🚇 경의중앙선
              </h3>
              <ul className="mt-4 space-y-2 text-[0.9rem] text-text-muted">
                <li>풍산역 2번 출구에서 100m</li>
                <li>도보 약 1분 거리</li>
              </ul>
            </div>
            <div className="card p-7">
              <h3 className="font-serif text-[1.05rem] font-semibold text-text">
                🚗 자가용
              </h3>
              <ul className="mt-4 space-y-2 text-[0.9rem] text-text-muted">
                <li>이마트 풍산점 4·5·6·7층 주차</li>
                <li>편한 곳에 주차 후 3층으로 이동</li>
                <li className="text-accent">한의원 이용 시 무료주차 3시간</li>
              </ul>
            </div>
            <div className="card p-7">
              <h3 className="font-serif text-[1.05rem] font-semibold text-text">
                🏬 이마트 내 위치
              </h3>
              <ul className="mt-4 space-y-2 text-[0.9rem] text-text-muted">
                <li>에스컬레이터 — 내려오자마자 바로</li>
                <li>엘리베이터 — 내린 뒤 좌측 끝까지</li>
              </ul>
            </div>
          </div>
        </SectionReveal>
      </section>
    </>
  );
}
