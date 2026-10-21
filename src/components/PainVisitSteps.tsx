import Link from "next/link";
import ClinicPhoto from "@/components/ClinicPhoto";
import { CARE_GUIDE } from "@/lib/care-guide";

const steps = [
  { title: "접수 · 불편한 점을 알려주세요", text: "어디가 아픈지, 언제부터 불편했는지 말씀해 주세요. 다른 병원 검사 결과와 복용 중인 약도 함께 확인합니다." },
  { title: "진찰 · 치료와 비용을 상의합니다", text: "통증 부위와 움직임을 살피고, 필요한 경우 초음파 검사를 함께 확인합니다. 침·추나·약침 중 필요한 치료와 비용을 설명드립니다." },
  { title: "침 · 기본 물리치료를 받습니다", text: CARE_GUIDE.basic },
  { title: "경과 · 다음 치료를 안내합니다", text: "치료 후 살펴볼 변화와 다음 내원 일정을 안내합니다. 추가 물리치료를 원하시면 데스크에서 이용 안내를 받으세요." },
];

export default function PainVisitSteps() {
  return <>
    <p className="mt-4 text-center text-base leading-relaxed text-muted">무엇을 준비하고, 어떤 순서로 치료받는지 미리 살펴보세요.</p>
    <div className="mt-6 grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-surface p-4"><p className="text-base text-muted">접수부터 기본 치료까지</p><p className="mt-2 text-2xl font-semibold text-primary">40분 이내</p></div>
      <div className="rounded-xl bg-surface p-4"><p className="text-base text-muted">추가 물리치료까지 받으면</p><p className="mt-2 text-2xl font-semibold text-primary">약 70분</p></div>
    </div>
    <ol className="mt-6 grid gap-3 sm:grid-cols-2">
      {steps.map((s, i) => <li key={s.title} className="rounded-xl border border-line bg-white p-5"><p className="text-sm font-semibold text-primary">0{i + 1}</p><h3 className="mt-2 text-lg font-semibold leading-relaxed text-ink">{s.title}</h3><p className="mt-3 text-base leading-relaxed text-muted">{s.text}</p></li>)}
    </ol>
    <div id="physical-therapy" className="mt-8 scroll-mt-24 rounded-2xl border border-line bg-white p-5 md:p-6">
      <h3 className="text-xl font-semibold text-ink">추가 물리치료실, 이렇게 이용하세요</h3>
      <p className="mt-3 text-base font-semibold leading-relaxed text-primary">기본 보험진료를 받으신 분은 무료로 이용하실 수 있습니다.</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="추가 물리치료실 장비">
        {["물침대", "세라젬", "안마의자", "골반교정기", "초음파치료기"].map(item => <li key={item} className="rounded-lg bg-surface px-3 py-2 text-base text-ink">{item}</li>)}
      </ul>
      <p className="mt-4 text-base leading-relaxed text-muted">추가 물리치료까지 받으시면 접수부터 전체 약 1시간 10분이 걸립니다. 여유 있게 치료받고 싶으시면 내원할 때 데스크에 말씀해 주세요.</p>
      <Link href="/pricing#pain" className="mt-3 inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4">기본 진료·추나·약침 비용 보기 →</Link>
    </div>
    <div className="mt-6"><ClinicPhoto photo="room" /></div>
    <Link href="/contact#arrival-photos" className="mt-3 inline-flex min-h-11 items-center text-base font-medium text-primary underline underline-offset-4">입구와 접수 데스크 사진도 확인하세요 →</Link>
  </>;
}
