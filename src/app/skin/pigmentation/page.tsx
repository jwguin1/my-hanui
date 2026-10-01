import ConsultationActions from "@/components/ConsultationActions";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import DefinitionCard from "@/components/ui/DefinitionCard";
import StatCard from "@/components/ui/StatCard";
import IconTile from "@/components/ui/IconTile";
import PriceTable from "@/components/ui/PriceTable";
import QARow from "@/components/ui/QARow";
import NumberedStep from "@/components/ui/NumberedStep";
import PillButton from "@/components/ui/PillButton";
import { Scan, HelpCircle, ChartBar, Flame, ListCheck } from "@/components/ui/icons";
import ClinicCta from "@/components/ClinicCta";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/page-metadata";
import { getAllPosts } from "@/lib/blog-local";
import { buildGraph, faqEntities, itemListNode, absoluteUrl } from "@/lib/schema";
import { PIGMENTATION_GROUPS, PIGMENTATION_PATH, PIGMENTATION_UPDATED, LIFTING_PATH } from "@/lib/skin-guides";
import { PIGMENTATION_PRICES, won, wonDigits } from "@/lib/pricing";
import { postPath } from "@/lib/slug";

const DESCRIPTION = "일산한의원 색소치료. 피코하이·엘리멘트 TL로 기미·주근깨·흑자와 피부결·홍조를 상담합니다. 피코 트리플 토닝·제네시스 포함 1회 88,000원, 10회 660,000원. 부가세 포함.";

export const metadata = pageMetadata({
  path: PIGMENTATION_PATH,
  title: "일산 색소치료 | 피코토닝·제네시스 비용과 기미·흑자 질문",
  description: DESCRIPTION,
  routeOgImage: true,
});

const QUESTIONS = [
  { q: "기미와 흑자는 같은 치료를 받나요?", a: "넓게 퍼진 기미와 경계가 뚜렷한 흑자는 색소의 모습과 치료 범위를 살펴보고 접근합니다." },
  { q: "피코토닝과 제네시스를 왜 함께 받나요?", a: "갈색 색소와 함께 붉은기·피부결이 고민일 때 각각의 치료 목표를 정해 병행을 고려합니다." },
  { q: "토닝 비용에 제네시스도 포함되나요?", a: `${PIGMENTATION_PRICES.name}를 포함해 1회 ${won(PIGMENTATION_PRICES.single)}, 10회 ${won(PIGMENTATION_PRICES.tenSessions)}입니다. 부가세 포함입니다.` },
  { q: "토닝 후 딱지가 없으면 효과가 없는 건가요?", a: "얼굴 전체 토닝과 특정 반점 치료는 회복 모습이 다릅니다. 같은 조명에서 색소 변화와 피부 회복 상태를 살펴봅니다." },
];

const DEVICES = [
  { title: "피코하이", body: "기미·잡티 등 색소 고민에 사용하는 피코초 레이저입니다. 얼굴 전체의 피부톤과 눈에 띄는 반점을 살펴 치료 방향을 정합니다." },
  { title: "엘리멘트 TL", body: "532·755·1064nm 세 파장을 갖춘 롱펄스 레이저입니다. 색소와 붉은기, 피부결 등 고민에 맞춰 파장과 조사 방식을 선택합니다." },
];

const STEPS = [
  { title: "고민 부위 확인", body: "언제부터 생겼는지, 햇빛과 계절에 따라 어떻게 달라지는지 확인합니다." },
  { title: "치료 목표와 비용 상담", body: "피부톤·반점·붉은기·피부결 중 가장 바꾸고 싶은 부분을 정하고 치료 범위와 비용을 살펴봅니다." },
  { title: "피부 상태에 맞춘 시술", body: "이전 시술 이력과 현재 피부 반응을 고려해 장비와 조사 방식을 선택합니다." },
  { title: "경과와 다음 일정 확인", body: "색소 변화와 회복 상태를 확인하며 다음 시술 시점과 유지 관리 방향을 정합니다." },
];

