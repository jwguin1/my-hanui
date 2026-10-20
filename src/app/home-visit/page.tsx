import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import PillButton from "@/components/ui/PillButton";
import { MessageCircle, Stethoscope, MapPin, Clock } from "@/components/ui/icons";
import { CLINIC, CLINIC_HOURS_WEEKDAY, CLINIC_HOURS_WEEKEND, CLINIC_HOURS_LUNCH } from "@/lib/clinic";
import { HOME_VISIT, HOME_VISIT_FAQS, HOME_VISIT_PRICES, HOME_VISIT_SERVICES } from "@/lib/home-visit";
import { pageMetadata } from "@/lib/page-metadata";
import { buildGraph, faqEntities } from "@/lib/schema";

export const metadata = pageMetadata({ path: HOME_VISIT.path, title: HOME_VISIT.title, description: HOME_VISIT.description, routeOgImage: true });

const steps = [
  { title: "편한 방법으로 문의", body: "구글 신청서나 카카오톡으로 연락처와 희망 지역을 남겨주세요. 보호자가 대신 신청하셔도 됩니다." },
  { title: "상태·비용·일정 상담", body: "한의원에서 연락드려 이동이 어려운 이유와 필요한 진료를 확인하고, 본인부담금과 방문 일정을 안내합니다." },
  { title: "집으로 찾아가는 진료", body: "약속한 시간에 한의사가 방문합니다. 현재 상태와 복용약을 살피고 진찰 결과에 맞춰 치료합니다." },
  { title: "진료 후 생활 안내", body: "집에서 살펴볼 변화와 생활관리 방법을 알려드립니다. 이후 방문 간격은 경과에 맞춰 상의합니다." },
];

function ApplyButtons() {
  return <div className="flex flex-wrap gap-3">
    <PillButton href={CLINIC.kakaoHref} variant="kakao" icon={<MessageCircle size={17} />}>카카오톡 방문진료 상담</PillButton>
    <PillButton href={HOME_VISIT.formUrl} variant="outline">방문진료 신청서 작성 →</PillButton>
  </div>;
}

