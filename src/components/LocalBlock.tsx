export type LocalFaq = { q: string; a: string };

/**
 * 진료 페이지 하단(CTA 위)에 들어가는 지역 문단 블록.
 * 지역명·교통·주차·야간진료를 본문에 담아 지역 검색 의도를 받는다.
 * FAQ 는 details/summary 가 아닌 dl 구조 — 크롤러가 항상 텍스트를 읽을 수 있게 한다.
 */
export default function LocalBlock({
  title,
  paragraphs,
  faqs,
}: {
  title: string;
  paragraphs: [string, string];
  faqs: LocalFaq[];
}) {
  return (
    <section className="bg-[var(--bg)]">
      <div className="section-padding !pb-4">
        <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface p-7">
          <h2 className="text-[18px] font-semibold text-ink">{title}</h2>

          <div className="mt-4 space-y-3">
            {paragraphs.map((p) => (
              <p key={p} className="text-[14px] leading-[1.9] text-muted">
                {p}
              </p>
            ))}
          </div>

          <dl className="mt-6 space-y-4 border-t border-line pt-5">
            {faqs.map((f) => (
              <div key={f.q}>
                <dt className="text-[14px] font-medium text-ink">{f.q}</dt>
                <dd className="mt-1.5 text-[14px] leading-[1.9] text-muted">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
