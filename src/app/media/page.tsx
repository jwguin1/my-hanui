import type { Metadata } from "next";
import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import { fetchLatestVideos } from "@/lib/youtube";
import { pageMetadata } from "@/lib/page-metadata";
import JsonLd from "@/components/JsonLd";
import { buildGraph } from "@/lib/schema";

import PageHeader from "@/components/ui/PageHeader";
import { PlayerPlay } from "@/components/ui/icons";
import VideoEmbed from "@/components/VideoEmbed";
import { INTERNAL_MEDICINE_PAPERS, SHOULDER_LECTURE } from "@/lib/doctor-profile";

export const metadata: Metadata = pageMetadata({
  path: "/media",
  title: "건강 영상·의료진 학술활동",
  description:
    "일산한의원 통증 진료 영상, 장경진 원장의 어깨 통증 학술대회 발표, 오서혜 원장이 참여한 어지럼·두통 논문을 원문과 함께 소개합니다.",
  ogTitle: "건강 영상·의료진 학술활동 | 일산한의원",
});

const graph = buildGraph({
  path: "/media",
  name: "건강 영상·의료진 학술활동 | 일산한의원",
  description:
    "통증 진료 영상과 일산한의원 의료진이 참여한 강연·논문을 소개합니다.",
});

export default async function MediaPage() {
  const videos = await fetchLatestVideos(20);
  return (
    <>
      <JsonLd graph={graph} />
      {/* Hero */}
      <PageHeader
        badge="영상·학술활동"
        icon={<PlayerPlay size={15} />}
        lead="영상으로 만나는"
        accent="일산한의원"
        stacked
        description="통증 진료 영상과 의료진이 직접 참여한 연구·강연"
      />

      {/* Videos */}
      <section className="section-padding" aria-labelledby="video-list-title">
        <h2 id="video-list-title" className="heading-md mb-4">통증과 치료를 살펴보는 건강 영상</h2>
        <p className="mb-8 max-w-3xl text-base leading-7 text-muted">아픈 부위와 비슷한 주제의 영상을 골라 보세요. 진료 전에는 통증이 시작된 시점과 불편한 움직임을 정리해 두면 상담에 도움이 됩니다. 영상과 함께 <Link href="/pain" className="text-primary underline underline-offset-4">부위별 통증 질문</Link>과 <Link href="/pricing#pain" className="text-primary underline underline-offset-4">침·추나·약침 비용 안내</Link>도 확인하실 수 있습니다.</p>
        <div className="grid gap-5 md:grid-cols-2">
          {videos.map((v, i) => (
              <div key={v.id} className="card overflow-hidden transition-transform duration-200 hover:-translate-y-1">
                <VideoEmbed id={v.id} title={v.title} priority={i === 0} />
                <div className="p-5">
                  <h3 className="font-serif text-[1.05rem] font-semibold leading-snug text-text">
                    {v.title}
                  </h3>
                </div>
              </div>
          ))}
        </div>
      </section>

      <section id="academic-activity" aria-labelledby="academic-activity-title" className="section-padding scroll-mt-28">
        <h2 id="academic-activity-title" className="heading-md">의료진이 참여한 강연과 논문</h2>
        <div className="mt-6 grid items-start gap-6 md:grid-cols-2">
          <article className="card p-5">
            <h3 className="text-lg font-semibold">{SHOULDER_LECTURE.title}</h3>
            <p className="mt-3 text-base leading-7">{SHOULDER_LECTURE.description}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 text-primary underline underline-offset-4">
              <a href={SHOULDER_LECTURE.href} className="inline-flex min-h-11 items-center">민족의학신문 강연 보도</a>
              <Link href="/doctor#jang-kyungjin" className="inline-flex min-h-11 items-center">장경진 원장 소개</Link>
              <Link href={SHOULDER_LECTURE.careHref} className="inline-flex min-h-11 items-center">어깨 통증 진료</Link>
            </div>
          </article>
          <article className="card p-5">
            <h3 className="text-lg font-semibold">어지럼·두통에 관한 오서혜 원장의 연구</h3>
            <ul className="divide-y divide-line">
              {INTERNAL_MEDICINE_PAPERS.map(paper => <li key={paper.href} className="py-3">
                <a href={paper.href} className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4">{paper.title}</a>
                <p className="text-base leading-7">{paper.description}</p>
                <p className="mt-1 text-sm text-muted">{paper.credit} · {paper.citation}</p>
              </li>)}
            </ul>
            <div className="flex flex-wrap gap-x-4 text-primary underline underline-offset-4">
              <Link href="/doctor#oh-seohye" className="inline-flex min-h-11 items-center">오서혜 원장 소개</Link>
              <Link href="/herbal/tonic/autonomic" className="inline-flex min-h-11 items-center">두통·어지럼 진료</Link>
            </div>
          </article>
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
