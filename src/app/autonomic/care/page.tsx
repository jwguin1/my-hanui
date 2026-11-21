import ConsultationActions from "@/components/ConsultationActions";
import type { Metadata } from "next";
import Link from "next/link";
import DiseaseGuideLinks from "@/components/DiseaseGuideLinks";
import SectionReveal from "@/components/SectionReveal";
import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import IconTile from "@/components/ui/IconTile";
import DefinitionCard from "@/components/ui/DefinitionCard";
import NumberedStep from "@/components/ui/NumberedStep";
import FaqList from "@/components/ui/FaqList";
import CompareTable from "@/components/ui/CompareTable";
import {
  AlertTriangle,
  Ear,
  Hands,
  HeadCircuit,
  HelpCircle,
  Herb,
  ListCheck,
  Needle,
  Rotate,
  Scan,
  Stethoscope,
} from "@/components/ui/icons";
import { CLINIC } from "@/lib/clinic";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph, faqEntities } from "@/lib/schema";
import LocalBlock from "@/components/LocalBlock";
import { LOCAL_BLOCKS, localFaqEntities } from "@/lib/local-blocks";

export const metadata: Metadata = pageMetadata({
  path: "/autonomic/care",
  title: "일산 이명·어지럼·두통 | 자율신경 치료",
  description:
    "일산한의원에서 두통·어지럼·이명을 진료합니다. 편두통과 목 통증, 자세에 따른 어지럼, 이명으로 깨는 밤을 나눠 보고 침 치료와 한약 상담, 청력검사가 필요한 경우를 안내합니다.",
  routeOgImage: true,
});

const QUESTIONS = [
  {
    q: "뇌 MRI가 정상인데도 머리가 지끈거리고 속이 울렁거려요. 왜 그럴까요?",
    a: "편두통은 MRI가 정상이어도 생깁니다. 움직일 때 더 아픈지, 빛이나 소리가 유독 거슬리는지 듣고 두통 양상을 살핍니다. 일산한의원에서는 한 달 중 일상을 멈출 만큼 아팠던 날을 기준으로 침 치료나 한약의 경과를 봅니다.",
  },
  {
    q: "이석증 치료를 받고 방이 도는 건 멎었는데 아직 걸을 때 휘청해요. 또 이석증인가요?",
    a: "고개를 돌릴 때 짧게 빙빙 도는 증상이 다시 생겼는지, 걸을 때만 중심 잡기가 힘든지를 구분합니다. 이석증이 의심되면 자세검사와 이석을 제자리로 돌리는 치료를 안내합니다. 회전감이 가라앉은 뒤에는 보행과 함께 남은 목 통증·수면 불편을 진료합니다.",
  },
  {
    q: "목이 뻣뻣한 날이면 같이 어지러워요. 추나부터 받으면 될까요?",
    a: "먼저 어지럼이 오는 자세와 귀 증상, 목을 움직일 때의 통증을 따로 봅니다. 귀의 균형기관이나 혈압 문제는 목 치료와 접근이 다릅니다. 목 움직임이 제한되고 근육 압통이 뚜렷하면 그 부위의 통증을 줄이는 침·추나 치료를 상의합니다.",
  },
  {
    q: "밤에 누우면 귀에서 삐 소리가 커져서 잠이 안 와요. 무엇을 해볼 수 있나요?",
    a: "조용한 방에서 소리가 도드라질 때는 선풍기나 잔잔한 빗소리처럼 편한 배경음을 작게 틀어 보세요. 진료 때는 어느 쪽에서 들리는지, 이명 때문에 깨는지와 청력 변화를 묻습니다. 필요한 청력검사를 안내하고, 밤잠을 설치거나 목·턱이 아픈 분은 그 증상도 함께 진료합니다.",
  },
  {
    q: "두통약을 한 달에 며칠씩 먹는지 기억이 안 나요. 약 봉투를 들고 갈까요?",
    a: "네. 약 봉투와 지난달 대략 며칠 복용했는지를 가져오세요. 진통제를 자주 쓰면서 두통이 더 잦아지는 경우가 있어 약의 종류와 복용 일수를 같이 봅니다. 기존 처방약은 임의로 끊지 마시고, 진료에서 두통이 줄었는지 약을 찾는 날과 함께 비교합니다.",
  },
  {
    q: "한쪽 귀에서 심장 뛰듯 쿵쿵거리는 소리가 들려요. 흔한 이명과 같은가요?",
    a: "맥박과 박자가 맞는 소리는 ‘박동성 이명’으로, 귀와 주변 혈관을 살피는 진찰이 필요합니다. 한쪽에서 계속 들리면 이비인후과 진료를 받으세요. 청력검사나 영상검사를 이미 받으셨다면 결과를 가져오시면 남은 불편을 진료하는 데 도움이 됩니다.",
  },
];

