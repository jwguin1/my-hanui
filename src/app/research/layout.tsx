import './research.css';
import {RESEARCH_ORIGIN,RESEARCH_CATEGORIES,CLINIC_ORIGIN} from '@/lib/research';
export default function ResearchLayout({children}:{children:React.ReactNode}){return <div className="research-site">
  <div className="research-masthead"><a className="research-brand" href={RESEARCH_ORIGIN}>일산한의원 <strong>연구노트</strong></a><a href={CLINIC_ORIGIN}>진료 홈페이지 ↗</a></div>
  <nav className="research-nav" aria-label="연구 분야"><a href={RESEARCH_ORIGIN}>전체 연구</a>{Object.entries(RESEARCH_CATEGORIES).map(([key,c])=><a key={key} href={`${RESEARCH_ORIGIN}/category/${key}`}>{c.label}</a>)}<a href={`${RESEARCH_ORIGIN}/editorial`}>논문 선정 기준</a></nav>
  {children}
  <div className="research-bottom"><p>일산한의원 연구노트 · 환자의 질문에서 시작하는 논문 해설</p><a href={`${RESEARCH_ORIGIN}/editorial`}>작성·검증 기준</a><a href={`${RESEARCH_ORIGIN}/feed.xml`}>새 글 RSS</a><a href="https://pf.kakao.com/_eXXun">카카오톡 문의</a></div>
</div>}
