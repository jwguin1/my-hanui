import JsonLd from "@/components/JsonLd";
import SkinTreatmentLayout, { SkinSection, SkinFaq } from "@/components/SkinTreatmentLayout";
import { HairRemovalPrices } from "@/components/SkinPrices";
import { pageMetadata } from "@/lib/page-metadata";
import { buildGraph, faqEntities } from "@/lib/schema";
import { HAIR_REMOVAL_FAQS } from "@/lib/skin-treatment";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog-local";
import { HAIR_REMOVAL_SLUGS } from "@/lib/skin-guides";
import { postPath } from "@/lib/slug";
const description = "일산한의원 엘리멘트 TL 남녀 공통 얼굴 레이저 제모. 인중＋앞턱·얼굴전체, 기본·케어 포함 가격과 1회·5회·1년 무제한 구성, 면도·간격·시술 후 관리 질문을 안내합니다.";
export const metadata = pageMetadata({path:"/skin/hair-removal",title:"일산 얼굴·수염 제모 | 엘리멘트 TL 가격·횟수·관리",description,routeOgImage:true});
export default function HairRemovalPage(){return <><JsonLd graph={buildGraph({path:"/skin/hair-removal",name:"얼굴·수염 레이저 제모 – 일산한의원",description,faq:faqEntities([...HAIR_REMOVAL_FAQS])})}/><SkinTreatmentLayout kind="hair-removal" title={<>어려 보이는 인상,<br/><span className="text-[#792d44]">깔끔함부터</span> 시작하세요.</>} description="남녀 공통 레이저 제모 · 엘리멘트 TL. 매일 신경 쓰이는 수염과 얼굴 잔털, 부위와 관리 계획에 맞춰 시작하세요.">
  <SkinSection id="overview" title="면도와 잔털 관리, 조금 더 편안하게">
    <p className="text-xl font-bold text-ink">얼굴전체 1회 <strong className="text-3xl">4.4만원</strong></p><p>케어 포함 구성 · 마취·비타민 쿨링팩·LED 포함</p>
    <p>레이저 제모는 털의 멜라닌에 흡수된 빛을 열로 바꾸어 모낭에 작용하는 시술입니다. 일산한의원에서는 엘리멘트 TL을 사용하고, 털의 굵기와 밀도·피부색을 확인해 시술 설정을 정합니다.</p>
    <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-line bg-white p-6"><h3 className="text-xl font-bold text-ink">인중＋앞턱</h3><p className="mt-3">입 주변과 턱 앞쪽처럼 눈에 잘 띄는 털을 집중해서 관리하고 싶을 때 선택합니다.</p></div><div className="rounded-2xl border border-line bg-white p-6"><h3 className="text-xl font-bold text-ink">얼굴전체</h3><p className="mt-3">여러 부위에 걸쳐 수염이나 잔털이 신경 쓰일 때 선택합니다. 이마를 제외한 얼굴 범위를 상담에서 확인합니다.</p></div></div>
  </SkinSection>
  <SkinSection id="prices" title="부위와 케어를 선택하세요"><HairRemovalPrices/></SkinSection>
  <SkinSection id="visit" title="예약 전, 이 세 가지만 준비하세요">
    <ol className="space-y-5">{[["01 · 면도로 정리하기","보통 전날 부드럽게 면도하고 방문합니다. 시술 전 4주 동안 털을 뽑는 왁싱·족집게 대신 면도를 이용해 주세요."],["02 · 피부 상태 알려주기","최근 태닝·피부 트러블·복용약·이전 레이저 시술을 알려주세요. 피부색과 털의 상태를 함께 보고 시술 범위를 정합니다."],["03 · 다음 일정 계획하기","최소 4주 간격으로 방문합니다. 시술 후에는 보습·자외선 차단을 챙기고 피부가 진정되는 동안 강한 마찰을 줄여주세요."]].map(([t,d])=><li key={t} className="border-l-2 border-[#ddc5cd] pl-5"><h3 className="font-bold text-ink">{t}</h3><p className="mt-2">{d}</p></li>)}</ol>
  </SkinSection>
  <SkinSection id="questions" title="얼굴 제모 전에 궁금한 질문"><SkinFaq items={HAIR_REMOVAL_FAQS}/></SkinSection>
  <SkinSection id="guides" title="제모를 처음 알아보신다면, 이 세 편부터">
    <div className="grid gap-3">{HAIR_REMOVAL_SLUGS.flatMap(slug => { const p = getAllPosts("skin").find(p => p.slug === slug); return p ? [<Link key={p.slug} href={postPath("skin", p.slug)} className="rounded-xl border border-line bg-white p-5"><h3 className="font-bold text-primary">{p.title} →</h3><p className="mt-2 text-base text-muted">{p.description}</p></Link>] : []; })}</div>
    <a href="https://research.ilsanhan.com/category/skin" className="inline-block py-3 font-semibold text-primary underline underline-offset-4">피부·미용 연구노트도 살펴보기 →</a>
  </SkinSection>
</SkinTreatmentLayout></>}
