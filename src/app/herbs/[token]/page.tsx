import Link from "next/link";
import {notFound} from "next/navigation";
import {publicLetter,publicLetterPhotoUrl} from "@/lib/medication-public";
export const dynamic="force-dynamic";
export async function generateMetadata({params}:{params:Promise<{token:string}>}){
  const letter=await publicLetter((await params).token);
  if(!letter)return {title:"복약편지",robots:{index:false,follow:true}};
  const url=`https://www.ilsanhan.com/herbs/${letter.token}`;
  const description=letter.narrative.replace(/\s+/g," ").slice(0,155);
  return {title:letter.title,description,alternates:{canonical:url},robots:{index:true,follow:true},openGraph:{type:"article",title:letter.title,description,url,publishedTime:letter.publishedAt,images:[{url:publicLetterPhotoUrl(letter.token,"web"),alt:"원내에서 준비한 한약 약재"}]}};
}
export default async function Page({params}:{params:Promise<{token:string}>}){
  const {token}=await params;const letter=await publicLetter(token);if(!letter)notFound();
  const structured={"@context":"https://schema.org","@type":"Article",headline:letter.title,datePublished:letter.publishedAt,dateModified:letter.publishedAt,author:{"@type":"Person",name:`${letter.doctorName} 원장`},publisher:{"@type":"MedicalClinic",name:"일산한의원",url:"https://www.ilsanhan.com"},mainEntityOfPage:`https://www.ilsanhan.com/herbs/${token}`,image:publicLetterPhotoUrl(token,"web"),articleBody:letter.narrative};
  return <div className="bg-[#f7f6f0] px-5 py-12 md:py-20"><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,"\\u003c")}}/><div className="mx-auto max-w-3xl"><Link prefetch={false} href="/herbs" className="text-sm text-[#376456]">← 오늘의 한약</Link><article className="mt-6 rounded-2xl border border-[#d9dfd5] bg-white p-6 shadow-sm md:p-12"><header><p className="text-xs tracking-widest text-[#576e5b]">일산한의원 · 맞춤 첩약</p><p className="mt-3 text-sm text-muted">{new Date(letter.publishedAt).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'})} · {letter.doctorName} 원장</p><h1 className="mt-3 font-serif text-3xl font-semibold text-[#233f32]">{letter.title}</h1></header><figure className="my-8 overflow-hidden rounded-xl bg-[#f4f5f0]"><img src={publicLetterPhotoUrl(token,"web")} fetchPriority="high" decoding="async" referrerPolicy="no-referrer" alt="이번 한약을 위해 준비한 약재 사진" className="max-h-[420px] w-full object-contain"/><figcaption className="px-4 py-3 text-center text-xs text-muted">원내에서 준비한 한약 약재</figcaption></figure><div className="space-y-6 text-[16px] leading-8 text-ink"><p className="whitespace-pre-line">{`안녕하세요\n일산한의원 ${letter.doctorName} 원장입니다.`}</p>{letter.narrative.split(/\n\s*\n/).filter(Boolean).map((p,i)=><p key={i} className="whitespace-pre-line">{p}</p>)}</div><p className="mt-10 text-right text-sm text-[#376456]">일산한의원 {letter.doctorName} 원장 드림</p></article><p className="mt-6 text-xs leading-6 text-muted">개인정보를 제외한 복약편지의 상단 내용입니다. 개인별 복용법과 주의사항은 교부받은 복약지를 확인해 주세요. 이 페이지는 최초 게시일부터 1년(365일) 동안 열람할 수 있습니다.</p><a className="mt-5 inline-block text-sm text-[#376456] underline" href="https://pf.kakao.com/_eXXun" target="_blank" rel="noreferrer">복용 중 궁금한 점은 카카오톡으로 문의하세요 →</a></div></div>;
}
