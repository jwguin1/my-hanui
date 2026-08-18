import type { SchemaNode } from "@/lib/schema";

/**
 * 페이지당 하나뿐인 JSON-LD 출력 컴포넌트.
 *
 * - @graph 배열 하나를 담은 단일 <script type="application/ld+json"> 만 출력한다.
 * - 서버 컴포넌트다 ("use client" 를 붙이지 말 것) — 구조화 데이터는 반드시
 *   서버 렌더링된 HTML 안에 있어야 한다.
 * - JSON.stringify 결과의 "<" 를 < 로 이스케이프해 </script> 조기 종료를 막는다.
 */
export default function JsonLd({ graph }: { graph: SchemaNode[] }) {
  const json = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  }).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