const SYMPTOMS = [
  {
    icon: <Ear />,
    title: "이명",
    body: "삐- 하는 소리나 웅웅거림이 들립니다. 조용할 때와 밤에 더 크게 느껴지는 경우가 많습니다.",
  },
  {
    icon: <Rotate />,
    title: "어지럼",
    body: "빙글 도는 느낌, 붕 떠 있는 느낌, 순간적으로 아찔한 느낌으로 나뉩니다. 어떤 쪽인지에 따라 접근이 달라집니다.",
  },
  {
    icon: <HeadCircuit />,
    title: "두통",
    body: "조이는 두통, 한쪽이 욱신거리는 두통, 뒷목에서 올라오는 두통으로 나뉩니다.",
  },
];

/** 응급·선행 검사가 필요한 경우 — 축약하지 말 것 */
const RED_FLAGS = [
  {
    title: "한쪽 귀가 갑자기 안 들리면서 이명이 생겼다면",
    body: "돌발성 난청일 수 있어 이비인후과 진료를 먼저 받으셔야 합니다. 시기를 놓치면 회복이 어려워집니다.",
  },
  {
    title:
      "어지럼과 함께 말이 어눌하거나, 한쪽 팔다리에 힘이 빠지거나, 물체가 겹쳐 보인다면",
    body: "즉시 응급실로 가셔야 합니다.",
  },
  {
    title: "갑자기 시작된 극심한 두통이거나, 발열과 목 뻣뻣함이 함께 있다면",
    body: "즉시 응급실 진료가 필요합니다.",
  },
  {
    title: "두통의 양상이 최근 갑자기 달라졌다면",
    body: "영상 검사가 가능한 의료기관 진료를 권해드립니다.",
  },
];

const COMPARE_ROWS = [
  {
    label: "이명",
    left: "어느 귀에 들리는지, 청력이 변했는지, 밤잠에 얼마나 영향을 주는지 봅니다.",
    right: "청력검사가 필요한 분을 안내하고, 수면 불편과 함께 나타나는 목·턱 통증을 진료합니다.",
  },
  {
    label: "어지럼",
    left: "돌아누울 때 도는지, 일어설 때 눈앞이 어두운지, 걸을 때 휘청하는지 묻습니다.",
    right: "자세에 따른 혈압 변화를 보거나 귀의 균형검사를 안내합니다. 검사 후 남은 불편과 통증도 함께 진료합니다.",
  },
  {
    label: "두통",
    left: "통증 위치, 빛·소리에 예민해지는지, 목 움직임이나 진통제 복용과의 관계를 봅니다.",
    right: "두통 양상과 목·어깨 진찰에 따라 침 치료나 한약을 정하고 아팠던 날과 약을 먹은 날을 비교합니다.",
  },
];

