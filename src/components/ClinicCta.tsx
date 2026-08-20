import { CLINIC, CLINIC_CTA_LINES } from "@/lib/clinic";

/**
 * 글 하단 전환 블록.
 *
 * ## 왜 필요한가
 *
 * 환자 질문형 글 21편은 읽고 나면 갈 곳이 없었다 — 관련 글 링크뿐이고
 * 전화번호도 위치도 진료시간도 그 페이지에 없다.
 *
 * AI 쪽도 같은 문제다. 「일산에서 어깨 아픈데 어디 가야 해」에 답하려면
 * **의학 내용과 병원 정보가 같은 페이지에 있어야 한다.** 지금은 흩어져 있어서
 * AI 가 이 글들을 인용하면서도 병원을 추천하지는 못한다.
 *
 * ## clinicNote
 *
 * 글마다 다른 2~3문장이고 **원장이 직접 쓴다.** 자동 생성하지 않는다 —
 * 21편에 같은 말이 반복되면 정보량이 0이고 자동 생성된 티가 난다.
 * 그건 신뢰를 얻으려고 넣은 블록이 정확히 반대로 작동하는 것이다.
 *
 * 비어 있으면 소제목과 문단을 통째로 렌더링하지 않는다.
 * 빈 제목만 남는 것보다 없는 편이 낫고, 원장이 순서대로 채워 넣는 동안
 * 하단 정보 두 줄은 21편 전부에서 이미 제 역할을 한다.
 */
export default function ClinicCta({ note }: { note?: string }) {
  const body = (note ?? "").trim();

  return (
    <section className="section-padding !pt-0">
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface p-6 sm:p-8">
        {body ? (
          <>
            <h2 className="font-serif text-[1.1rem] font-semibold leading-snug text-ink">
              이럴 때 진료실에서 확인합니다
            </h2>
            <p className="mt-3 whitespace-pre-line text-[0.95rem] leading-[1.9] text-muted">
              {body}
            </p>
            <hr className="mt-6 border-line" />
          </>
        ) : null}

        <address
          className={`${body ? "mt-6" : ""} space-y-1 text-[0.9rem] not-italic leading-[1.8] text-ink`}
        >
          {CLINIC_CTA_LINES.map((line, i) => (
            <p key={line}>
              {/* 마지막 줄의 전화번호만 tel: 링크로 만든다.
                  모바일에서 글을 다 읽은 직후가 전화가 가장 잘 눌리는 지점이다. */}
              {i === CLINIC_CTA_LINES.length - 1 ? (
                <>
                  {line.replace(` · ${CLINIC.tel}`, "")}
                  {" · "}
                  <a
                    href={CLINIC.telHref}
                    className="font-semibold text-primary transition-colors duration-200 hover:text-tan"
                  >
                    {CLINIC.tel}
                  </a>
                </>
              ) : (
                line
              )}
            </p>
          ))}
        </address>
      </div>
    </section>
  );
}
