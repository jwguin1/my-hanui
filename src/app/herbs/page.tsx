import Link from "next/link";
import {publicLetters} from "@/lib/medication-public";
import {pageMetadata} from "@/lib/page-metadata";
export const dynamic="force-dynamic";
export const metadata=pageMetadata({path:"/herbs",title:"오늘의 한약 · 나를 위한 복약편지",description:"일산한의원에서 환자 한 분 한 분의 상태를 살펴 처방하고 원내에서 준비한 한약, 약재 사진과 담당 원장의 복약편지를 만나보세요."});
export default async function Page({searchParams}:{searchParams:Promise<{page?:string}>}){
  const query=await searchParams;const page=Math.max(1,Math.min(10000,Number(query.page)||1));const data=await publicLetters((Math.floor(page)-1)*12);
  return <div className="bg-[#f7f6f0] pb-20">
    <header className="mx-auto max-w-5xl px-6 pb-10 pt-16 md:pt-24"><p className="text-sm tracking-widest text-[#576e5b]">일산한의원 · 원내 한약 조제</p><h1 className="mt-4 font-serif text-4xl font-semibold text-[#233f32] md:text-5xl">오늘의 한약</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted">한 분의 이야기를 듣고,<br/>그분을 위한 한약과 편지를 준비합니다.</p><p className="mt-4 max-w-2xl text-base leading-7 text-muted">증상과 진찰·검사 결과를 살펴 원장이 직접 처방합니다. 원내에서 준비하는 약재 사진과 치료 방향을 담은 복약편지를 만나보세요.</p><Link href="/herbal" className="mt-5 inline-block text-sm underline underline-offset-4">보험한약·체질보약 진료 안내 →</Link></header>
    <section aria-label="복약편지 목록" className="mx-auto max-w-5xl px-6"><div className="mb-6 flex items-end justify-between border-b border-[#d9dfd5] pb-4"><h2 className="font-serif text-2xl text-[#233f32]">나를 위한 복약편지</h2><span className="text-xs text-muted">공개 동의를 받은 기록</span></div>
      {!data.letters.length?<div role={data.unavailable?"alert":undefined} className="rounded-2xl border border-[#d9dfd5] bg-white p-10 text-center text-muted">{data.unavailable?"복약편지를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.":"약재 사진과 복약편지를 차곡차곡 준비하고 있습니다."}</div>:<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.letters.map(l=><Link prefetch={false} href={`/herbs/${l.token}`} key={l.token} className="overflow-hidden rounded-2xl border border-[#d9dfd5] bg-white transition hover:shadow-lg"><div className="aspect-[4/3] bg-[#eeeee7]"><img src={`/herbs/${l.token}/photo`} alt="원내에서 준비한 한약 약재" className="h-full w-full object-cover" loading="lazy"/></div><div className="p-5"><p className="text-xs text-[#576e5b]">{new Date(l.publishedAt).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'})} · {l.doctorName} 원장</p><h3 className="mt-2 font-serif text-xl font-semibold">{l.title}</h3><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">{l.narrative}</p><span className="mt-5 block text-sm font-medium text-[#376456]">복약편지 읽기 →</span></div></Link>)}</div>}
      <nav aria-label="복약편지 페이지" className="mt-8 flex justify-center gap-8">{page>1&&<Link prefetch={false} href={`/herbs?page=${page-1}`}>← 이전</Link>}{data.hasMore&&<Link prefetch={false} href={`/herbs?page=${page+1}`}>다음 →</Link>}</nav><p className="mt-10 text-xs leading-6 text-muted">환자의 동의를 받은 사진과 편지 일부를 개인정보 없이 소개합니다. 각 편지는 개별 진료 내용에 따른 안내이며, 다른 분의 처방이나 복용법을 대신하지 않습니다.</p>
    </section>
  </div>;
}
