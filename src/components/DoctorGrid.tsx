import Image from "next/image";
import Link from "next/link";
import { DOCTOR_SLUGS } from "@/lib/schema";

interface Doctor {
  name: string; image: string; bio?: string[]; school?: string;
  credentials?: { abbr: string; name: string; issuer: string; issuerFull: string }[];
  laserCertification?: string; societies?: string[];
}

export default function DoctorGrid({ doctors }: { doctors: Doctor[] }) {
  return <section className="mx-auto max-w-6xl px-6 py-10">
    <h2 className="font-serif text-2xl font-semibold text-ink">진료하는 의료진을 만나보세요</h2>
    <p className="mt-3 text-base leading-relaxed text-muted">6명의 한의사가 통증·한약·피부레이저 진료를 함께합니다. 원하는 원장이 있으시면 카카오톡으로 방문 희망일을 알려주세요.</p>
    <nav aria-label="의료진 소개 바로가기" className="mt-5 flex flex-wrap gap-3">{doctors.map(doc => <Link key={doc.name} href={`#${DOCTOR_SLUGS[doc.name]}`} className="rounded-full border border-line px-4 py-2 text-sm text-primary">{doc.name} 원장</Link>)}</nav>
    <div className="mt-8 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
      {doctors.map(doc => <article key={doc.name} id={DOCTOR_SLUGS[doc.name]} className="scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-card">
        {/* 원본마다 비율이 달라 contain으로 인물과 사진 가장자리를 모두 보존한다. */}
        <div className="relative aspect-[3/4] bg-[#f1f1ef]"><Image src={doc.image} alt={`${doc.name} 원장`} fill sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) calc((100vw - 72px) / 2), (max-width: 1151px) calc((100vw - 96px) / 3), 352px" className="doctor-portrait object-contain object-center" /></div>
        <div className="p-5">
          <h3 className="font-serif text-xl font-semibold text-ink">{doc.name} 원장 · 한의사</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted">{doc.school} 졸업</p>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
            {doc.credentials?.map(c => <li key={c.abbr}>{c.abbr} — {c.name}<span className="block text-muted">발급: {c.issuer} ({c.issuerFull})</span></li>)}
            <li>대한통합레이저의학회 정회원</li>
            {doc.laserCertification && <li>{doc.laserCertification}</li>}
          </ul>
          <details className="mt-5 border-t border-line pt-4">
            <summary className="cursor-pointer font-medium text-primary">원장의 진료 이야기·학회 활동</summary>
            <div className="mt-4 space-y-4 text-[15px] leading-[1.9] text-muted">{doc.bio?.map((p, i) => <p key={i}>{p}</p>)}</div>
            <p className="mt-5 text-sm font-semibold text-ink">학회 활동</p>
            <ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted">{doc.societies?.map(s => <li key={s}>{s}</li>)}</ul>
          </details>
        </div>
      </article>)}
    </div>
  </section>;
}
