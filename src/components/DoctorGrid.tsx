import Image from "next/image";
import Link from "next/link";
import { DOCTOR_SLUGS } from "@/lib/schema";
import { type Doctor, DOCTOR_WORKDAYS, INTERNAL_MEDICINE_PAPERS, SHOULDER_LECTURE } from "@/lib/doctor-profile";

export default function DoctorGrid({ doctors }: { doctors: Doctor[] }) {
  return <section className="mx-auto max-w-6xl px-6 py-10">
    <h2 className="font-serif text-2xl font-semibold text-ink">진료하는 의료진을 만나보세요</h2>
    <p className="mt-3 text-base leading-relaxed text-muted">{doctors.length}명의 한의사가 함께합니다. 원하는 원장이 있으시면 카카오톡으로 방문 희망일을 알려주세요.</p>
    <div className="mt-8 grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3">
      {doctors.map(doc => <article key={doc.name} id={DOCTOR_SLUGS[doc.name]} className="scroll-mt-28 overflow-hidden rounded-2xl border border-line bg-card">
        {/* 동일한 세로 비율로 여백 없이 채우고, 머리 위 공간을 보존한다. */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f1f1ef]"><Image src={doc.image} alt={`${doc.name} 원장`} fill sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) calc((100vw - 72px) / 2), (max-width: 1151px) calc((100vw - 96px) / 3), 352px" className="doctor-portrait object-cover object-top" /></div>
        <div className="p-5">
          <h3 className="font-serif text-xl font-semibold text-ink">{doc.name} 원장 · 한의사</h3>
          <Link href="#weekly-schedule" aria-label={`${doc.name} 원장 진료일 확인`} className="mt-1 inline-flex min-h-11 items-center text-base font-semibold text-primary underline underline-offset-4">
            진료일 · {DOCTOR_WORKDAYS[doc.name].join("·")}
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted">{doc.school} 졸업</p>
          {doc.specialty && <p className="mt-2 text-sm font-semibold text-primary">{doc.specialty}</p>}
          <p className="mt-3 text-base leading-relaxed text-ink">{doc.introduction}</p>
          <nav aria-label={`${doc.name} 원장 관련 진료 안내`} className="mt-2 flex flex-wrap gap-x-4 text-base text-primary underline underline-offset-4">
            {doc.careLinks.map(link => <Link className="inline-flex min-h-11 items-center" href={link.href} key={link.href}>{link.label}</Link>)}
          </nav>
          {(doc.credentials?.length || doc.laserCertification || doc.societies?.includes("대한통합레이저의학회 정회원")) ? <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink">
            {doc.credentials?.map(c => <li key={c.abbr}>{c.abbr} — {c.name}<span className="block text-muted">발급: {c.issuer} ({c.issuerFull})</span></li>)}
            {doc.societies?.includes("대한통합레이저의학회 정회원") && <li>대한통합레이저의학회 정회원</li>}
            {doc.laserCertification && <li>{doc.laserCertification}</li>}
          </ul> : null}
          <details className="mt-5 border-t border-line pt-4">
            <summary className="min-h-11 cursor-pointer py-2 font-medium text-primary">{doc.bio?.length ? "원장의 진료 이야기·학회 활동" : "학력·경력 자세히 보기"}</summary>
            <div className="mt-4 space-y-4 text-[15px] leading-[1.9] text-muted">{doc.bio?.map((p, i) => <p key={i}>{p}</p>)}</div>
            {doc.education?.length ? <><p className="mt-5 text-sm font-semibold text-ink">학력·자격</p><ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted">{doc.education.map(item => <li key={item}>{item}</li>)}</ul></> : null}
            {doc.career?.length ? <><p className="mt-5 text-sm font-semibold text-ink">주요 경력</p><ul className="mt-2 space-y-3 text-sm leading-relaxed text-muted">{doc.career.map(item => <li key={item}>{item}</li>)}</ul></> : null}
            {doc.societies?.length ? <><p className="mt-5 text-sm font-semibold text-ink">학회 활동</p><ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted">{doc.societies.map(s => <li key={s}>{s}</li>)}</ul></> : null}
            {doc.name === "장경진" && <div className="mt-5">
              <h4 className="font-semibold text-ink">어깨 통증 학술대회 강연</h4>
              <p className="mt-2 text-base leading-relaxed text-muted">{SHOULDER_LECTURE.description}</p>
              <a href={SHOULDER_LECTURE.href} className="mt-2 inline-flex min-h-11 items-center text-primary underline underline-offset-4">민족의학신문 강연 보도 읽기</a>
            </div>}
            {doc.name === "오서혜" && <div className="mt-5">
              <h4 className="font-semibold text-ink">동서한방병원 한방내과에서 발표한 논문</h4>
              <ul className="mt-2 space-y-3">
                {INTERNAL_MEDICINE_PAPERS.map(paper => <li key={paper.href}>
                  <a href={paper.href} className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">{paper.title}</a>
                  <p className="text-sm leading-relaxed text-muted">{paper.credit} · {paper.citation}</p>
                </li>)}
              </ul>
            </div>}
          </details>
          {doc.name === "오서혜" && <nav aria-label="한방내과 진료 질문" className="mt-4 border-t border-line pt-4">
            <h4 className="font-semibold text-ink">한방내과 진료 질문</h4>
            <ul className="mt-2 divide-y divide-line">
              {[
                ["/blog/소화불량-한약-재진", "소화불량 한약, 언제까지 먹나요?"],
                ["/blog/부모님-보약-상담준비", "부모님 보약, 자녀가 먼저 문의해도 되나요?"],
                ["/blog/소화불량-보험한약-보약-비용", "보험 첩약과 체질보약, 비용은 어떻게 다른가요?"],
              ].map(([href, title]) => <li key={href}>
                <Link href={href} className="flex min-h-11 items-center justify-between gap-2 py-3 text-base leading-relaxed text-primary hover:underline focus-visible:underline">
                  {title}<span aria-hidden="true">→</span>
                </Link>
              </li>)}
            </ul>
          </nav>}
        </div>
      </article>)}
    </div>
  </section>;
}
