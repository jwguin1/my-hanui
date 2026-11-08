import raw from '@/data/research-articles.json';
export const RESEARCH_ORIGIN='https://research.ilsanhan.com';
export const CLINIC_ORIGIN='https://www.ilsanhan.com';
export const RESEARCH_CATEGORIES={
  diet:{label:'다이어트',day:'순환 발행',description:'체중 감량과 유지, 한약·침·생활 관리 연구를 읽습니다.',links:[['일산감비환 진료·비용','/diet/program'],['다이어트 환자 질문','/diet']]},
  digestive:{label:'기능성 소화불량',day:'순환 발행',description:'조기포만감·식후 더부룩함과 침·한약·식사 관리 연구를 살펴봅니다.',links:[['소화불량 진료·보험한약','/internal/dyspepsia'],['내시경이 정상인데 소화가 안 될 때','/blog/내시경-정상-기능성소화불량']]},
  pain:{label:'통증·근골격',day:'순환 발행',description:'허리·목·관절 통증과 침·추나·초음파 치료를 연구로 살펴봅니다.',links:[['급성 통증 진료','/pain/acute'],['만성 통증 진료','/pain/chronic'],['치료 비용·시간','/pricing']]},
  skin:{label:'피부·미용',day:'순환 발행',description:'색소·피부결·탄력, 레이저와 미용 치료의 근거를 읽습니다.',links:[['피코·제네시스 색소치료','/skin/pigmentation'],['슈링크·볼뉴머 리프팅','/skin/lifting'],['엘리멘트 TL 얼굴 제모','/skin/hair-removal'],['CO₂ 잡티제거','/skin/spot']]},
  korean:{label:'한의학·한약',day:'기존 연구',description:'소화·수면·여성 건강과 한약·침 연구를 쉽게 풀어봅니다.',links:[['보험한약 진료','/herbal/insurance'],['체질맞춤 한약','/herbal/tonic'],['소화불량 진료','/internal/dyspepsia']]},
} as const;
export type ResearchCategory=keyof typeof RESEARCH_CATEGORIES;
export const RESEARCH_FOCUS = ['pain','diet','skin','digestive'] as const;
export interface ResearchArticle {
  slug:string;category:ResearchCategory;status:'published'|'withdrawn'|'draft';publishedAt:string;updatedAt:string;
  title:string;summary:string;question:string;answer:string;population:string;methods:string;results:string;meaning:string;limitations:string;consultation:string;tags:string[];
  faq:{question:string;answer:string}[];evidence:{claim:string;quote:string}[];
  figures:{id:string;label:string;caption:string;explanation:string;alt:string;images:{src:string;preview:string;width:number;height:number;originalHash:string}[]}[];
  paper:{title:string;pmid:string;pmcid:string;doi:string;date:string;types:string[];authors:string[];journal:string;volume:string;issue:string;pages:string;citations:number;citationSource:string;checkedAt:string;abstract:string;conclusion:string;licenseUrl:string;licenseText:string;sourceHash:string;figureCount:number;sourceUrl:string};
  verification:{type:'automated';model:string;checkedAt:string;checks:Record<string,boolean>};
  humanReview?:{name:string;date:string};withdrawalReason?:string;
}
export function getResearchArticles(category?:ResearchCategory){return (raw as ResearchArticle[]).filter(a=>a.status==='published'&&Date.parse(a.publishedAt)<=Date.now()&&(!category||a.category===category||(category==='digestive'&&a.category==='korean'&&/functional dyspepsia/i.test(a.paper.title)))).sort((a,b)=>Date.parse(b.publishedAt)-Date.parse(a.publishedAt));}
export function getResearchArticle(slug:string){return getResearchArticles().find(a=>a.slug===slug);}
export function researchUrl(a:ResearchArticle){return `${RESEARCH_ORIGIN}/articles/${a.slug}`;}
export function displayDate(date:string){return new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'long',day:'numeric',timeZone:'Asia/Seoul'}).format(new Date(date));}
export function reference(a:ResearchArticle){const p=a.paper;return `${p.authors.slice(0,6).map(n=>n.replace(/[.]+$/,'')).join(', ')}${p.authors.length>6?', et al.':''}. ${p.title.replace(/[.]+$/,'')}. ${p.journal}. ${p.date.slice(0,4)};${p.volume}${p.issue?`(${p.issue})`:''}${p.pages?`:${p.pages}`:''}. doi:${p.doi}.`;}
