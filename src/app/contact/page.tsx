import type { Metadata } from "next";
import SectionReveal from "@/components/SectionReveal";
import PageHeroBanner from "@/components/PageHeroBanner";
import { pageMetadata } from "@/lib/page-metadata";
import { CAROUSEL_TARGETS } from "@/lib/carousel-targets";
import JsonLd from "@/components/JsonLd";
import { buildGraph } from "@/lib/schema";

import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import { ListCheck, MapPin } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  path: "/contact",
  title: CAROUSEL_TARGETS.contact.title,
  description:
    "경기 고양시 일산동구 무궁화로 237 이마트 풍산점 3층. 경의중앙선 풍산역 2번 출구 도보 1분. 무료주차 3시간. 평일 10:00-20:00, 토일 10:00-16:00. 031-976-7706.",
  ogTitle: "오시는 길 – 일산한의원 위치, 진료시간",
  ogDescription:
    "이마트 풍산점 3층. 풍산역 도보 1분. 무료주차 3시간. 031-976-7706.",
});

const graph = buildGraph({
  path: "/contact",
  name: `${CAROUSEL_TARGETS.contact.title} | 일산한의원`,
  description:
    "경기 고양시 일산동구 무궁화로 237 이마트 풍산점 3층. 경의중앙선 풍산역 2번 출구 도보 1분. 무료주차 3시간. 평일 10:00-20:00, 토일 10:00-16:00. 031-976-7706.",
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

      {/* Info Cards */}
      <section className="section-padding">
        <SectionReveal>
          <div className="grid gap-5 md:grid-cols-3">
            {/* 주소 & 전화 */}
            <div className="card p-7">
              <p className="text-[0.8rem] font-medium tracking-wide text-accent">
                주소 · 전화
              </p>
              <p className="mt-3 text-text">
                경기 고양시 일산동구
                <br />
                무궁화로 237, 3층
              </p>
              <p className="mt-1 text-[0.85rem] text-text-muted">
                이마트 풍산점 3층
              </p>
              <a
                href="tel:031-976-7706"
                className="mt-3 block text-[1.1rem] font-semibold text-text transition-colors hover:text-accent"
              >
                031-976-7706
              </a>
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
                  <span className="text-text">10:00 – 20:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">토 · 일</span>
                  <span className="text-text">10:00 – 16:00</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-text-muted">점심 (평일)</span>
                  <span className="text-text-muted">13:00 – 14:00</span>
                </li>
              </ul>
              <p className="mt-3 text-[0.8rem] text-accent">
                주말·공휴일은 점심시간 없이 진료
              </p>
              <p className="mt-1 text-[0.8rem] text-text-muted">
                매달 2·4번째 수요일 휴무 (이마트 풍산점 휴업일)
              </p>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* Naver Map */}
      <section className="section-padding !pt-0">
        <SectionReveal>
          <div className="overflow-hidden rounded-[10px] border border-border">
            <iframe
              src="https://map.naver.com/p/entry/place/1040901343?placePath=%2Fhome"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="일산한의원 네이버 지도"
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://naver.me/IItclnGB"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#03C75A] px-7 py-3.5 text-[0.9rem] font-semibold text-white transition-opacity hover:opacity-90"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.27 10.6L6.44 1H1v18h5.73V9.4L13.56 19H19V1h-5.73z" />
              </svg>
              네이버 플레이스 보기
            </a>
            <a
              href="https://pf.kakao.com/_eXXun"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#FEE500] px-7 py-3.5 text-[0.9rem] font-semibold text-[#3C1E1E] transition-opacity hover:opacity-90"
            >
              💬 카카오톡 상담
            </a>
            <a
              href="tel:031-976-7706"
              className="inline-flex items-center gap-2 rounded-md border border-border px-7 py-3.5 text-[0.9rem] font-semibold text-text transition-all hover:border-accent hover:text-accent"
            >
              📞 전화 상담
            </a>
          </div>
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
