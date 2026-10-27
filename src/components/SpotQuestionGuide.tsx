import Link from "next/link";
import { getAllPosts } from "@/lib/blog-local";
import { postPath } from "@/lib/slug";

const GROUPS = [
  { name: "점제거·점빼기", slugs: ["일산-점제거-점빼기-수술", "잡티제거-개수와-비용", "일산-점빼기-성지-피부과-병원", "일산-점제거-내돈내산"] },
  { name: "편평사마귀", slugs: ["일산-편평사마귀-제거", "일산-편평사마귀-가격", "일산-편평사마귀-성지-가격비교", "편평사마귀-여드름-차이"] },
  { name: "쥐젖·비립종", slugs: ["일산-쥐젖-제거-무제한", "일산-비립종-제거-압출"] },
  { name: "구분과 회복 관리", slugs: ["쥐젖-사마귀-검버섯-구분", "점뺀후-딱지없음-재생테이프", "점뺀후-딱지-선크림"] },
] as const;

export default function SpotQuestionGuide() {
  const bySlug = new Map(getAllPosts("skin").map(post => [post.slug, post]));
  return <section className="section-padding" aria-labelledby="spot-questions-title">
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-medium text-primary">잡티 제거 · 질문별 안내</p>
      <h2 id="spot-questions-title" className="mt-3 font-serif text-2xl font-semibold text-ink">가격부터 회복까지, 궁금한 내용을 골라보세요</h2>
      {GROUPS.map(group => <div key={group.name} className="mt-8">
        <h3 className="text-lg font-semibold text-ink">{group.name}</h3>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {group.slugs.map(slug => {
            const post = bySlug.get(slug);
            if (!post) throw new Error(`Missing spot guide: ${slug}`);
            return <li key={slug}><Link href={postPath("skin", slug)} className="group block rounded-lg px-2 py-4 hover:bg-surface focus-visible:outline-2 focus-visible:outline-primary">
              <p className="font-semibold leading-7 text-ink group-hover:text-primary">{post.title} <span aria-hidden="true">→</span></p>
              <p className="mt-1 text-sm leading-6 text-muted">{post.description}</p>
            </Link></li>;
          })}
        </ul>
      </div>)}
    </div>
  </section>;
}
