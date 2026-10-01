import ConsultationActions from "@/components/ConsultationActions";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import DefinitionCard from "@/components/ui/DefinitionCard";
import StatCard from "@/components/ui/StatCard";
import PriceTable from "@/components/ui/PriceTable";
import QARow from "@/components/ui/QARow";
import NumberedStep from "@/components/ui/NumberedStep";
import PillButton from "@/components/ui/PillButton";
import { Scan, HelpCircle, ChartBar, ListCheck } from "@/components/ui/icons";
import ClinicCta from "@/components/ClinicCta";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/page-metadata";
import { getAllPosts } from "@/lib/blog-local";
import { buildGraph, faqEntities, itemListNode, absoluteUrl } from "@/lib/schema";
import { LIFTING_PATH, LIFTING_SLUGS, LIFTING_UPDATED, PIGMENTATION_PATH, SHURINK_CARE } from "@/lib/skin-guides";
import { SHURINK_PRICES, won, wonDigits } from "@/lib/pricing";
import { postPath } from "@/lib/slug";

const DESCRIPTION = "일산한의원 슈링크 유니버스 리프팅. 300샷 1회 99,000원, 3회 264,000원, 부가세 포함. 마취·시술·LED와 진정팩까지 약 30분, 재시술 12주 간격. 볼살·턱선과 시술 선택에 관한 질문을 확인하세요.";

export const metadata = pageMetadata({
  path: LIFTING_PATH,
  title: "일산 리프팅 | 슈링크 유니버스 300샷 가격·시간·주기",
  description: DESCRIPTION,
  routeOgImage: true,
});

const QUESTIONS = [
  { q: "슈링크 유니버스 300샷 비용은 얼마인가요?", a: `1회 ${won(SHURINK_PRICES.single)}, 3회 ${won(SHURINK_PRICES.threeSessions)}이며 모두 부가세 포함입니다. 3회 구성은 매회 300샷으로 진행합니다.` },
  { q: "시술 시간은 얼마나 걸리나요?", a: `마취 10분, 시술 10분, LED·진정 마스크팩 10분으로 전체 시술 과정은 약 ${SHURINK_CARE.totalMinutes}분입니다. 초진 상담과 접수 시간은 별도입니다.` },
  { q: "다음 시술은 언제 받나요?", a: `일산한의원에서는 ${SHURINK_CARE.intervalWeeks}주 간격으로 재시술을 안내합니다. 다음 방문에서 얼굴선과 탄력 변화를 살펴 치료 계획을 정합니다.` },
  { q: "피코토닝·제네시스와 어떻게 다른가요?", a: "슈링크는 피부 탄력과 처짐, 피코토닝은 갈색 색소와 피부톤, 제네시스는 붉은기와 피부결을 중심으로 상담합니다." },
];

