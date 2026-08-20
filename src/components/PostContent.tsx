import Image from "next/image";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function PostContent({ markdown }: { markdown: string }) {
  let imgIndex = 0;

  return (
    <Markdown
      /* GFM 표를 켠다. 없으면 파이프 표가 <p> 안에 문자 그대로 박힌다 —
         본문 24편의 표가 그 상태로 배포돼 있었다.

         singleTilde: false 가 핵심이다. GFM 기본값은 물결 하나짜리
         취소선(~text~)도 인정하는데, 본문에는 "1~3주 | 2~4주" 같은
         숫자 범위가 흔하다. 한 줄에 물결이 둘이면 그 사이가 통째로
         취소선이 된다 (해당 7줄 확인). 켜지 않는다. */
      remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
      components={{
        /* 표는 가로 스크롤 컨테이너로 감싼다 — 모바일에서 페이지 자체가
           옆으로 밀리면 안 된다. react-markdown 은 <table> 을 그대로 뱉으므로
           여기서 감싸주지 않으면 감쌀 곳이 없다. */
        table({ children }) {
          return (
            <div className="prose-table-wrap">
              <table>{children}</table>
            </div>
          );
        },
        img({ src, alt }) {
          if (!src || typeof src !== "string") return null;
          const current = imgIndex++;
          const isFirst = current === 0;
          return (
            <span className="article-img-wrapper">
              <Image
                src={src}
                alt={alt ?? ""}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 768px"
                priority={isFirst}
                loading={isFirst ? "eager" : "lazy"}
                className="article-img"
              />
            </span>
          );
        },
      }}
    >
      {markdown}
    </Markdown>
  );
}
