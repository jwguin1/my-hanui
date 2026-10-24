import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SkinTreatmentLayout, { SkinSection, SkinFaq } from "@/components/SkinTreatmentLayout";
import { LiftingPrices } from "@/components/SkinPrices";
import { pageMetadata } from "@/lib/page-metadata";
import { buildGraph, faqEntities } from "@/lib/schema";
import { LIFTING_FAQS } from "@/lib/skin-treatment";
import { LIFTING_SLUGS, VOLNEWMER_SLUGS } from "@/lib/skin-guides";
import { getAllPosts } from "@/lib/blog-local";
import { postPath } from "@/lib/slug";

const description = "일산한의원 슈링크 유니버스·볼뉴머 리프팅. 슈링크 600샷 17.6만원, 볼뉴머 600샷 54.9만원. 슈링크 3회＋볼뉴머 1회 패키지와 300·600샷 선택, 시술 간격을 확인하세요.";
export const metadata = pageMetadata({ path: "/skin/lifting", title: "일산 리프팅 | 슈링크·볼뉴머 가격·패키지·시술 간격", description, routeOgImage: true });
export default function LiftingPage() {
  const posts = getAllPosts("skin").filter(p => LIFTING_SLUGS.includes(p.slug));
  return <><JsonLd graph={buildGraph({path:"/skin/lifting",name:"슈링크·볼뉴머 리프팅 – 일산한의원",description,faq:faqEntities([...LIFTING_FAQS])})}/>
    <SkinTreatmentLayout kind="lifting" title={<><span className="text-[#792d44]">슈링크</span>로 끌어올리고,<br/><span className="text-[#792d44]">볼뉴머</span>로 탄력을 채우다.</>} description="흐려진 턱선과 느슨해진 피부 탄력. 초음파와 고주파의 서로 다른 원리를 활용해, 가장 신경 쓰이는 부위부터 계획합니다.">
      <SkinSection id="treatments" title="얼굴선과 피부 탄력, 두 가지를 함께 봅니다.">
        <div className="grid gap-5 sm:grid-cols-2"><div className="rounded-2xl border border-line bg-white p-6"><p className="text-sm font-semibold text-[#792d44]">집속 초음파 · HIFU</p><h3 className="mt-2 text-xl font-bold text-ink">슈링크 유니버스</h3><p className="mt-4">목표 깊이에 초음파 에너지를 모아 열 반응을 유도합니다. 입 옆 처짐과 턱선처럼 얼굴의 윤곽이 달라진 부분을 중심으로 치료 부위를 정합니다.</p></div><div className="rounded-2xl border border-line bg-white p-6"><p className="text-sm font-semibold text-[#792d44]">단극성 고주파 · RF</p><h3 className="mt-2 text-xl font-bold text-ink">볼뉴머</h3><p className="mt-4">6.78MHz 고주파 열에너지를 활용해 피부의 탄력과 잔주름을 관리합니다. 피부 두께와 탄력을 살피고, 쿨링 시스템으로 피부 표면을 보호하며 진행합니다.</p></div></div>
        <p>얼굴에서 볼륨을 유지할 곳과 처짐을 관리할 곳을 나누어 살펴봅니다. 이전 리프팅·필러 시술의 날짜와 부위를 알려주시면 치료 계획에 반영합니다.</p>
      </SkinSection>
      <SkinSection id="prices" title="리프팅 가격과 패키지"><LiftingPrices/></SkinSection>
      <SkinSection id="process" title="상담부터 진정 관리까지">
        <ol className="space-y-5">{[["01 · 상담과 디자인","턱선·입 옆 처짐·잔주름 중 고민을 듣고, 피부 두께와 얼굴 볼륨을 확인합니다."],["02 · 마취와 시술","선택한 장비와 샷 수에 맞춰 시술합니다. 시술 중 열감과 피부 반응을 확인하며 에너지를 조절합니다."],["03 · 비타민 쿨링팩·LED","진정 관리로 마무리하고 일상 관리와 다음 시술 일정을 안내합니다."]].map(([t,d])=><li key={t} className="border-l-2 border-[#ddc5cd] pl-5"><h3 className="font-bold text-ink">{t}</h3><p className="mt-2">{d}</p></li>)}</ol>
        <p>슈링크 300샷은 약 30분을 기준으로 안내합니다. 볼뉴머·600샷 구성은 예약할 때 필요한 시간을 안내해드립니다.</p>
      </SkinSection>
      <SkinSection id="questions" title="리프팅 전에 많이 궁금한 질문"><SkinFaq items={LIFTING_FAQS}/></SkinSection>
      <SkinSection id="guides" title="볼뉴머와 슈링크, 궁금한 내용부터 읽어보세요">
        {[{title:"볼뉴머 질문 3가지",slugs:VOLNEWMER_SLUGS},{title:"슈링크 질문 3가지",slugs:LIFTING_SLUGS.filter(s=>!VOLNEWMER_SLUGS.includes(s))}].map(group=><div key={group.title}><h3 className="mb-4 text-xl font-bold text-ink">{group.title}</h3><div className="grid gap-3">{group.slugs.flatMap(slug=>{const p=posts.find(p=>p.slug===slug);return p?[<Link key={p.slug} href={postPath("skin",p.slug)} className="rounded-xl border border-line bg-white p-5"><h4 className="font-bold text-primary">{p.title} →</h4><p className="mt-2 text-base text-muted">{p.description}</p></Link>]:[];})}</div></div>)}
        <a href="https://research.ilsanhan.com/articles/pmid-36674277" className="block rounded-xl border border-line bg-white p-5 font-semibold text-primary">연구노트 · 초음파 리프팅 연구의 결과와 해석 →</a>
      </SkinSection>
    </SkinTreatmentLayout></>;
}
