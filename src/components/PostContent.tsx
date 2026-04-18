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
            <span className="relative my-6 block w-full overflow-hidden rounded-lg">
              <Image
                src={src}
                alt={alt ?? ""}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 768px"
                priority={isFirst}
                loading={isFirst ? "eager" : "lazy"}
                className="h-auto w-full"
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
