import { HOME_VISIT } from "@/lib/home-visit";
import Image from "next/image";

export default function HomeVisitMap() {
  return <figure id="visit-coverage-map" className="mx-auto mt-10 max-w-5xl scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-[#f0f5f3]">
    <div className="grid lg:grid-cols-[1.4fr_1fr] lg:items-center">
      <div className="min-w-0 p-2 sm:p-4">
        <Image src="/images/home-visit-goyang-paju.svg" alt="고양시·파주시 방문진료 지도. 파주시는 연한 초록, 고양시 일산동구·일산서구·덕양구는 진한 초록으로 표시했습니다. 출발점은 일산동구 풍산역의 일산한의원입니다." width={640} height={680} sizes="(max-width: 1023px) calc(100vw - 64px), 600px" className="h-auto w-full" />
      </div>
      <div className="p-6 md:p-8">
        <p className="text-sm font-semibold text-primary">방문 지역 한눈에 보기</p>
        <h3 className="mt-3 text-2xl font-semibold leading-snug text-ink">고양시·파주시<br />두 지역으로 찾아갑니다</h3>
        <ul className="mt-5 space-y-3 text-base leading-relaxed text-ink">
          <li className="flex gap-3"><span aria-hidden="true" className="mt-1.5 h-4 w-4 shrink-0 rounded-sm border border-[#2c6d56] bg-[#8bc0aa]" /><span><strong>고양시</strong><br />일산동구 · 일산서구 · 덕양구</span></li>
          <li className="flex gap-3"><span aria-hidden="true" className="mt-1.5 h-4 w-4 shrink-0 rounded-sm border border-[#2c6d56] bg-[#cde3cf]" /><strong>파주시</strong></li>
        </ul>
        <p className="mt-5 text-base leading-[1.85] text-muted">{HOME_VISIT.areaNote}</p>
        <p className="mt-4 text-base leading-[1.85] text-ink">카카오톡 상담 때 거주하시는 시·구·동을 알려주세요.</p>
      </div>
    </div>
    <figcaption className="border-t border-line px-6 py-4 text-sm leading-relaxed text-muted">색칠한 고양시·파주시가 방문 지역입니다. 행정경계를 단순화한 안내지도입니다.<br />지도 자료: 통계청 SGIS 2018 · <a href="https://github.com/southkorea/southkorea-maps/tree/master/kostat/2018/json" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">southkorea-maps</a> · 공공누리 제1유형</figcaption>
  </figure>;
}
