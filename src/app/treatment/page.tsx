import type { Metadata } from "next";
import SectionReveal from "@/components/SectionReveal";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({
  path: "/treatment",
  title: "진료 안내 – 한약, 침, 추나, 약침",
  description:
    "일산한의원 진료 안내. 한약처방, 침치료, 추나요법, 약침치료, 뜸, 부항. 건강보험 적용 진료. 초음파 정밀 진단으로 정확한 치료를 제공합니다.",
  ogTitle: "진료 안내 – 일산한의원",
  ogDescription:
    "한약처방, 침치료, 추나요법, 약침치료. 건강보험 적용, 초음파 정밀 진단.",
});

const treatments = [
  {
    title: "한약 처방",
    icon: "🍃",
    description:
      "개인의 체질과 증상에 따라 1:1 맞춤 한약을 처방합니다. 면역력 강화, 소화기 개선, 만성 피로 회복 등 다양한 증상에 효과적입니다.",
    details: ["체질 분석 및 맞춤 처방", "탕약 · 환약 · 산제", "보험 한약 가능"],
  },
  {
    title: "침 치료",
    icon: "📍",
    description:
      "경락의 흐름을 조절하여 통증을 완화하고 신체 기능을 개선합니다. 근골격계 질환, 내과 질환, 신경계 질환 등 폭넓게 적용됩니다.",
    details: ["체침 · 전침 · 이침", "급만성 통증 치료", "자율신경 조절"],
  },
  {
    title: "추나 요법",
    icon: "🤲",
    description:
      "한의사가 손과 신체를 이용하여 틀어진 뼈와 관절, 근육을 바로잡습니다. 체형 교정, 디스크, 관절 통증에 효과적입니다.",
    details: ["척추 · 골반 교정", "자세 불균형 개선", "건강보험 적용"],
  },
  {
    title: "약침 치료",
    icon: "💧",
    description:
      "한약 성분을 정제하여 경혈에 직접 주입합니다. 침 치료와 한약 치료의 효과를 동시에 얻을 수 있습니다.",
    details: ["봉약침 · 산삼약침", "염증 완화", "면역력 강화"],
  },
  {
    title: "뜸 치료",
    icon: "🔥",
    description:
      "쑥을 태워 경혈을 온열 자극합니다. 혈액 순환을 촉진하고 냉증, 소화불량, 만성 피로 등에 도움을 줍니다.",
    details: ["직접구 · 간접구", "온열 치료", "기혈 순환 개선"],
  },
  {
    title: "부항 치료",
    icon: "⭕",
    description:
      "음압을 이용하여 어혈과 노폐물을 제거하고 근육의 긴장을 풀어줍니다.",
    details: ["건식 · 습식 부항", "근육 이완", "혈액 순환 촉진"],
  },
];

export default function TreatmentPage() {
  return (
    <>
      {/* Hero */}
      <section
        className="flex items-end pb-16 pt-32 md:pb-20 md:pt-40"
        style={{
          background:
            "linear-gradient(180deg, #151515 0%, var(--color-bg) 100%)",
        }}
      >
        <div className="section-padding w-full !py-0 text-center">
          <p className="fade-in section-label">Treatment</p>
          <h1
            className="fade-in heading-xl mt-4"
            style={{ animationDelay: "0.2s" }}
          >
            진료 안내
          </h1>
          <div
            className="fade-in gold-divider mx-auto mt-6"
            style={{ animationDelay: "0.35s" }}
          />
          <p
            className="fade-in body-text mx-auto mt-6 max-w-md"
            style={{ animationDelay: "0.45s" }}
          >
            환자의 체질과 상태를 정밀하게 파악하여 가장 적합한 치료를
            제공합니다.
          </p>
        </div>
      </section>

      {/* Treatment Cards */}
      <section className="section-padding space-y-6">
        {treatments.map((t) => (
          <SectionReveal key={t.title}>
            <div className="card grid gap-8 p-7 md:grid-cols-[auto_1fr] md:p-10">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-bg text-4xl md:h-28 md:w-28">
                {t.icon}
              </div>
              <div>
                <h3 className="font-serif text-[1.1rem] font-semibold text-text">
                  {t.title}
                </h3>
                <p className="body-text mt-3">{t.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {t.details.map((d) => (
                    <span
                      key={d}
                      className="rounded-md border border-border px-3 py-1 text-[0.75rem] text-text-muted"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SectionReveal>
        ))}
      </section>

      {/* CTA */}
      <section className="section-padding text-center">
        <SectionReveal>
          <h2 className="heading-md">궁금한 점이 있으신가요?</h2>
          <p className="body-text mt-3">
            네이버 플레이스 또는 카카오톡으로 편하게 문의해 주세요.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://naver.me/IItclnGB"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              네이버 플레이스
            </a>
          </div>
        </SectionReveal>
      </section>
    </>
  );
}