export default function LiftingPage() {
  const all = getAllPosts("skin");
  const posts = LIFTING_SLUGS.map((slug) => {
    const post = all.find((p) => p.slug === slug);
    if (!post) throw new Error(`Missing lifting article: ${slug}`);
    return post;
  });
  const graph = buildGraph({
    path: LIFTING_PATH,
    name: "리프팅 · 슈링크 유니버스 – 일산한의원",
    description: DESCRIPTION,
    image: `${LIFTING_PATH}/opengraph-image`,
    faq: faqEntities(QUESTIONS),
    nodes: [itemListNode(LIFTING_PATH, "questions", "슈링크 리프팅 질문 3가지", posts.map((post) => ({
      url: absoluteUrl(postPath("skin", post.slug)), name: post.title,
    })))],
  });

  return <>
    <JsonLd graph={graph} />
    <PageHeader badge="피부 · 미용" icon={<Scan size={15} />} lead="탄력과 얼굴선을 위한" accent="리프팅" stacked description="슈링크 유니버스 · 300샷" />

    <section className="bg-[var(--bg)]">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl">
          <DefinitionCard title="슈링크 유니버스 리프팅이란?" body="피부 속 목표 깊이에 초음파 에너지를 전달해 탄력 개선을 유도하는 시술입니다. 입 옆 처짐과 흐려진 턱선이 고민일 때, 피부 두께와 볼륨을 살펴 치료 부위를 계획합니다." />
          <p className="mt-6 text-center text-[15px] leading-relaxed text-muted">사진에서 먼저 눈에 들어오는 턱선, 신경 쓰이는 입 옆 처짐.<br />가장 바꾸고 싶은 부분부터 함께 살펴봅니다.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <StatCard value={wonDigits(SHURINK_PRICES.single)} unit="원" label="300샷 1회 · 부가세 포함" />
            <StatCard value={String(SHURINK_CARE.totalMinutes)} unit="분" label="마취·시술·진정 관리 포함" />
            <StatCard value={String(SHURINK_CARE.intervalWeeks)} unit="주" label="원내 재시술 안내 간격" />
          </div>
          <nav aria-label="리프팅 페이지 바로가기" className="mt-8 flex flex-wrap justify-center gap-3">
            <PillButton href="#questions" variant="solid">궁금한 질문 찾기</PillButton>
            <PillButton href="#prices" variant="outline">비용 안내</PillButton>
            <PillButton href="#process" variant="outline">30분 시술 과정</PillButton>
          </nav>
          <p className="mt-5 text-center text-xs text-muted">최종 업데이트 <time dateTime={LIFTING_UPDATED}>2026.10.01</time></p>
        </div>
      </div>
    </section>

    <section id="questions" className="scroll-mt-28 bg-[var(--surface)]">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <SectionBadge icon={<HelpCircle size={15} />} label="질문별 치료 안내" />
          <div className="mt-4"><TwoTone as="h2" lead="슈링크를 시작하기 전 " accent="궁금한 세 가지" /></div>
        </div>
        <ul className="mx-auto mt-10 grid max-w-4xl gap-4">
          {posts.map((post, i) => <li key={post.slug}>
            <Link href={postPath("skin", post.slug)} className="card group flex gap-4 p-6 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
              <span aria-hidden="true" className="pt-1 text-sm font-semibold text-primary">0{i + 1}</span>
              <div className="min-w-0">
                <h3 className="text-lg font-semibold leading-relaxed text-ink group-hover:text-primary">{post.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{post.description}</p>
                <span aria-hidden="true" className="mt-4 block text-sm text-primary">답변 읽기 →</span>
              </div>
            </Link>
          </li>)}
        </ul>
      </div>
    </section>

    <section id="prices" className="scroll-mt-28 bg-[var(--bg)]">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <SectionBadge icon={<ChartBar size={15} />} label="비용 안내" />
          <div className="mt-4"><TwoTone as="h2" lead="슈링크 유니버스 " accent="300샷" /></div>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <PriceTable rowLabel="시술" caption="슈링크 유니버스 리프팅" headers={["1회", "3회"]} rows={[{ name: SHURINK_PRICES.name, price: won(SHURINK_PRICES.single), price2: won(SHURINK_PRICES.threeSessions) }]} note={`부가세 포함 · 매회 300샷 · 3회 구성은 회당 ${won(SHURINK_PRICES.threeSessions / 3)}입니다.`} />
          <p className="mt-5 text-sm leading-relaxed text-muted">처음에는 1회 시술 후 경과를 보며 다음 일정을 정할 수 있습니다. 반복 관리를 계획한다면 3회 구성을 확인해보세요.</p>
          <Link href={postPath("skin", LIFTING_SLUGS[0])} className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4">1회와 3회 선택·12주 간격 자세히 보기 →</Link>
        </div>
      </div>
    </section>

    <section id="process" className="scroll-mt-28 bg-[var(--surface)]">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <SectionBadge icon={<ListCheck size={15} />} label="시술 과정" />
          <div className="mt-4"><TwoTone as="h2" lead="마취부터 진정 관리까지 " accent="약 30분" /></div>
          <p className="mt-4 text-sm text-muted">초진 상담과 접수 시간은 별도로 잡아주세요.</p>
        </div>
        <ol className="mx-auto mt-10 max-w-2xl">{SHURINK_CARE.steps.map((step, i) => <NumberedStep key={step.title} index={i + 1} title={`${step.title} · 약 ${step.minutes}분`} body={step.body} last={i === SHURINK_CARE.steps.length - 1} />)}</ol>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-muted">일반적으로 시술 후 일상생활과 가벼운 화장이 가능합니다. 붉은기나 붓기가 생길 수 있어 중요한 촬영이나 행사를 앞두고 있다면 예약할 때 날짜를 함께 알려주세요.</p>
      </div>
    </section>

    <section className="bg-[var(--bg)]">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl text-center"><SectionBadge icon={<HelpCircle size={15} />} label="자주 묻는 질문" /><div className="mt-4"><TwoTone as="h2" lead="예약 전 " accent="확인하세요" /></div></div>
        <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-3">{QUESTIONS.map((q) => <QARow key={q.q} quote={q.q} answer={q.a} />)}</div>
        <div className="card mx-auto mt-10 max-w-3xl p-6">
          <h2 className="text-lg font-semibold text-ink">잡티나 붉은기도 함께 고민이라면</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">탄력·색소·피부결 중 가장 신경 쓰이는 부분부터 상담할 수 있습니다.</p>
          <div className="mt-4 flex flex-col gap-3 text-sm font-medium text-primary">
            <Link href={postPath("skin", LIFTING_SLUGS[2])} className="underline underline-offset-4">슈링크·피코토닝·제네시스 선택 기준 →</Link>
            <Link href={PIGMENTATION_PATH} className="underline underline-offset-4">피코토닝·제네시스 색소치료와 비용 안내 →</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="section-padding bg-[var(--surface)]"><div className="mx-auto max-w-3xl text-center">
      <h2 className="font-serif text-xl font-semibold text-ink">일산한의원 리프팅 상담</h2>
      <p className="mt-4 text-sm leading-relaxed text-muted">가장 신경 쓰이는 부위와 이전 시술 이력을 알려주세요.<br />이마트 풍산점 3층에서 얼굴선과 탄력 상태를 함께 살펴봅니다.</p>
      <p className="mt-4 text-sm text-muted">궁금한 점과 예약 문의는 카카오톡으로 편하게 남겨주세요.</p>
      <ConsultationActions directions className="mt-6" />
      <Link href="/skin" className="mt-6 inline-block text-sm text-primary underline underline-offset-4">피부·레이저·리프팅 글 전체 보기</Link>
    </div></section>
    <ClinicCta />
  </>;
}