const TREATMENTS = [
  {
    icon: <Needle />,
    title: "침 · 물리치료",
    body: "목과 어깨의 긴장을 풀어 부담을 줄입니다. 먼저 진행하는 치료입니다.",
  },
  {
    icon: <Hands />,
    title: "추나요법",
    body: "목을 돌릴 때 움직임이 제한되고 뒷목에서 통증이 올라오는 분은 근육과 관절을 진찰한 뒤 추나를 결정합니다.",
  },
  {
    icon: <Scan />,
    title: "약침",
    body: "긴장이 집중된 부위에 진행합니다. 필요하면 초음파로 확인 후 진행합니다.",
  },
  {
    icon: <Herb />,
    title: "한약 처방",
    body: "수면, 소화, 긴장 상태를 함께 보고 처방합니다.",
  },
];

const PROCESS = [
  {
    title: "문진",
    body: "언제부터, 어떤 상황에서 심해지는지 확인합니다.",
  },
  {
    title: "감별",
    body: "혈압, 보행, 목의 움직임을 증상에 맞게 살핍니다. 청력이나 귀의 균형기능을 보는 검사가 필요하면 이비인후과로 연결합니다.",
  },
  {
    title: "치료 계획",
    body: "진찰한 부위와 일상에서 가장 불편한 점에 맞춰 침·물리치료 또는 한약을 정합니다.",
  },
  {
    title: "재평가",
    body: "두통으로 약을 먹은 날, 어지럼으로 멈춰 선 횟수, 이명으로 잠을 깬 횟수를 처음과 비교합니다.",
  },
  {
    title: "종결 또는 의뢰",
    body: "좋아지면 종결하고, 필요하면 다른 의료기관을 안내드립니다.",
  },
];

const graph = buildGraph({
  path: "/autonomic/care",
  name: "이명·어지럼·두통 치료 – 일산한의원",
  description:
    "두통·어지럼·이명이 생기는 상황을 살피고, 진찰 결과에 따라 침·한약 치료와 청력검사 등 필요한 검사를 안내합니다.",
  faq: [
    ...faqEntities(QUESTIONS),
    ...localFaqEntities("/autonomic/care"),
  ],
});

