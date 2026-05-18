import Image from "next/image";
import Markdown from "react-markdown";

export default function PostContent({ markdown }: { markdown: string }) {
  let imgIndex = 0;

  return (
    <Markdown
      components={{
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
