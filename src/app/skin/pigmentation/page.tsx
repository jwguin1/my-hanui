import ClinicPatientQuestions from "@/components/ClinicPatientQuestions";
import { clinicFaqItems } from "@/lib/clinic-patient-questions";
import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SkinTreatmentLayout, { SkinSection, SkinFaq } from "@/components/SkinTreatmentLayout";
import { PigmentationAreaPrices } from "@/components/SkinAreaPrices";
import { pageMetadata } from "@/lib/page-metadata";
import { buildGraph, faqEntities } from "@/lib/schema";
import { LASER_TARGETS, PIGMENTATION_FAQS } from "@/lib/skin-laser-care";
import { PIGMENTATION_PRICES } from "@/lib/pricing";
import { PIGMENTATION_GROUPS } from "@/lib/skin-guides";
import { getAllPosts } from "@/lib/blog-local";
import { postPath } from "@/lib/slug";

const description = "일산한의원 색소·홍조·재생치료. 피코하이와 엘리멘트 TL로 피부 상태에 맞는 755·1064·532nm 레이저를 선택합니다. 얼굴 전체 1회 88,000원, 얼굴＋목 110,000원. 흑자 1개는 1cm 이하 22,000원, 1cm 초과 33,000원. 몸 부위별 치료 범위는 그림으로 안내합니다.";
export const metadata = pageMetadata({ path: "/skin/pigmentation", title: "일산 색소·홍조·재생치료 | 내 피부에 맞춘 레이저·가격", description, routeOgImage: true });

export default function PigmentationPage() {
  const posts = getAllPosts("skin");
  return <><JsonLd graph={buildGraph({ path: "/skin/pigmentation", name: "색소·홍조·재생치료 – 일산한의원", description, faq: faqEntities([...PIGMENTATION_FAQS, ...clinicFaqItems("/skin/pigmentation")]) })} />
    <SkinTreatmentLayout kind="pigmentation" title={<>색소·홍조·재생치료<br /><span className="text-primary">내 피부에 필요한 레이저로.</span></>} description="갈색 잡티, 붉은 볼, 거친 피부결. 원장이 피부 상태를 진단하고 필요한 장비와 파장을 골라 치료합니다.">
      <SkinSection id="treatments" title="고민이 다른 만큼, 치료도 다르게">
        <p>얼굴뿐 아니라 겨드랑이·팔·사타구니·다리의 색소와 착색도 진찰합니다. 필요한 부위를 선택하고, 피부 상태에 맞춰 시술 범위와 계획을 정합니다.</p>
        <p>같은 잡티처럼 보여도 색소의 종류와 깊이가 다릅니다. 피부색, 붉은기, 드러난 혈관과 피부결을 함께 살펴 <strong className="text-ink">치료할 부위·파장·강도</strong>를 정합니다.</p>
        <div className="grid gap-4 sm:grid-cols-2">{LASER_TARGETS.map(item => <article key={item.title} className="rounded-2xl border border-line bg-white p-6"><h3 className="text-xl font-bold text-ink">{item.title}</h3><p className="mt-3 font-semibold text-primary">{item.wavelengths}</p><p className="mt-3">{item.body}</p></article>)}</div>
        <p>피코하이는 1064·532nm 피코 레이저, 엘리멘트 TL은 755·1064·532nm 롱펄스 레이저입니다. 한 가지 고민에 집중하거나 여러 고민을 함께 치료하며, 매회 피부 반응에 맞춰 조절합니다.</p>
      </SkinSection>
      <SkinSection id="prices" title="색소·착색 제거 치료 비용">
        <PigmentationAreaPrices />
        <Link href="/skin/spot#prices" className="inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">점·편평사마귀·검버섯 기본 가격과 돌출 병변 추가 비용 보기 →</Link>
        <p>{PIGMENTATION_PRICES.selection}</p>
        <Link href="/skin/toning" className="block rounded-xl border border-line bg-white p-5 font-semibold text-primary">얼굴 전반의 피부결·피부톤 관리가 필요하다면?<br />제네시스·피코토닝 각 1회 33,000원 →</Link>
      </SkinSection>
      <SkinSection id="process" title="상담한 원장이 시술까지 진행합니다">
        <figure className="mx-auto max-w-2xl">
          <Image src="/images/skin/consultation.webp" width={1200} height={800} sizes="(max-width: 720px) 90vw, 672px" alt="피부 분석 화면에서 볼의 색소와 붉은 부위를 살펴보는 상담 장면" className="h-auto w-full rounded-2xl" />
          <figcaption className="mt-3 text-base text-muted">갈색 자국과 붉은 실핏줄은 치료에 쓰는 파장이 다릅니다. 진찰할 때 가장 신경 쓰이는 부위부터 짚어 주세요.</figcaption>
        </figure>
        <ol className="space-y-5">{[["01 · 진찰과 설명","가장 신경 쓰이는 부위와 이전 치료 경험을 듣고 색소·혈관·피부결을 살핍니다."],["02 · 맞춤 시술","부위별로 필요한 레이저를 선택하고, 피부 반응을 보며 조사합니다."],["03 · 회복과 다음 치료","시술 부위에 맞는 세안·보습·자외선 관리와 다음 방문 일정을 안내합니다."]].map(([title,body])=><li key={title} className="border-l-2 border-brush pl-5"><h3 className="font-bold text-ink">{title}</h3><p className="mt-2">{body}</p></li>)}</ol>
        <Link href={postPath("skin","피부레이저-담당-의료진")} className="inline-block font-semibold text-primary underline underline-offset-4">피부레이저 담당 의료진과 상담 방식 →</Link>
      </SkinSection>
      <SkinSection id="questions" title="치료 전에 많이 묻는 질문"><SkinFaq items={PIGMENTATION_FAQS} /></SkinSection>
      <ClinicPatientQuestions path="/skin/pigmentation" />
      <SkinSection id="guides" title="피부 고민별로 더 읽어보세요">
        {PIGMENTATION_GROUPS.map(group=><div id={group.id} key={group.id} className="scroll-mt-28"><h3 className="mb-3 text-lg font-bold text-ink">{group.name}</h3><div className="grid gap-3 sm:grid-cols-2">{group.slugs.flatMap(slug=>{const post=posts.find(p=>p.slug===slug);return post?[<Link key={slug} href={postPath("skin",slug)} className="rounded-xl border border-line bg-white p-4 font-medium text-primary">{post.title} →</Link>]:[];})}</div></div>)}
      </SkinSection>
      <p className="py-5 text-sm text-muted">장비 안내: <a href="https://kr.hironic.com/p/picohi" className="underline">하이로닉 피코하이</a> · <a href="https://elemenic.com/element-tl/" className="underline">엘레메닉 엘리멘트 TL</a></p>
    </SkinTreatmentLayout></>;
}