export default function AutonomicCarePage() {
  return (
    <>
      <JsonLd graph={graph} />
      <PageHeader
        badge="자율신경"
        icon={<Stethoscope size={15} />}
        lead="두통·어지럼과 이명,"
        accent="언제 어떻게 시작되나요?"
        stacked
      />

      <nav aria-label="한약 진료 안내" className="border-y border-line px-6 py-5 text-center"><Link href="/herbal/tonic/autonomic" className="font-medium text-primary underline underline-offset-4">두통·어지럼의 한약 상담과 비급여 비용 보기 →</Link></nav>

      {/* ── 정의 + 지표 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl">
              <DefinitionCard
                title="진료실에서 처음 묻는 것"
                body="고개를 돌릴 때 방이 도는 분, 계단을 오르면 머리가 울리는 분, 한쪽 귀가 울려 잠드는 데 오래 걸리는 분은 진찰할 곳이 다릅니다. 처음 증상이 생겼을 때 무엇을 하고 있었는지 들려주세요. 이전에 받은 청력검사나 영상검사도 함께 살펴봅니다."
              />

            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 환자분들의 질문 ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge
                icon={<HelpCircle size={15} />}
                label="환자분들의 질문"
              />
              <div className="mt-4">
                <TwoTone as="h2" lead="진료 전에 " accent="궁금한 점" />
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-3xl">
              <FaqList items={QUESTIONS} openFirst />
              <a href={CLINIC.kakaoHref} className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">
                두통·어지럼·이명 진료 일정 카카오톡으로 문의
              </a>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 증상 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<Ear size={15} />} label="증상" />
              <div className="mt-4">
                <TwoTone as="h2" lead="이런 증상으로 " accent="오십니다" />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SYMPTOMS.map((s) => (
                <div key={s.title} className="card p-6">
                  <IconTile icon={s.icon} />
                  <h3 className="mt-4 text-[16px] font-semibold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.8] text-muted">
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 확인해주세요 ──
          응급 상황이 섞여 들어오는 증상군이라 증상 소개 바로 다음에 둔다.
          페이지 하단으로 옮기지 말 것. */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge
                icon={<AlertTriangle size={15} />}
                label="확인해주세요"
              />
              <div className="mt-4">
                <TwoTone as="h2" lead="먼저 확인이 " accent="필요한 경우" />
              </div>
            </div>

            <div className="mx-auto mt-10 flex max-w-3xl flex-col gap-4">
              {RED_FLAGS.map((r) => (
                <DefinitionCard key={r.title} title={r.title} body={r.body} />
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 치료 기준 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="치료 기준" />
              <div className="mt-4">
                <TwoTone
                  as="h2"
                  lead="같은 증상이라도 "
                  accent="치료가 다릅니다"
                />
              </div>
            </div>

            <div className="mx-auto mt-14 max-w-4xl">
              <CompareTable
                rows={COMPARE_ROWS}
                headers={["처음 살피는 점", "진료에서 정하는 일"]}
              />

              <blockquote className="mt-8 border-l-[3px] border-primary bg-card p-5 text-[15px] leading-[1.8] text-ink">
                같은 증상으로 여러 번 진료받으신 분은 이전에 가장 도움이 됐던 치료와 여전히 힘든 일을 알려주세요.
              </blockquote>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 치료 방법 ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<Needle size={15} />} label="치료 방법" />
              <div className="mt-4">
                <TwoTone as="h2" lead="어떻게 " accent="치료하나요?" />
              </div>
            </div>

            <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
              {TREATMENTS.map((t) => (
                <div key={t.title} className="card p-6">
                  <IconTile icon={t.icon} />
                  <h3 className="mt-4 text-[16px] font-semibold text-ink">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.8] text-muted">
                    {t.body}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 치료 과정 ── */}
      <section className="bg-[var(--bg)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mx-auto max-w-3xl text-center">
              <SectionBadge icon={<ListCheck size={15} />} label="치료 과정" />
              <div className="mt-4">
                <TwoTone as="h2" lead="첫 방문부터 " accent="종결까지" />
              </div>
            </div>

            <ol className="mx-auto mt-14 max-w-2xl">
              {PROCESS.map((p, i) => (
                <NumberedStep
                  key={p.title}
                  index={i + 1}
                  title={p.title}
                  body={p.body}
                  last={i === PROCESS.length - 1}
                />
              ))}
            </ol>
          </SectionReveal>
        </div>
      </section>

      <LocalBlock {...LOCAL_BLOCKS["/autonomic/care"]} />

      <nav aria-label="두통·어지럼·이명 참고 자료" className="mx-auto flex max-w-4xl flex-wrap gap-x-6 px-6 py-4 text-sm text-primary [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:underline [&_a]:underline-offset-4">
        <a href="https://nikom.or.kr/nckm/module/practiceGuide/view.do?guide_idx=171&menu_idx=14">편두통 한의표준임상진료지침</a>
        <a href="https://www.entnet.org/quality-practice/quality-products/clinical-practice-guidelines/bppv/">미국 이비인후과학회 이석증 진료지침</a>
        <a href="https://www.nidcd.nih.gov/health/tinnitus">미국 국립청각·의사소통장애연구소 이명 안내</a>
      </nav>

      {/* ── CTA ── */}
      <section className="bg-[var(--surface)]">
        <div className="section-padding">
          <SectionReveal>
            <div className="mb-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
              <Link
                href="/autonomic"
                className="text-[14px] font-medium text-primary transition-colors duration-200 hover:text-tan"
              >
                자율신경 관련 연구 보기 &rarr;
              </Link>
              <Link
                href="/internal/dyspepsia"
                className="text-[14px] font-medium text-primary transition-colors duration-200 hover:text-tan"
              >
                소화 문제도 함께 있으신가요? &rarr;
              </Link>
            </div>
            <ConsultationActions className="mx-auto max-w-3xl" />
          </SectionReveal>
        </div>
      </section>

    <DiseaseGuideLinks group="수면·신경·마음" />
    </>
  );
}
