import {getResearchArticles,RESEARCH_ORIGIN,researchUrl} from '@/lib/research';
export const dynamic='force-dynamic';
export function GET(){
  const articles=getResearchArticles();
  const body=`# 일산한의원 연구노트

> 환자의 질문에서 시작하는 통증·피부·한의학 논문 해설입니다. 최근 10년의 PubMed 논문을 대상으로 연구 대상·방법·결과, 원문 그림, 적용 범위를 설명합니다.

- [작성·검증 기준](${RESEARCH_ORIGIN}/editorial)
- [사이트맵](${RESEARCH_ORIGIN}/sitemap.xml)
- [RSS](${RESEARCH_ORIGIN}/feed.xml)
- [일산한의원 진료 안내](https://www.ilsanhan.com/treatment)

## 공개된 연구 해설

${articles.map(a=>`- [${a.title}](${researchUrl(a)}): ${a.summary.replace(/\s+/g,' ')}`).join('\n')}

원 논문과 한국어 해설은 구분되어 있습니다. 연구된 치료·장비·환자군을 다른 진료에 그대로 일반화하지 않습니다. AI 작성·원문 대조는 의료진의 직접 검토를 뜻하지 않습니다.
`;
  return new Response(body,{headers:{'Content-Type':'text/plain; charset=utf-8'}});
}
