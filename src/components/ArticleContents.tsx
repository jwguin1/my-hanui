export default function ArticleContents({ headings }: { headings: string[] }) {
  if (headings.length < 3) return null;

  return (
    <details className="mx-auto mb-7 max-w-3xl rounded-xl border border-line bg-surface px-4 py-3">
      <summary className="cursor-pointer py-2 text-base font-semibold text-ink">
        궁금한 내용 바로 찾기
        <span className="ml-2 text-sm font-normal text-muted">목차 {headings.length}개</span>
      </summary>
      <nav aria-label="이 글의 목차" className="mt-2 border-t border-line pt-2">
        <ol className="text-base text-primary">
          {headings.map((heading, i) => (
            <li key={`${i}-${heading}`}>
              <a href={`#section-${i + 1}`} className="block min-h-11 py-2.5 underline underline-offset-4">
                {heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
