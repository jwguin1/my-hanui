import type { Metadata } from "next";
import SectionReveal from "@/components/SectionReveal";
import PageHeroBanner from "@/components/PageHeroBanner";
import { pageMetadata } from "@/lib/page-metadata";
import { CAROUSEL_TARGETS } from "@/lib/carousel-targets";
import JsonLd from "@/components/JsonLd";
import { buildGraph } from "@/lib/schema";

import PageHeader from "@/components/ui/PageHeader";
import SectionBadge from "@/components/ui/SectionBadge";
import TwoTone from "@/components/ui/TwoTone";
import { Quote, Users } from "@/components/ui/icons";
import { CLINIC } from "@/lib/clinic";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: CAROUSEL_TARGETS.about.title,
  description:
    "건강보험 우선 진료, 근골격계 초음파 진단, 비수술 치료. 과잉 진료 없이 정직하게, 환자 한 분 한 분의 이야기를 깊이 듣는 일산한의원입니다.",
  ogDescription:
    "건강보험 우선 진료, 근골격계 초음파 진단, 비수술 치료. 고양시 일산 이마트 풍산점 3층.",
});

const graph = buildGraph({
  path: "/about",
  name: `${CAROUSEL_TARGETS.about.title} | 일산한의원`,
  description:
    "건강보험 우선 진료, 근골격계 초음파 진단, 비수술 치료. 과잉 진료 없이 정직하게, 환자 한 분 한 분의 이야기를 깊이 듣는 일산한의원입니다.",
  image: CAROUSEL_TARGETS.about.hero.src,
});

export default function AboutPage() {
  return (
    <>
      <JsonLd graph={graph} />
      {/* Hero */}
      <PageHeader
        badge="소개"
        icon={<Users size={15} />}
        lead="일산"
        accent="한의원"
        description="고양시 일산에서 오래 진료해 온"
      />

      <PageHeroBanner page="about" />

      {/* Philosophy */}
      <section className="section-padding">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionBadge icon={<Quote size={15} />} label="우리의 약속" />
            <div className="mt-4">
              <TwoTone as="h2" lead="진료 " accent="철학" />
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-3xl space-y-12">
            {/* 1 */}
            <div>
              <p className="font-serif text-[1.05rem] font-semibold leading-relaxed text-text">
                &ldquo;몸이 아파 찾아오신 걸음에
                <br className="hidden md:block" />
                진료비라는 무거운 짐을 얹어드리지 않겠습니다.&rdquo;
              </p>
              <div className="gold-divider mt-5" />
              <p className="body-text mt-5" style={{ lineHeight: 2 }}>
                일산한의원은 가벼운 증상에 무리한 치료를 권하지 않습니다.
                누구나 마음 편히 문을 두드릴 수 있도록 건강보험 진료를 우선하며,
                환자분들이 오직 온전한 회복에만 집중할 수 있는 정직한 공간이
                되겠습니다.
              </p>
            </div>

            {/* 2 */}
            <div>
              <p className="font-serif text-[1.05rem] font-semibold leading-relaxed text-text">
                &ldquo;수술의 두려움을 덜어내는
                <br className="hidden md:block" />
                객관적이고 정교한 비수술 치료&rdquo;
              </p>
              <div className="gold-divider mt-5" />
              <p className="body-text mt-5" style={{ lineHeight: 2 }}>
                주관적인 감에만 의존하지 않습니다. 정밀한 한의학적 진단에
                {/* 모델명·대수는 clinic.ts 가 정본이다. 여기에 직접 적지 않는다 */}
                근골격계 초음파 {CLINIC.ultrasound.count}대와 혈액검사 장비를
                더해 상태를 객관적으로 파악합니다. 명확한 데이터를 바탕으로,
                수술 없이 일상을 지킬 수 있는 정교한 비수술 치료를 제공합니다.
              </p>
              {/* 장비 상세는 원장 확정 문안 그대로. 「고사양」·「프리미엄」 같은
                  제조사 마케팅 문구는 쓰지 않는다 — 인용하면 최상급 표현이 된다. */}
              <p className="mt-3 text-[0.85rem] leading-relaxed text-muted">
                {CLINIC.ultrasound.detail}
              </p>
            </div>

            {/* 3 */}
            <div>
              <p className="font-serif text-[1.05rem] font-semibold leading-relaxed text-text">
                &ldquo;작은 목소리까지 깊이 듣고,
                <br className="hidden md:block" />
                내 몸에 꼭 맞는 해답을 찾는 동행&rdquo;
              </p>
              <div className="gold-divider mt-5" />
              <p className="body-text mt-5" style={{ lineHeight: 2 }}>
                눈앞의 증상만을 쫓지 않고, 환자 한 분 한 분의 이야기를 충분히
                듣겠습니다. 아픔의 근본적인 원인을 살피고 깊이 공감하며, 내 몸에
                가장 알맞은 해결책을 함께 찾아가는 든든한 동반자가 되겠습니다.
              </p>
            </div>
          </div>
        </SectionReveal>
      </section>

    </>
  );
}