export default function HomeVisitPage() {
  return <>
    <JsonLd graph={buildGraph({ path: HOME_VISIT.path, name: HOME_VISIT.title, description: HOME_VISIT.description, faq: faqEntities(HOME_VISIT_FAQS) })} />
    <section className="border-b border-line bg-[var(--bg)]">
      <div className="mx-auto grid max-w-6xl gap-9 px-6 py-12 md:grid-cols-[1.2fr_1fr] md:items-center md:py-20">
        <div>
          <p className="text-sm font-semibold tracking-wide text-primary">일산한의원 · 한의 방문진료 시범사업 참여기관</p>
          <h1 className="mt-5 font-serif text-[clamp(32px,6vw,48px)] font-semibold leading-[1.35] tracking-tight text-ink">집으로 찾아가는<br /><span className="text-primary">일산한의원 방문진료</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-[1.9] text-ink">병원에 가는 일부터 힘겨우셨나요?<br />거동이 불편해 치료를 미뤘던 분을 위해<br className="hidden sm:block" /> 한의사가 익숙한 집으로 찾아갑니다.</p>
          <p className="mb-7 mt-4 text-base leading-relaxed text-muted">환자분의 통증과 움직임, 식사·수면과 복용약까지 함께 살핍니다. 부모님을 위한 상담도 편하게 남겨주세요.</p>
          <ApplyButtons />
          <a href={CLINIC.telHref} className="mt-4 inline-block text-sm text-muted underline underline-offset-4">전화 문의 {CLINIC.tel}</a>
        </div>
        <aside aria-label="방문진료 핵심 안내" className="rounded-2xl border border-line bg-white p-6 md:p-8">
          <p className="text-sm font-semibold text-primary">처음 알아보신다면</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">세 가지만 먼저 확인하세요</h2>
          <dl className="mt-6 divide-y divide-line">
            <div className="pb-5"><dt className="flex items-center gap-2 font-semibold text-ink"><Stethoscope size={19} /> 누구에게 필요한가요?</dt><dd className="mt-2 text-base leading-relaxed text-muted">거동이 불편해 한의원에 오기 어려운 분<br />환자 본인·보호자 모두 상담 가능</dd></div>
            <div className="py-5"><dt className="flex items-center gap-2 font-semibold text-ink"><MapPin size={19} /> 어디까지 방문하나요?</dt><dd className="mt-2 text-base leading-relaxed text-muted">서울·경기 · 차량 약 1시간 이내<br /><span className="text-sm">풍산역·이마트 풍산점 출발 기준</span></dd></div>
            <div className="pt-5"><dt className="flex items-center gap-2 font-semibold text-ink"><Clock size={19} /> 언제 받을 수 있나요?</dt><dd className="mt-2 text-base leading-relaxed text-muted">월~일 진료시간 내 상담 후 일정 확정</dd></div>
          </dl>
          <Link href="#cost" className="mt-6 block border-t border-line pt-5 font-semibold text-primary underline underline-offset-4">건강보험·의료급여 비용 확인 →</Link>
        </aside>
      </div>
    </section>
    <nav aria-label="방문진료 페이지 목차" className="border-b border-line bg-white px-5 py-4">
      <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-primary">
        {[["who", "방문 대상"], ["care", "받을 수 있는 진료"], ["cost", "비용·보험"], ["area", "지역·시간"], ["process", "이용 과정"], ["questions", "궁금한 질문"], ["apply", "상담 신청"]].map(([id, text]) => <Link key={id} href={`#${id}`} className="underline-offset-4 hover:underline">{text}</Link>)}
      </div>
    </nav>

    <section id="who" className="scroll-mt-24 px-6 py-14 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-primary">이런 어려움이 있으신가요?</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold leading-snug text-ink">외출의 부담을 덜고,<br className="sm:hidden" /> 필요한 진료를 이어가세요</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            ["걷거나 차에 타는 일이 힘들 때", "허리·무릎 통증이나 디스크·협착증 때문에 병원까지 이동하기 어려운 분"],
            ["퇴원 후 집에서 회복 중일 때", "수술 후 회복기나 중풍 후유증 등으로 움직임과 일상생활에 도움이 필요한 분"],
            ["오래 누워 지내거나 움직임이 줄었을 때", "마비·신경계 질환 등으로 외출이 어렵고 통증과 생활 상태를 함께 살펴야 하는 분"],
            ["부모님의 진료 방법을 찾고 있을 때", "거동이 불편한 부모님을 모시고 병원에 가는 일이 걱정되는 가족"],
          ].map(([title, body]) => <article key={title} className="rounded-xl border border-line bg-white p-6"><h3 className="text-lg font-semibold text-ink">{title}</h3><p className="mt-3 text-base leading-relaxed text-muted">{body}</p></article>)}
        </div>
        <p className="mt-6 text-base leading-relaxed text-muted">방문진료는 한의사가 환자의 집에서 진찰·치료하는 서비스입니다. 현재 상태와 이동의 어려움을 상담한 뒤 방문 계획을 세웁니다.</p>
      </div>
    </section>

    <section id="care" className="scroll-mt-24 bg-[var(--surface)] px-6 py-14 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-primary">집에서 받는 한의 진료</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">아픈 곳과 하루의 생활을 함께 살핍니다</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {HOME_VISIT_SERVICES.map(s => <article key={s.title} className="rounded-2xl border border-line bg-white p-6"><h3 className="text-xl font-semibold text-ink">{s.title}</h3><p className="mt-4 text-base leading-[1.85] text-muted">{s.text}</p>{s.link && <Link href={s.link} className="mt-5 inline-block text-sm font-medium text-primary underline underline-offset-4">{s.linkLabel} →</Link>}</article>)}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-muted">필요한 치료와 준비물은 방문 전에 상담합니다. 일산한의원은 한의사 방문진료를 운영하며, 재택의료센터의 간호사·사회복지사 정기 방문 서비스는 포함하지 않습니다.</p>
      </div>
    </section>

    <section id="cost" className="scroll-mt-24 px-6 py-14 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-primary">방문 전에 비용부터 확인하세요</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">방문진료 본인부담금</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {HOME_VISIT_PRICES.map(p => <article key={p.label} className="rounded-2xl border border-line bg-white p-6"><h3 className="min-h-14 text-lg font-semibold leading-relaxed text-ink">{p.label}</h3><p className="mt-4 text-sm text-muted">{p.rate}</p><p className="mt-1 text-3xl font-bold tracking-tight text-primary">{p.price}</p><p className="mt-4 text-sm leading-relaxed text-muted">{p.detail}</p></article>)}
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted">{HOME_VISIT.costNote}</p>
        <div className="mt-8 grid gap-6 rounded-2xl bg-[var(--surface)] p-6 md:grid-cols-2 md:p-8">
          <div><h3 className="font-semibold text-ink">포함되는 비용</h3><p className="mt-3 text-base leading-relaxed text-muted">방문 시 급여 진료행위·약제·치료재료 비용은 방문진료료에 포함됩니다. 외래 진찰료와 교통비는 별도로 산정하지 않습니다.</p></div>
          <div><h3 className="font-semibold text-ink">추가로 상담할 내용</h3><p className="mt-3 text-base leading-relaxed text-muted">비급여 한약·치료와 서류 발급을 원하시면 비용을 먼저 안내합니다. 같은 집에서 두 분 이상 진료받거나 별도 산정 기준이 적용되는 경우도 상담 때 알려주세요.</p></div>
        </div>
        <p className="mt-5 text-sm leading-relaxed text-muted">거동에 불편이 없는 분의 요청 방문은 방문진료료 전액 본인부담입니다. 실손보험 청구는 가입 상품과 약관에 따라 보험사에 확인하실 수 있습니다.</p>
      </div>
    </section>

    <section id="area" className="scroll-mt-24 border-y border-line bg-white px-6 py-14 md:py-20">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
        <div><p className="text-sm font-semibold text-primary">방문 가능 지역</p><h2 className="mt-3 font-serif text-3xl font-semibold text-ink">서울·경기,<br />차량 약 1시간 이내</h2><p className="mt-5 text-base leading-[1.85] text-muted">풍산역·이마트 풍산점에 있는 일산한의원에서 출발합니다. {HOME_VISIT.areaNote}</p><p className="mt-4 font-medium text-primary">신청서에 시·구·동을 남겨주시면 확인해 드립니다.</p></div>
        <div><p className="text-sm font-semibold text-primary">상담·방문 일정</p><h2 className="mt-3 font-serif text-3xl font-semibold text-ink">월요일부터 일요일까지</h2><dl className="mt-5 divide-y divide-line text-base"><div className="flex flex-wrap justify-between gap-2 py-3"><dt>평일</dt><dd className="font-semibold">{CLINIC_HOURS_WEEKDAY}</dd></div><div className="flex flex-wrap justify-between gap-2 py-3"><dt>토·일·공휴일</dt><dd className="font-semibold">{CLINIC_HOURS_WEEKEND}</dd></div><div className="flex flex-wrap justify-between gap-2 py-3"><dt>평일 점심시간</dt><dd>{CLINIC_HOURS_LUNCH}</dd></div></dl><p className="mt-4 text-sm leading-relaxed text-muted">위 진료시간 안에서 방문 날짜와 시간을 상담 후 정합니다. {CLINIC.holidayClosedNote}</p></div>
      </div>
    </section>

    <section id="process" className="scroll-mt-24 px-6 py-14 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-primary">처음 신청하는 분도 어렵지 않게</p><h2 className="mt-3 font-serif text-3xl font-semibold text-ink">문의부터 방문 후 안내까지</h2>
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{steps.map((s, i) => <li key={s.title} className="rounded-xl border border-line bg-white p-6"><span className="text-3xl font-semibold text-tan">0{i + 1}</span><h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3><p className="mt-3 text-base leading-relaxed text-muted">{s.body}</p></li>)}</ol>
      </div>
    </section>

    <section id="questions" className="scroll-mt-24 bg-[var(--surface)] px-6 py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold text-primary">환자와 보호자를 위한 Q&amp;A</p><h2 className="mt-3 font-serif text-3xl font-semibold text-ink">신청 전에 궁금한 질문</h2>
        <div className="mt-7 divide-y divide-line rounded-2xl border border-line bg-white px-6 md:px-8">{HOME_VISIT_FAQS.map(f => <article key={f.id} id={`question-${f.id}`} className="scroll-mt-24 py-7"><h3 className="text-lg font-semibold leading-relaxed text-ink">{f.q}</h3><p className="mt-3 text-base leading-[1.9] text-muted">{f.a}</p></article>)}</div>
      </div>
    </section>

    <section id="apply" className="scroll-mt-24 px-6 py-14 md:py-20">
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-6 md:p-10">
        <p className="text-sm font-semibold text-primary">일산한의원 방문진료 상담</p><h2 className="mt-3 font-serif text-3xl font-semibold leading-snug text-ink">먼저 이야기해 주세요.<br />방문 방법을 함께 찾겠습니다.</h2>
        <p className="mb-7 mt-5 text-base leading-[1.85] text-muted">짧은 신청서에 성함·연락처·희망 지역을 남겨주세요. 한의원에서 연락드려 필요한 진료와 일정을 상담합니다. 폼 응답은 홈페이지에 공개되지 않습니다.</p>
        <ApplyButtons />
        <p className="mt-5 text-base text-ink">문의·회신 연락처 <a href={CLINIC.telHref} className="font-semibold underline underline-offset-4">{CLINIC.tel}</a></p>
        <p className="mt-4 text-sm leading-relaxed text-muted">신청 후 상담을 거쳐 예약이 확정됩니다. 응급 상황에서는 방문 예약을 기다리지 말고 119에 연락해 주세요.</p>
      </div>
      <nav aria-label="관련 진료 안내" className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-primary"><Link href="/doctor">의료진 소개 →</Link><Link href="/pain/chronic">통증·추나·약침 →</Link><Link href="/herbal/insurance">보험한약 →</Link><Link href="/herbal/tonic">체질보약 →</Link><Link href="/pricing">원내 진료비 안내 →</Link></nav>
    </section>
  </>;
}
