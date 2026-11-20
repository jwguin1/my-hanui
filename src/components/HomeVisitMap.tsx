import { HOME_VISIT } from "@/lib/home-visit";

export default function HomeVisitMap() {
  return <figure id="visit-coverage-map" className="mx-auto mt-10 max-w-5xl scroll-mt-24 overflow-hidden rounded-2xl border border-line bg-[#f0f5f3]">
    <div className="grid gap-6 p-6 md:grid-cols-2 md:items-center md:gap-10 md:p-10">
      <div aria-label="방문 가능 지역: 고양시와 파주시" className="space-y-3">
        <div className="rounded-2xl border border-[#bdd0c4] bg-white p-6 text-center">
          <p className="text-2xl font-bold text-[#216b55]">파주시</p>
          <p className="mt-2 text-base text-muted">파주시 내 방문진료</p>
        </div>
        <div aria-hidden="true" className="mx-auto h-6 w-px bg-[#8cac9b]" />
        <div className="rounded-2xl border-2 border-[#216b55] bg-white p-6 text-center">
          <p className="text-2xl font-bold text-[#216b55]">고양시</p>
          <p className="mt-2 text-base text-muted">일산동구 · 일산서구 · 덕양구</p>
          <p className="mt-4 rounded-lg bg-[#f6f1e9] px-3 py-3 text-base font-semibold text-primary">출발 · 일산한의원<br /><span className="font-normal">일산동구 풍산역</span></p>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-primary">방문 지역 한눈에 보기</p>
        <h3 className="mt-3 text-2xl font-semibold leading-snug text-ink">고양시·파주시<br />두 지역으로 찾아갑니다</h3>
        <p className="mt-5 text-base leading-[1.85] text-muted">{HOME_VISIT.areaNote}</p>
        <p className="mt-4 text-base leading-[1.85] text-ink">상담할 때 거주하시는 시·구·동과 주소를 알려주세요.</p>
      </div>
    </div>
    <figcaption className="border-t border-line px-6 py-3 text-sm text-muted">고양시·파주시 방문 지역 안내</figcaption>
  </figure>;
}