export default function PigmentationPage() {
  const posts = getAllPosts("skin");
  const groups = PIGMENTATION_GROUPS.map((group) => ({
    ...group,
    posts: group.slugs.map((slug) => {
      const post = posts.find((p) => p.slug === slug);
      if (!post) throw new Error(`Missing pigmentation article: ${slug}`);
      return post;
    }),
  }));
  const graph = buildGraph({
    path: PIGMENTATION_PATH,
    name: "색소치료 · 피코토닝·제네시스 – 일산한의원",
    description: DESCRIPTION,
    image: `${PIGMENTATION_PATH}/opengraph-image`,
    faq: faqEntities(QUESTIONS),
    nodes: [itemListNode(PIGMENTATION_PATH, "questions", "색소치료 질문 10가지", groups.flatMap((g) => g.posts).map((post) => ({ url: absoluteUrl(postPath("skin", post.slug)), name: post.title })))],
  });

  return <>
    <JsonLd graph={graph} />
    <PageHeader badge="피부 · 미용" icon={<Scan size={15} />} lead="기미·잡티부터 피부결까지" accent="색소치료" stacked description="피코하이 · 엘리멘트 TL / 피코토닝 · 제네시스" />

    <section className="bg-[var(--bg)]">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl">
          <DefinitionCard title="색소치료란?" body="기미·주근깨·흑자 등 갈색 색소를 옅게 하고 피부톤을 고르게 만드는 치료입니다. 일산한의원에서는 피코하이와 엘리멘트 TL을 이용해 색소와 함께 붉은기·피부결 고민을 상담합니다." />
          <p className="mt-6 text-center text-[15px] leading-relaxed text-muted">얼굴 전체의 얼룩인지, 반점 하나인지.<br />가장 신경 쓰이는 부분부터 함께 살펴봅니다.</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <StatCard value={wonDigits(PIGMENTATION_PRICES.single)} unit="원" label="피코·제네시스 포함 1회" />
            <StatCard value={wonDigits(PIGMENTATION_PRICES.tenSessions)} unit="원" label="10회 · 부가세 포함" />
            <StatCard value="10" unit="가지" label="질문별로 읽는 치료 안내" />
          </div>
          <nav aria-label="색소치료 페이지 바로가기" className="mt-8 flex flex-wrap justify-center gap-3">
            <PillButton href="#questions" variant="solid">궁금한 질문 찾기</PillButton>
            <PillButton href="#prices" variant="outline">비용 안내</PillButton>
            <PillButton href="#devices" variant="outline">사용 장비</PillButton>
          </nav>
          <p className="mt-5 text-center text-xs text-muted">최종 업데이트 <time dateTime={PIGMENTATION_UPDATED}>2026.10.01</time></p>
        </div>
      </div>
    </section>

    <section id="questions" className="scroll-mt-28 bg-[var(--surface)]">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <SectionBadge icon={<HelpCircle size={15} />} label="질문별 치료 안내" />
          <div className="mt-4"><TwoTone as="h2" lead="궁금한 것부터 " accent="읽어보세요" /></div>
          <nav aria-label="질문 주제" className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm text-primary">
            {groups.map((g) => <a key={g.id} href={`#${g.id}`} className="underline underline-offset-4">{g.name}</a>)}
          </nav>
        </div>
        <div className="mx-auto mt-12 max-w-4xl space-y-12">
          {groups.map((g) => <section key={g.id} id={g.id} className="scroll-mt-28" aria-labelledby={`${g.id}-title`}>
            <h3 id={`${g.id}-title`} className="font-serif border-b border-line pb-3 text-xl font-semibold text-ink">{g.name}</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {g.posts.map((post) => <li key={post.slug}>
                <Link href={postPath("skin", post.slug)} className="card group flex h-full flex-col p-5 transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                  <h4 className="text-[16px] font-semibold leading-relaxed text-ink group-hover:text-primary">{post.title}</h4>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{post.description}</p>
                  <span aria-hidden="true" className="mt-4 text-primary">답변 읽기 →</span>
                </Link>
              </li>)}
            </ul>
          </section>)}
        </div>
      </div>
    </section>

    <section id="devices" className="scroll-mt-28 bg-[var(--bg)]">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl text-center"><SectionBadge icon={<Flame size={15} />} label="사용 장비" /><div className="mt-4"><TwoTone as="h2" lead="색소와 피부결에 맞춘 " accent="두 가지 장비" /></div></div>
        <div className="mx-auto mt-12 grid max-w-3xl gap-5 sm:grid-cols-2">
          {DEVICES.map((d) => <div key={d.title} className="card p-6"><IconTile icon={<Scan />} /><h3 className="mt-4 text-lg font-semibold text-ink">{d.title}</h3><p className="mt-2 text-sm leading-[1.8] text-muted">{d.body}</p></div>)}
        </div>
        <p className="mx-auto mt-6 max-w-3xl text-sm leading-relaxed text-muted">점·편평사마귀·쥐젖이 고민이라면 <Link href="/skin/spot" className="font-medium text-primary underline underline-offset-4">CO2 레이저 잡티 제거 안내</Link>에서 치료와 부위별 비용을 확인하세요.</p>
      </div>
    </section>

    <section id="prices" className="scroll-mt-28 bg-[var(--surface)]">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl text-center"><SectionBadge icon={<ChartBar size={15} />} label="비용 안내" /><div className="mt-4"><TwoTone as="h2" lead="제네시스까지 " accent="포함한 비용" /></div></div>
        <div className="mx-auto mt-12 max-w-3xl space-y-6">
          <PriceTable rowLabel="시술" caption={PIGMENTATION_PRICES.name} headers={["1회", "10회"]} rows={[{ name: "피코·제네시스", price: won(PIGMENTATION_PRICES.single), price2: won(PIGMENTATION_PRICES.tenSessions) }]} note={`부가세 포함 · 10회 패키지 회당 ${won(PIGMENTATION_PRICES.perSession)}. 흑자 개별 치료 범위와 포함 여부는 상담 시 확인하세요.`} />
          <Link href={postPath("skin", "피코토닝-가격-제네시스")} className="block text-sm font-medium text-primary underline underline-offset-4">피코토닝 가격과 시술 구성에서 확인할 것 →</Link>
          <div className="card p-5">
            <h3 className="font-semibold text-ink">탄력과 턱선도 고민이라면</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">슈링크 유니버스의 300샷 비용, 30분 시술 과정과 12주 재시술 간격은 리프팅 안내에서 확인하세요.</p>
            <Link href={LIFTING_PATH} className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4">슈링크 유니버스 리프팅·비용 안내 →</Link>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-[var(--bg)]"><div className="section-padding">
      <div className="mx-auto max-w-3xl text-center"><SectionBadge icon={<ListCheck size={15} />} label="진료 과정" /><div className="mt-4"><TwoTone as="h2" lead="고민 부위부터 " accent="경과 확인까지" /></div></div>
      <ol className="mx-auto mt-12 max-w-2xl">{STEPS.map((s, i) => <NumberedStep key={s.title} index={i + 1} title={s.title} body={s.body} last={i === STEPS.length - 1} />)}</ol>
    </div></section>

    <section className="bg-[var(--surface)]"><div className="section-padding">
      <div className="mx-auto max-w-3xl text-center"><SectionBadge icon={<HelpCircle size={15} />} label="자주 묻는 질문" /><div className="mt-4"><TwoTone as="h2" lead="먼저 궁금한 " accent="네 가지" /></div></div>
      <div className="mx-auto mt-12 flex max-w-4xl flex-col gap-3">{QUESTIONS.map((q) => <QARow key={q.q} quote={q.q} answer={q.a} />)}</div>
    </div></section>

    <section className="section-padding"><div className="mx-auto max-w-3xl text-center">
      <h2 className="font-serif text-xl font-semibold text-ink">일산한의원 피부·색소 상담</h2>
      <p className="mt-4 text-sm leading-relaxed text-muted">가장 신경 쓰이는 부위와 이전 시술 이력을 알려주세요.<br />이마트 풍산점 3층에서 피부 상태와 치료 방향을 함께 살펴봅니다.</p>
      <p className="mt-4 text-sm text-muted">궁금한 점과 예약 문의는 카카오톡으로 편하게 남겨주세요.</p>
      <ConsultationActions directions className="mt-6" />
      <Link href="/skin" className="mt-6 inline-block text-sm text-primary underline underline-offset-4">피부 · 레이저 글 전체 보기</Link>
    </div></section>
    <ClinicCta />
  </>;
}
