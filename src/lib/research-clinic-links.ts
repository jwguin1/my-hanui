import type { ResearchArticle } from "./research";

type ClinicLink = readonly [label: string, path: string];

// Match the paper itself; incidental treatment mentions in the commentary are not a referral topic.
export function researchClinicLinks(article: ResearchArticle): readonly ClinicLink[] {
  const title = article.paper.title;
  if (article.category === "diet") return [["체중 관리 진료·비용", "/diet/program"], ["다이어트 환자 질문", "/diet"]];
  if (article.category === "digestive" || /functional dyspepsia/i.test(title)) return [["기능성 소화불량 진료", "/internal/dyspepsia"], ["보험한약 진료", "/herbal/insurance"]];
  if (article.category === "pain") return [["급성 통증 진료", "/pain/acute"], ["만성 통증 진료", "/pain/chronic"]];
  if (article.category === "skin") {
    if (/hair removal|epilation|hirsutism|pseudofolliculitis/i.test(title)) return [["얼굴 제모 진료·비용", "/skin/hair-removal"]];
    if (/microfocused ultrasound|high.intensity focused ultrasound|HIFU|monopolar radiofrequency|volnewmer|bipolar radiofrequency/i.test(title)) return [["슈링크·볼뉴머 리프팅 안내", "/skin/lifting"], ["피부·레이저 진료 안내", "/skin"]];
    if (/melasma|lentigines|pigment/i.test(title)) return [["색소·홍조·재생치료", "/skin/pigmentation"], ["제네시스·피코토닝 관리", "/skin/toning"]];
    // A general skin consultation does not imply the clinic offers the paper's experimental treatment.
    return [["피부 상태에 맞는 진료 안내", "/skin"]];
  }
  if (/rhinitis|dysmenorrhea/i.test(title)) return [["보험한약 진료 안내", "/herbal/insurance"], ["한의원 진료 안내", "/treatment"]];
  return [["한의원 진료 안내", "/treatment"]];
}
