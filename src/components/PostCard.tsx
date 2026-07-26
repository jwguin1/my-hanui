import Link from "next/link";
import { OG_HEIGHT, OG_WIDTH } from "@/lib/og-image";
import type { LatestPostCard } from "@/lib/latest-posts";

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  } catch {
    return "";
  }
}

/**
 * 자사 상세글 카드 (제목 + 요약 + 날짜 + 태그 + 썸네일).
 *
 * 이미지 영역 비율을 파생 OG(1200x630) 와 동일하게 잡아 잘림 없이 그대로 노출한다 —
 * 화면에 보이는 카드 이미지와 ItemList JSON-LD 의 image 가 같은 파일이 된다.
 */
export default function PostCard({ post }: { post: LatestPostCard }) {
  return (
    <Link
      href={post.href}
      className="card group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
    >
      <div
        className="relative overflow-hidden bg-white"
        style={{ aspectRatio: `${OG_WIDTH} / ${OG_HEIGHT}` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.imagePath}
          alt={post.title}
          width={OG_WIDTH}
          height={OG_HEIGHT}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[0.72rem] text-accent">{post.categoryLabel}</p>
        <h3 className="font-serif mt-2 text-[1rem] font-semibold leading-snug text-text line-clamp-2 group-hover:text-accent transition-colors duration-200">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-[0.82rem] leading-relaxed text-text-muted line-clamp-3">
          {post.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[0.72rem] text-text-muted">
            {formatDate(post.date)}
          </p>
          {post.tags.length > 0 && (
            <div className="flex gap-1.5">
              {post.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[0.7rem] text-accent">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
