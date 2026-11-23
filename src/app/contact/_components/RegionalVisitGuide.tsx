import Link from "next/link";
import ConsultationActions from "@/components/ConsultationActions";
import DoctorSchedule from "@/components/DoctorSchedule";
import JsonLd from "@/components/JsonLd";
import PillButton from "@/components/ui/PillButton";
import { CLINIC, CLINIC_ADDRESS_STREET, CLINIC_HOURS_LUNCH, CLINIC_HOURS_WEEKDAY, CLINIC_HOURS_WEEKEND } from "@/lib/clinic";
import { buildGraph } from "@/lib/schema";

interface RegionalGuide {
  path: string;
  title: string;
  description: string;
  origin: string;
  driving: string;
  railSteps: readonly string[];
}

const sectionHeading = "text-xl font-semibold text-ink";
const detailLink = "inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4";

export default function RegionalVisitGuide({ guide }: { guide: RegionalGuide }) {
  return (
    <>
      <JsonLd graph={buildGraph({ path: guide.path, name: guide.title, description: guide.description })} />
      <article className="mx-auto max-w-3xl px-5 pb-14 pt-6 text-base leading-7 text-muted sm:px-8">
        <Link href="/contact" className={detailLink}>오시는 길 전체 보기</Link>
        <header className="mb-7 mt-4 border-b border-line pb-6">
          <h1 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">{guide.origin}에서 일산한의원 오시는 길</h1>
          <p className="mt-3 text-lg font-semibold text-ink">{CLINIC.building}</p>
          <p>{CLINIC_ADDRESS_STREET}</p>
        </header>
        <div className="space-y-8">
          <section>
            <h2 className={sectionHeading}>자가용으로 오실 때</h2>
            <p className="mt-2">{guide.driving}</p>
            <PillButton href="https://naver.me/IItclnGB" variant="outline" className="mt-3">네이버 지도에서 길찾기</PillButton>
          </section>
          <section>
            <h2 className={sectionHeading}>전철로 오실 때</h2>
            <ol className="mt-2 list-decimal space-y-1 pl-6 marker:font-semibold marker:text-primary">
              {guide.railSteps.map(step => <li key={step}>{step}</li>)}
              <li>풍산역 2번 출구에서 이마트 풍산점까지 걸어서 약 1분입니다. 한의원은 3층에 있습니다.</li>
            </ol>
          </section>
          <section>
            <h2 className={sectionHeading}>어디에 주차하나요?</h2>
            <p className="mt-2 font-semibold text-ink">{CLINIC.parkingDetail}</p>
            <p>편한 층에 주차한 뒤 엘리베이터로 3층에 내려 왼쪽 끝으로 오세요.</p>
            <Link href="/contact#arrival-photos" className={detailLink}>한의원 입구와 접수대 사진</Link>
          </section>
          <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
            <h2 className={sectionHeading}>일요일에는 몇 시까지 접수하나요?</h2>
            <p className="mt-2 font-semibold text-ink">{CLINIC.receptionNote}</p>
            <p className="mt-2">진료시간은 평일 {CLINIC_HOURS_WEEKDAY}, 토·일·공휴일 {CLINIC_HOURS_WEEKEND}입니다. 평일 점심은 {CLINIC_HOURS_LUNCH}이며, 주말과 공휴일에는 점심시간 없이 진료합니다.</p>
            <p className="mt-2">{CLINIC.closedNote} {CLINIC.holidayClosedNote}</p>
            <Link href="/contact#before-visit" className={detailLink}>다가오는 휴진일 확인</Link>
          </section>
          <DoctorSchedule embedded />
          <section>
            <h2 className={sectionHeading}>진료 예약</h2>
            <p className="mt-2">원하는 원장님과 방문 시간을 카카오톡이나 전화로 알려주세요. 피부 시술을 예약하실 때는 시술받을 부위도 함께 말씀해 주세요.</p>
            <div className="mt-1 flex flex-wrap gap-x-5">
              <Link href="/internal/dyspepsia" className={detailLink}>기능성 소화불량 진료</Link>
              <Link href="/pricing#pain" className={detailLink}>초음파 유도 약침 비용</Link>
              <Link href="/skin/spot#skin-booking" className={detailLink}>피부 시술 예약 안내</Link>
            </div>
            <ConsultationActions className="mt-4 sm:justify-start" kakaoLabel="카카오톡으로 진료 예약 문의" />
          </section>
        </div>
      </article>
    </>
  );
}
