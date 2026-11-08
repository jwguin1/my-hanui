import { getAllPosts, type LocalBlogPost } from "@/lib/blog-local";
import { getResearchArticles, type ResearchArticle } from "@/lib/research";
import { cache } from "react";

const publishedPosts = cache((focus: Focus) => getAllPosts(focus === "digestive" ? undefined : focus));

export const FOCUS_GUIDES = {
  pain: { label: "통증", description: "아픈 부위부터 검사·치료 순서까지", href: "/pain", treatment: "/pain/chronic", slugs: ["허리디스크-수술안하고", "다리만-저릴때-허리디스크", "허리디스크-침치료-원리"] },
  diet: { label: "다이어트", description: "복용 전 확인할 것과 감량 후 관리", href: "/diet", treatment: "/diet/program", slugs: ["다이어트한약-복용전-확인", "다이어트한약-기간과-비용", "다이어트한약-요요"] },
  skin: { label: "미용", description: "잡티·리프팅·제모, 내 고민에 맞게", href: "/skin", treatment: "/skin/questions", slugs: ["편평사마귀-여드름-차이", "볼뉴머-효과-슈링크-차이", "수염제모-횟수-간격-1년권"] },
  digestive: { label: "기능성 소화불량", description: "검사는 정상인데 식사가 불편할 때", href: "/internal/dyspepsia", treatment: "/internal/dyspepsia#herbal-prices", slugs: ["내시경-정상-기능성소화불량", "조금만-먹어도-배부름", "기능성소화불량-식사-커피"] },
} as const;
export type Focus = keyof typeof FOCUS_GUIDES;
export const FOCUS_ORDER: Focus[] = ["pain", "diet", "skin", "digestive"];
export function focusPosts(focus: Focus) {
  const posts = publishedPosts(focus);
  return FOCUS_GUIDES[focus].slugs.flatMap(slug => {
    const post = posts.find(p => p.slug === slug);
    return post ? [post] : [];
  });
}
export function postFocus(post: LocalBlogPost): Focus | undefined {
  if (post.category === "pain" || post.category === "diet" || post.category === "skin") return post.category;
  if (FOCUS_GUIDES.digestive.slugs.some(s => s === post.slug) || post.slug === "체했을때-한의원-내과") return "digestive";
}
export function articleFocus(article: ResearchArticle): Focus | undefined {
  if (article.category === "korean") return /functional dyspepsia/i.test(article.paper.title) ? "digestive" : undefined;
  return article.category;
}
export function focusResearch(focus: Focus) {
  return getResearchArticles().filter(a => articleFocus(a) === focus).slice(0, 2);
}
