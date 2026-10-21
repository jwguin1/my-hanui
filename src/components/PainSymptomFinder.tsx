import Link from "next/link";
import { PAIN_GROUP_IDS, PAIN_GROUP_ORDER } from "@/lib/pain-groups";
import { postPath } from "@/lib/slug";

const situations = [
  { title: "갑자기 삐끗하거나 담이 왔어요", text: "목이 잘 돌아가지 않거나 허리·발목을 다친 뒤 아플 때", href: "/pain/acute", label: "갑자기 생긴 통증 진료", question: "발목을 삐었을 때, 냉찜질부터 할까요?", slug: "발목-삐었을때-초기대처" },
  { title: "좋아졌다가 같은 곳이 또 아파요", text: "치료 후 다시 불편해지거나 움직임이 계속 제한될 때", href: "/pain/chronic", label: "반복되는 통증 진료", question: "밤에 어깨가 더 아픈 이유는 뭘까요?", slug: "밤에-어깨-아픈이유" },
  { title: "팔이나 다리가 저리고 당겨요", text: "통증과 함께 저림이 있거나 손·다리만 불편할 때", href: "/pain/chronic", label: "저림과 통증 진료", question: "허리는 안 아픈데 다리만 저려도 디스크일까요?", slug: "다리만-저릴때-허리디스크" },
  { title: "사고 뒤부터 몸이 불편해요", text: "교통사고 이후 목·허리 통증이나 불편이 이어질 때", href: "/accident", label: "교통사고 접수·치료 안내", question: "엑스레이는 정상인데 왜 계속 아플까요?", slug: "교통사고-엑스레이-정상" },
];

export function PainBodyLinks() {
  return <nav aria-label="아픈 부위별 질문 찾기" className="flex flex-wrap gap-2">
    {PAIN_GROUP_ORDER.map(name => <Link key={name} href={`/pain#${PAIN_GROUP_IDS[name]}`} className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 py-2 text-base font-medium text-primary hover:bg-surface">{name}</Link>)}
  </nav>;
}

export default function PainSymptomFinder() {
  return <section id="symptom-finder" className="section-padding scroll-mt-24 !py-8 md:!py-12">
    <p className="text-sm font-semibold text-primary">내 증상에서 시작하세요</p>
    <h2 className="mt-3 font-serif text-2xl font-semibold text-ink md:text-3xl">지금 어떤 불편이 있으신가요?</h2>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {situations.map(s => <article key={s.title} className="rounded-2xl border border-line bg-card p-5 md:p-6">
        <h3 className="text-lg font-semibold text-ink">{s.title}</h3>
        <p className="mt-2 text-base leading-relaxed text-muted">{s.text}</p>
        <Link href={s.href} className="mt-3 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">{s.label} →</Link>
        <Link href={postPath("pain", s.slug)} className="mt-3 block border-t border-line pt-4 text-base leading-relaxed text-ink hover:text-primary">{s.question} →</Link>
      </article>)}
    </div>
    <div className="mt-8"><h3 className="mb-3 text-lg font-semibold text-ink">아픈 부위로 질문 찾기</h3><PainBodyLinks /></div>
    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4 text-base font-medium text-primary">
      <Link href="/pain/acute#visit-guide" className="py-2 underline underline-offset-4">처음 오시면 이렇게 진료합니다 →</Link>
      <Link href="/pain/acute#physical-therapy" className="py-2 underline underline-offset-4">물리치료실 이용 안내 →</Link>
      <Link href="/pricing#pain" className="py-2 underline underline-offset-4">통증 진료비 확인 →</Link>
    </div>
  </section>;
}
