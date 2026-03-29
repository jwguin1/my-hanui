import SectionReveal from "@/components/SectionReveal";

export const metadata = {
  title: "일산한의원 | 일산한의원",
};

export default function AboutPage() {
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
          <p className="fade-in section-label">About</p>
          <h1
            className="fade-in heading-xl mt-4"
            style={{ animationDelay: "0.2s" }}
          >
            일산한의원
          </h1>
          <p
            className="fade-in mt-4 text-[0.95rem] text-text-muted"
            style={{ animationDelay: "0.3s" }}
          >
            고양시 일산에서 가장 많은 환자들에게 사랑받는
          </p>
          <div
            className="fade-in gold-divider mx-auto mt-6"
            style={{ animationDelay: "0.45s" }}
          />
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label">Philosophy</p>
            <h2 className="heading-lg mt-4">진료 철학</h2>
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
                대학병원급 초음파와 혈액검사 장비를 더해 상태를 객관적으로
                파악합니다. 명확한 데이터를 바탕으로, 수술 없이 일상을 지킬 수
                있는 정교한 비수술 치료를 제공합니다.
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
