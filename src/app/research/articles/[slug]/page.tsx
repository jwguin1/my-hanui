import ResearchFigureImage from "@/components/ResearchFigureImage";
import {notFound} from 'next/navigation';
import {getResearchArticle,getResearchArticles,RESEARCH_CATEGORIES,RESEARCH_ORIGIN,CLINIC_ORIGIN,researchUrl,reference,displayDate} from '@/lib/research';
import ResearchCards from '@/components/ResearchCards';
import JsonLd from '@/components/JsonLd';
import { patientGuidesForResearch } from '@/lib/skin-research';
import { getAllPosts } from '@/lib/blog-local';
import { postPath } from '@/lib/slug';
export const dynamic='force-dynamic';
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props){const a=getResearchArticle((await params).slug);if(!a)return {title:'연구노트를 찾을 수 없습니다',robots:{index:false,follow:false}};return {title:a.title,description:a.summary,alternates:{canonical:researchUrl(a)},openGraph:{title:a.title,description:a.summary,url:researchUrl(a),type:'article',publishedTime:a.publishedAt,modifiedTime:a.updatedAt,images:['https://www.ilsanhan.com/og-image.jpg']}};}
function Paragraphs({text,figure=false}:{text:string;figure?:boolean}){
  const paragraphs=text.split(/\n\s*\n/).filter(Boolean).flatMap(p=>{
    if(!figure||p.length<240)return [p];
    const sentences=p.split(/(?<=[.!?])\s+/);
    const chunks:string[]=[];let current="";
    for(const sentence of sentences){current+=(current?" ":"")+sentence;if(current.length>=180){chunks.push(current.trim());current="";}}
    if(current.trim())chunks.push(current.trim());return chunks;
  });
  return <>{paragraphs.map((p,i)=><p key={i}>{p}</p>)}</>;
}
export default async function ResearchArticlePage({params}:Props){const a=getResearchArticle((await params).slug);if(!a)notFound();const p=a.paper,c=RESEARCH_CATEGORIES[a.category];const related=getResearchArticles(a.category).filter(x=>x.slug!==a.slug).slice(0,3);const url=researchUrl(a);
const patientGuides=patientGuidesForResearch(a).flatMap(slug=>{const post=getAllPosts("skin").find(p=>p.slug===slug);return post?[post]:[];});
return <div className="research-wrap"><JsonLd graph={[
  {'@type':'BlogPosting','@id':url+'#article',headline:a.title,description:a.summary,url,mainEntityOfPage:url,inLanguage:'ko-KR',datePublished:a.publishedAt,dateModified:a.updatedAt,author:{'@type':'Organization',name:'일산한의원 연구노트',url:`${RESEARCH_ORIGIN}/editorial`},publisher:{'@type':'Organization',name:'일산한의원',url:CLINIC_ORIGIN},citation:{'@type':'ScholarlyArticle',name:p.title,url:`https://doi.org/${p.doi}`,identifier:p.doi,datePublished:p.date,isPartOf:{'@type':'Periodical',name:p.journal},license:p.licenseUrl},...(a.humanReview?{reviewedBy:{'@type':'Person',name:a.humanReview.name},lastReviewed:a.humanReview.date}:{}),image:a.figures.flatMap(f=>f.images.map(i=>RESEARCH_ORIGIN+i.src))},
  {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'연구노트',item:RESEARCH_ORIGIN},{'@type':'ListItem',position:2,name:c.label,item:`${RESEARCH_ORIGIN}/category/${a.category}`},{'@type':'ListItem',position:3,name:a.title,item:url}]},
  {'@type':'FAQPage',mainEntity:a.faq.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}
]} />
<nav className="research-breadcrumb" aria-label="현재 위치"><a href={RESEARCH_ORIGIN}>연구노트</a><span> / </span><a href={`${RESEARCH_ORIGIN}/category/${a.category}`}>{c.label}</a></nav>
<header className="research-article-header"><span className="research-eyebrow">{c.label} · 논문 해설</span><h1>{a.title}</h1><p className="research-deck">{a.summary}</p><div className="research-article-meta"><span>일산한의원 연구노트</span><time dateTime={a.publishedAt}>{displayDate(a.publishedAt)} 발행</time>{a.humanReview&&<span>{a.humanReview.name} 검토 · {displayDate(a.humanReview.date)}</span>}</div><div className="research-tags">{a.tags.map(t=><a href={`${RESEARCH_ORIGIN}/?q=${encodeURIComponent(t)}`} key={t}>{t}</a>)}</div></header>
<div className="research-reading-layout"><aside className="research-toc"><strong>이 글에서 살펴볼 내용</strong><a href="#answer">핵심 답변</a><a href="#study">연구 대상과 방법</a><a href="#results">주요 결과</a><a href="#figures">그림으로 읽는 연구</a><a href="#meaning">진료에서의 의미</a><a href="#questions">궁금한 질문</a><a href="#reference">원문과 출처</a><a href="#consultation">진료·상담 안내</a></aside>
<article className="research-prose">
<section id="answer" className="research-answer"><span>먼저 읽는 답변</span><h2>{a.question}</h2><Paragraphs text={a.answer}/></section>
<section className="research-paper-card"><span>이 글에서 읽은 논문</span><h2 lang="en">{p.title}</h2><p>{p.journal} · {p.date.slice(0,4)}년</p><p>{p.types.join(' · ')}</p><a href={`https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`} target="_blank" rel="noopener noreferrer">PubMed 원문 정보 ↗</a><small>{p.citationSource} 인용 {p.citations}회 · {displayDate(p.checkedAt)} 확인</small></section>
<section id="study"><h2>누구에게, 어떻게 연구했나요?</h2><h3>연구 대상</h3><Paragraphs text={a.population}/><h3>연구 방법</h3><Paragraphs text={a.methods}/></section>
<section id="results"><h2>주요 결과는 무엇인가요?</h2><Paragraphs text={a.results}/></section>
<section id="figures"><h2>그림으로 읽는 연구</h2>{a.figures.length>0&&<p className="research-note">원 논문의 그림 {p.figureCount}개를 함께 읽습니다. 그림을 눌러 확대하고, 닫으면 읽던 자리로 돌아옵니다.</p>}{a.figures.length?a.figures.map(f=><figure className="research-figure" key={f.id}><h3>{f.label}</h3>{f.images.map((i,n)=><ResearchFigureImage key={i.src} {...i} label={`${f.label}${f.images.length>1?` · ${n+1}`:''}`} alt={f.alt+(f.images.length>1?` (${n+1})`:'')}/>)}<figcaption><Paragraphs text={f.explanation} figure/><details><summary>원문 그림 설명·출처</summary><p lang="en">{f.caption}</p><p>{p.authors.slice(0,3).join(', ')}{p.authors.length>3?' 외':''} · {p.journal} ({p.date.slice(0,4)}). <a href={`https://doi.org/${p.doi}`}>원문</a> · <a href={p.licenseUrl}>이용 허락</a>. 웹 열람을 위해 크기·파일 형식 변경. 한국어 설명 추가.</p></details></figcaption></figure>):<p>이 논문에는 별도의 Figure가 없습니다.</p>}</section>
<section id="meaning"><h2>진료에서는 어떻게 이해하면 좋을까요?</h2><Paragraphs text={a.meaning}/></section>
<section className="research-limits"><h2>함께 알아두면 좋은 점</h2><Paragraphs text={a.limitations}/></section>
<section id="questions"><h2>환자분들이 궁금해할 질문</h2>{a.faq.map((f,i)=><details className="research-faq" key={f.question} open={i===0}><summary>{f.question}</summary><Paragraphs text={f.answer}/></details>)}</section>
<section id="reference"><h2>논문 원문과 출처</h2><p className="research-reference" lang="en">{reference(a)}</p><div className="research-source-links"><a href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">논문 원문 ↗</a><a href={`https://pmc.ncbi.nlm.nih.gov/articles/${p.pmcid}/`} target="_blank" rel="noopener noreferrer">PMC 전문·보충자료 ↗</a></div><details className="research-original"><summary>Abstract · 초록 원문</summary><p lang="en">{p.abstract}</p></details>{p.conclusion&&<details className="research-original"><summary>Conclusion · 결론 원문</summary><p lang="en">{p.conclusion}</p></details>}<p className="research-note">초록·결론·그림 출처: 위 논문 저자 및 학술지. <a href={p.licenseUrl}>원문 이용 허락</a>에 따라 게재했습니다. 한국어 해설은 원문의 번역·해석이며 저자의 원문과 구분됩니다.</p><p className="research-note">AI를 활용해 작성하고 원문 대조를 거친 연구 해설입니다. <a href={`${RESEARCH_ORIGIN}/editorial`}>작성·검증 과정 보기 →</a></p></section>
<section id="consultation" className="research-consult"><span>논문에서 내 진료로</span><h2>내 증상에는 어떻게 적용할 수 있을까요?</h2><Paragraphs text={a.consultation}/><div className="research-treatment-links">{c.links.map(([label,href])=><a href={CLINIC_ORIGIN+href} key={href}>{label} →</a>)}</div><a className="research-kakao" href="https://pf.kakao.com/_eXXun" target="_blank" rel="noopener noreferrer">카카오톡으로 내 증상 상담하기</a><a className="research-directions" href={`${CLINIC_ORIGIN}/contact`}>오시는 길·진료시간 →</a><p className="research-note">이마트 풍산점 3층 · 풍산역 2번 출구 도보 1분</p></section>
{patientGuides.length>0&&<section><h2>진료 전에 많이 궁금한 질문</h2><p>논문에서 살펴본 원리를 바탕으로, 실제 상담에서 확인할 내용을 읽어보세요.</p><div className="research-treatment-links">{patientGuides.map(post=><a key={post.slug} href={CLINIC_ORIGIN+postPath("skin",post.slug)}>{post.title} →</a>)}</div></section>}
</article></div>{related.length>0&&<section className="research-related"><h2>함께 읽으면 좋은 연구</h2><ResearchCards articles={related}/></section>}</div>}
