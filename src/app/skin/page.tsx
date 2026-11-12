import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import FaqList from "@/components/ui/FaqList";
import SkinDeviceGallery from "@/components/SkinDeviceGallery";
import ConsultationActions from "@/components/ConsultationActions";
import { categoryMetadata, CATEGORY_META, SITE_URL } from "@/lib/categories";
import { getAllPosts, toISO8601KST } from "@/lib/blog-local";
import { postPath } from "@/lib/slug";
import { postImagePath } from "@/lib/og-image";
import { articleStub, buildGraph, faqEntities, itemListNode, physicianStubs } from "@/lib/schema";

/**
 * revalidate 를 두지 않는다 = 빌드 시 정적 생성, 다음 배포까지 고정.
 *
 * 이 페이지의 데이터는 전부 레포 안의 content/*.md 다. 배포 없이는 바뀌지 않으므로
 * ISR 로 얻을 것이 없다. 반면 잃는 것은 있었다 — Next 의 stale-while-revalidate 는
 * 만료 후 첫 요청자에게 **낡은 사본을 먼저 주고** 뒤에서 재생성한다.
 * 저트래픽 사이트에서 하루 한 번 오는 크롤러는 매번 그 낡은 사본을 받는다.
 *
 * 실제로 2026-08-19 발행한 21편이 /blog 에는 보이는데 /pain 에는 안 보이는 상태가
 * 관측됐다 (X-Vercel-Cache: STALE). 같은 배포, 같은 시점이었다.
 *
 * 외부 데이터를 읽는 / · /column · /media 는 예외다 — 거긴 배포와 무관하게
 * 원본이 바뀌므로 fetch 단위 revalidate 를 그대로 둔다.
 */

export const metadata = categoryMetadata("skin");
const treatments = [
  { slug: "spot", title: "잡티제거", summary: "점·편평사마귀·쥐젖", detail: "병변을 살펴보고 하나씩 제거합니다." },
  { slug: "pigmentation", title: "색소·홍조·재생치료", summary: "피부 상태에 맞춘 레이저 치료", detail: "부위마다 장비와 파장을 골라 치료합니다." },
  { slug: "toning", title: "토닝관리", summary: "제네시스·피코토닝", detail: "피부결과 피부톤을 고르게 관리합니다." },
  { slug: "lifting", title: "리프팅", summary: "슈링크 유니버스·볼뉴머", detail: "얼굴선과 피부 탄력을 함께 살핍니다." },
  { slug: "hair-removal", title: "제모", summary: "얼굴·수염 레이저 제모", detail: "모발 굵기와 피부색에 맞춰 진행합니다." },
] as const;
const questions = [
  { q: "어떤 시술을 골라야 할지 모르겠어요.", a: "가장 신경 쓰이는 부위와 이전에 받은 시술을 알려주세요. 점이나 편평사마귀처럼 제거할 병변인지, 색소·혈관 치료가 필요한지 먼저 살펴보고 진료 방향을 안내합니다." },
  { q: "맞춤 치료와 토닝관리는 어떻게 다른가요?", a: "색소·홍조·재생치료는 갈색 반점, 붉은 부위, 실핏줄 등 치료할 부위에 맞춰 장비와 파장을 정합니다. 토닝관리는 제네시스 또는 피코토닝을 선택해 얼굴 전반의 피부결과 피부톤을 관리합니다." },
  { q: "가격과 시술 후 관리는 어디서 확인하나요?", a: "위 진료 카드를 누르면 시술별 가격과 구성, 시술 후 관리 방법을 확인할 수 있습니다. 여러 시술을 함께 고민하고 계시면 상담 때 알려주세요. 피부 상태와 일정을 함께 보고 순서를 정합니다." },
];

