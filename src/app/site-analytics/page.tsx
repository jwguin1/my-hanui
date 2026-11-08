import AnalyticsPreference from '@/components/AnalyticsPreference';
import JsonLd from '@/components/JsonLd';
import { buildGraph } from '@/lib/schema';
import { pageMetadata } from '@/lib/page-metadata';
const description='일산한의원 홈페이지의 방문 통계 수집 범위와 사용 중지 방법을 안내합니다.';
export const metadata=pageMetadata({path:'/site-analytics',title:'홈페이지 방문 통계 안내',description});
export default function AnalyticsNotice(){return <>
 <JsonLd graph={buildGraph({path:'/site-analytics',name:'홈페이지 방문 통계 안내',description})}/>
 <article className="section-padding prose-custom mx-auto max-w-3xl"><h1>홈페이지 방문 통계 안내</h1>
 <p>일산한의원은 어떤 안내가 도움이 되는지 확인하기 위해 Google Analytics를 사용합니다. 공개 안내 페이지의 조회와 유입 사이트, 카카오톡·전화 버튼 클릭을 집계합니다. 버튼 클릭은 실제 상담이나 예약 완료와 구분해서 봅니다.</p>
 <h2>수집 범위</h2><p>공개 페이지 주소, 접속 시간, 기기·브라우저 정보와 버튼 종류가 통계에 포함됩니다. 방문 구분용 쿠키의 설정 기간은 30일입니다. 통계는 Google에서 처리하며, <a href="https://policies.google.com/privacy">Google 개인정보처리방침</a>에서 처리 내용을 확인할 수 있습니다.</p>
 <p>복약지 환자 링크, 이름·연락처·차트, 입력한 검색어와 상담 내용은 이 통계로 보내지 않습니다. 광고 개인화와 Google 신호 데이터 수집, 자동 양식 추적은 사용하지 않습니다.</p>
 <h2>통계 수집 끄기</h2><p>아래 설정은 현재 브라우저에 적용됩니다. 브라우저의 추적 금지(Do Not Track) 설정도 따릅니다. 통계를 꺼도 홈페이지와 상담 링크를 이용할 수 있습니다.</p>
 <AnalyticsPreference/><p>문의: 일산한의원 031-976-7706 · 시행일 2026년 11월 8일</p>
 </article>
 </>;}
