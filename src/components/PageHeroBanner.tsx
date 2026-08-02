import {
  CAROUSEL_TARGETS,
  type CarouselTargetKey,
} from "@/lib/carousel-targets";

/**
 * 네이버 하위링크 카드용 대표이미지.
 *
 * 지켜야 할 제약 세 가지 — 바꾸기 전에 scripts/verify-carousel.mjs 를 볼 것:
 *   1. next/image 가 아니라 일반 <img>. /_next/image?url=... 로 변환되면
 *      네이버가 대표이미지로 잡아내는 확률이 떨어진다.
 *   2. loading="lazy" 를 붙이지 않는다. 본문 최상단 이미지다.
 *   3. 페이지 안에서 렌더 크기가 가장 큰 이미지여야 한다(680px).
 *      각 페이지의 카드 썸네일은 360px 이하로 유지할 것.
 */
export default function PageHeroBanner({ page }: { page: CarouselTargetKey }) {
  const { hero } = CAROUSEL_TARGETS[page];

  return (
    <div className="section-padding !py-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={hero.src}
        alt={hero.alt}
        width={1080}
        height={1080}
        fetchPriority="high"
        decoding="async"
        className="mx-auto block w-full max-w-[680px] rounded-2xl border border-line"
      />
    </div>
  );
}