export default function SkinPage() {
  const posts = getAllPosts("skin");
  const list = itemListNode("/skin", "post-list", "피부 진료 질문", posts.map(post => {
    const path = postPath("skin", post.slug);
    const imagePath = postImagePath(post.id, post.thumbnail, CATEGORY_META.skin.ogImage);
    const image = imagePath.startsWith("http") ? imagePath : `${SITE_URL}${imagePath}`;
    return { url: `${SITE_URL}${path}`, name: post.title, image, item: articleStub({ path, headline: post.title, description: post.description, datePublished: toISO8601KST(post.date), dateModified: toISO8601KST(post.updated ?? post.date), image, author: post.author }) };
  }));
  return <div className="skin-treatment bg-[var(--bg)]">
    <JsonLd graph={buildGraph({ path: "/skin", name: "피부·레이저 | 일산한의원", description: CATEGORY_META.skin.description, image: CATEGORY_META.skin.ogImage, faq: faqEntities(questions), nodes: [list, ...physicianStubs(posts.map(post => post.author)), itemListNode("/skin", "treatments", "피부·레이저 진료", treatments.map(item => ({ url: `${SITE_URL}/skin/${item.slug}`, name: item.title })))] })} />
    <div className="mx-auto max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pt-16">
      <header className="mb-7 sm:mb-10">
        <p className="text-sm font-semibold text-primary">일산한의원 피부클리닉</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">피부·레이저</h1>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">내 피부에 필요한 치료와 관리, 여기서 찾아보세요.</p>
      </header>
      <nav aria-label="피부·레이저 진료 선택" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {treatments.map((item, index) => <Link key={item.slug} href={`/skin/${item.slug}`} className="group flex items-center gap-4 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:block sm:p-6">
          <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f6efe7] text-sm font-bold text-primary">0{index + 1}</span>
          <div className="min-w-0 flex-1 sm:mt-4"><h2 className="text-lg font-bold leading-snug text-ink sm:text-xl">{item.title}</h2><p className="mt-1 text-sm leading-relaxed text-muted sm:text-base">{item.summary}</p><p className="mt-2 hidden text-sm leading-relaxed text-muted sm:block">{item.detail}</p></div>
          <span aria-hidden="true" className="text-primary sm:mt-4 sm:block">↗</span>
        </Link>)}
        <Link href="/skin/agnes" className="flex items-center gap-4 rounded-2xl border border-[#decdbb] bg-[#f7f0e8] p-5 sm:block sm:p-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sm font-bold text-primary">RF</span>
          <div className="min-w-0 flex-1 sm:mt-4"><h2 className="text-lg font-bold leading-snug sm:text-xl">아그네스</h2><p className="mt-1 text-sm leading-relaxed text-muted sm:text-base">반복되는 여드름, 피지선에 집중</p><p className="mt-2 hidden text-sm leading-relaxed text-muted sm:block">미세침 고주파 치료를 알아보세요.</p></div><span aria-hidden="true" className="text-primary sm:mt-4 sm:block">↗</span>
        </Link>
      </nav>
      <section className="mt-12 border-t border-line pt-10 sm:mt-16">
        <h2 className="text-2xl font-bold sm:text-3xl">피부에 맞춰 고르는 장비</h2>
        <p className="mb-6 mt-3 text-base leading-relaxed text-muted">레이저·초음파·고주파, 치료 목적에 맞게 사용합니다.</p>
        <SkinDeviceGallery links />
      </section>
      <section className="mt-12 sm:mt-16"><h2 className="mb-6 text-2xl font-bold sm:text-3xl">진료 전 궁금한 점</h2><FaqList items={questions} /></section>
      <section className="mt-10">
        <Link href="/skin/questions" className="inline-flex min-h-11 items-center text-base font-semibold text-primary underline underline-offset-4">내 피부 고민에 맞는 질문 찾기 →</Link>
        <details className="mt-4 rounded-2xl border border-line bg-white p-5 sm:p-6">
          <summary className="cursor-pointer text-base font-semibold leading-relaxed">피부 진료 질문 전체 보기 <span className="text-muted">({posts.length})</span></summary>
          <ul className="mt-5 grid gap-x-8 sm:grid-cols-2">{posts.map(post => <li key={post.slug} className="border-t border-line"><Link href={postPath("skin", post.slug)} className="block py-4 text-base leading-relaxed text-primary hover:underline">{post.title}</Link></li>)}</ul>
        </details>
      </section>
      <section className="mt-12 rounded-2xl bg-surface px-5 py-8 text-center sm:mt-16"><h2 className="text-2xl font-bold">피부 고민, 편하게 물어보세요.</h2><p className="mt-3 text-base leading-relaxed text-muted">고민 부위와 희망 일정을 알려주세요.</p><ConsultationActions directions className="mt-6" /></section>
    </div>
  </div>;
}
