import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import SkinTreatmentLayout, { SkinSection, SkinFaq } from "@/components/SkinTreatmentLayout";
import { pageMetadata } from "@/lib/page-metadata";
import { buildGraph, faqEntities } from "@/lib/schema";
import { AGNES_FAQS } from "@/lib/agnes";

const description = "일산한의원 아그네스 미세침 고주파 치료. 반복되는 여드름과 피지선 치료의 원리, 압출·토닝과의 차이, 통증·회복·시술 전 준비를 안내합니다.";
export const metadata = pageMetadata({ path: "/skin/agnes", title: "일산 아그네스 | 여드름·피지선 고주파 치료와 자주 묻는 질문", description, routeOgImage: true });

export default function AgnesPage() {
  return <><JsonLd graph={buildGraph({ path: "/skin/agnes", name: "아그네스 RF – 일산한의원", description, image: "/images/devices/agnes.webp", faq: faqEntities([...AGNES_FAQS]) })} />
    <SkinTreatmentLayout kind="agnes" title={<>아그네스 RF<br /><span className="text-primary">반복되는 여드름,<br className="sm:hidden" /> 피지선에 집중합니다.</span></>} description="같은 자리에 자꾸 올라오는 여드름. 염증의 위치와 깊이를 살펴 미세침 고주파로 치료합니다.">
      <SkinSection id="treatment" title="피부 속 목표 부위에 고주파를 전달합니다">
        <p>아그네스는 미세침 끝을 통해 고주파(RF) 에너지를 전달하는 장비입니다. 침의 일부를 절연해 피부 표면의 열 자극을 줄이고, 치료할 깊이에 에너지를 전달하도록 설계되어 있습니다.</p>
        <p>여드름 치료에서는 피지선을 목표로 합니다. 병변마다 깊이와 염증 정도가 달라, 진찰 후 사용할 침과 강도·치료 범위를 정합니다.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl border border-line bg-white p-6"><h3 className="text-xl font-bold text-ink">같은 자리에 반복되는 여드름</h3><p className="mt-3">염증이 반복되는 위치와 기존 치료 반응을 확인하고, 집중해서 치료할 부위를 찾습니다.</p></article>
          <article className="rounded-2xl border border-line bg-white p-6"><h3 className="text-xl font-bold text-ink">눈가의 작은 돌기</h3><p className="mt-3">한관종·비립종 등 병변을 먼저 구분합니다. 진찰 결과에 맞춰 고주파 또는 제거 치료를 안내합니다.</p></article>
        </div>
        <p className="text-sm">장비 원리: <a href="https://lat.agnesmedical.com/how-it-works/" className="underline underline-offset-4">아그네스메디컬 공식 안내</a></p>
      </SkinSection>
      <SkinSection id="process" title="진찰부터 경과 확인까지">
        <ol className="grid gap-4 sm:grid-cols-3">{[
          ["01 · 진찰", "병변과 피부 상태를 확인하고 이전 치료·복용약·최근 시술을 살핍니다."],
          ["02 · 시술", "부위에 맞춰 마취한 뒤 일회용 미세침으로 필요한 부위를 치료합니다."],
          ["03 · 경과 확인", "피부 회복과 염증 변화를 살피고 추가 치료 시점을 정합니다."],
        ].map(([title, text]) => <li key={title} className="rounded-2xl bg-surface p-5"><h3 className="text-lg font-bold text-ink">{title}</h3><p className="mt-3">{text}</p></li>)}</ol>
      </SkinSection>
      <SkinSection id="questions" title="아그네스, 많이 물어보시는 질문"><SkinFaq items={AGNES_FAQS} /></SkinSection>
      <SkinSection id="related" title="여드름과 자국, 고민에 맞춰 살펴보세요">
        <p>갈색 자국과 붉은 부위가 함께 남아 있다면 <Link href="/skin/pigmentation" className="font-semibold text-primary underline underline-offset-4">색소·홍조·재생치료</Link>를, 피부톤과 피부결을 꾸준히 관리하고 싶다면 <Link href="/skin/toning" className="font-semibold text-primary underline underline-offset-4">토닝관리</Link>를 함께 살펴보세요.</p>
      </SkinSection>
      <section className="py-8 text-sm leading-relaxed text-muted"><h2 className="font-semibold text-ink">참고 자료</h2><ul className="mt-3 space-y-3 break-words">
        <li><a href="https://lat.agnesmedical.com/products/agnes/" className="underline underline-offset-4">AGNES Medical. AGNES 장비 안내.</a></li>
        <li><a href="https://lat.agnesmedical.com/faq/" className="underline underline-offset-4">AGNES Medical. 시술 전 확인 사항과 미세침 사용 안내.</a></li>
        <li><a href="https://pubmed.ncbi.nlm.nih.gov/31502662/" className="underline underline-offset-4">Ahn GR, et al. Selective Sebaceous Gland Electrothermolysis Using a Single Microneedle Radiofrequency Device for Acne Patients: A Prospective Randomized Controlled Study. Lasers Surg Med. 2020;52(5):396–401. doi:10.1002/lsm.23152.</a></li>
      </ul></section>
    </SkinTreatmentLayout>
  </>;
}
