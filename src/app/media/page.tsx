import type { Metadata } from "next";
import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import { fetchLatestVideos } from "@/lib/youtube";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph } from "@/lib/schema";

import PageHeader from "@/components/ui/PageHeader";
import { PlayerPlay } from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  path: "/media",
  title: "유튜브 – 건강 정보 영상",
  description:
    "일산한의원 유튜브 채널. 족저근막염, 아킬레스건, 무릎통증, 허리디스크, 오십견 등 통증 치료와 건강 정보를 영상으로 전합니다.",
  ogTitle: "유튜브 – 일산한의원 건강 정보 영상",
  ogDescription: "통증 치료와 건강 정보를 영상으로 쉽게 전합니다.",
});

const graph = buildGraph({
  path: "/media",
  name: "유튜브 – 건강 정보 영상 | 일산한의원",
  description:
    "일산한의원 유튜브 채널. 족저근막염, 아킬레스건, 무릎통증, 허리디스크, 오십견 등 통증 치료와 건강 정보를 영상으로 전합니다.",
});

export default async function MediaPage() {
  const videos = await fetchLatestVideos(20);
  return (
    <>
      <JsonLd graph={graph} />
      {/* Hero */}
      <PageHeader
        badge="영상"
        icon={<PlayerPlay size={15} />}
        lead="영상으로 만나는"
        accent="일산한의원"
        stacked
        description="일산한의원이 전하는 한의학 이야기와 건강 정보"
      />

      {/* Videos */}
      <section className="section-padding" aria-labelledby="video-list-title">
        <h2 id="video-list-title" className="heading-md mb-4">통증과 치료를 살펴보는 건강 영상</h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-muted">아픈 부위와 비슷한 주제의 영상을 골라 보세요. 진료 전에는 통증이 시작된 시점과 불편한 움직임을 정리해 두면 상담에 도움이 됩니다. 영상과 함께 <Link href="/pain" className="text-primary underline underline-offset-4">부위별 통증 질문</Link>과 <Link href="/pricing#pain" className="text-primary underline underline-offset-4">침·추나·약침 비용 안내</Link>도 확인하실 수 있습니다.</p>
        <div className="grid gap-5 md:grid-cols-2">
          {videos.map((v, i) => (
            <SectionReveal key={i}>
              <div className="card overflow-hidden transition-transform duration-200 hover:-translate-y-1">
                <div className="relative aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-[1.05rem] font-semibold leading-snug text-text">
                    {v.title}
                  </h3>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </section>

      {/* YouTube CTA */}
      <section className="section-padding text-center">
        <SectionReveal>
          <h2 className="heading-md">더 많은 영상이 궁금하시다면</h2>
          <a
            href="https://www.youtube.com/@%EC%9D%BC%EC%82%B0%ED%95%9C%EC%9D%98%EC%9B%90"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-8"
          >
            유튜브 채널 바로가기
          </a>
        </SectionReveal>
      </section>
    </>
  );
}
