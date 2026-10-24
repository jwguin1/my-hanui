import { getResearchArticles, type ResearchArticle } from "@/lib/research";
import { HAIR_REMOVAL_SLUGS, VOLNEWMER_SLUGS } from "@/lib/skin-guides";

// Use the paper's topic, not incidental mentions in the clinic consultation text.
export function skinResearchTopic(article: ResearchArticle) {
  const title = article.paper.title;
  if (/hair removal|epilation|photoepilation|hirsutism|pseudofolliculitis/i.test(title)) return "hair";
  if (/volnewmer|vol.new.mer|monopolar radiofrequency|monopolar RF/i.test(title)) return "rf";
  if (/microfocused ultrasound|high.intensity focused ultrasound|HIFU/i.test(title)) return "ultrasound";
  return undefined;
}

export function researchForSkinGuide(slug: string) {
  const hair = HAIR_REMOVAL_SLUGS.includes(slug);
  const volnewmer = VOLNEWMER_SLUGS.includes(slug);
  if (!hair && !volnewmer) return null;
  const articles = getResearchArticles("skin").filter(a => {
    const topic = skinResearchTopic(a);
    return hair ? topic === "hair" : topic === "rf";
  }).slice(0, 2);
  return { articles, hair };
}

export function patientGuidesForResearch(article: ResearchArticle) {
  if (article.category !== "skin") return [];
  const topic = skinResearchTopic(article);
  if (topic === "hair") return [...HAIR_REMOVAL_SLUGS];
  if (topic === "rf") return [...VOLNEWMER_SLUGS];
  if (topic === "ultrasound") return ["슈링크-효과-볼살-턱선", "볼뉴머-효과-슈링크-차이"];
  return [];
}
