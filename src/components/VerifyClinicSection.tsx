import SectionReveal from "@/components/SectionReveal";
import SectionBadge from "@/components/ui/SectionBadge";
import { ListCheck } from "@/components/ui/icons";

// 심평원이 공개하는 일산한의원 기관 상세 페이지.
const HIRA_URL = "https://www.hira.or.kr/ra/hosp/hospInfoAjax.do?ykiho=JDU4MTI3MSM1MSMkMSMkMCMkMTMkNDgxOTYxIzMxIyQxIyQzIyQ5MiQzNjEyMjIjNjEjJDEjJDQjJDgz";

export default function VerifyClinicSection() {
  return (
    <section id="clinic-verification" className="scroll-mt-24 bg-[var(--surface)]">
      {/* px-4 는 모바일 헤드라인 한 줄 유지를 위한 것 — px-6 로 되돌리지 않는다 */}
      <div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 md:px-8 lg:py-14">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionBadge icon={<ListCheck size={15} />} label="의료기관 확인" />

            <h2 className="font-serif mt-4 whitespace-nowrap text-[clamp(1.5rem,6.4vw,3rem)] font-bold leading-snug tracking-[-0.02em] text-ink">
              ‘일산한의원’은 한 곳입니다
            </h2>

            <p className="mt-4 text-base leading-7 text-muted">
              일산한의원은 이마트 풍산점 3층에 있습니다.
            </p>
          </div>

          <div className="mx-auto mt-6 max-w-2xl">
            <a
              href={HIRA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex items-center justify-between gap-5 p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] sm:p-6"
            >
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-[0.78rem] font-medium tracking-wide text-[var(--tan)]">
                  건강보험심사평가원
                </span>
                <span className="font-serif mt-1.5 block text-[1.05rem] font-semibold leading-snug text-ink transition-colors duration-200 group-hover:text-primary sm:text-[1.15rem]">
                  심평원에서 일산한의원 정보 보기
                </span>
                <span className="mt-2 block text-[0.85rem] leading-relaxed text-muted">
                  주소와 의료진 현황을 새 창에서 확인하세요.
                </span>
              </span>
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--card)] transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
