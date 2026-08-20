import Link from "next/link";
import { CAROUSEL_ORDER, CAROUSEL_TARGETS } from "@/lib/carousel-targets";
import { CLINIC, CLINIC_ADDRESS_STREET } from "@/lib/clinic";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1100px] px-6 py-12 text-center">
        <p className="font-serif text-[1.1rem] font-bold text-text">
          일산한의원
        </p>
        <p className="mt-1 text-[0.82rem] text-text-muted">
          이마트 풍산점 3층
        </p>

        {/* 사이트맵 — 네이버 하위링크 카드의 라벨 후보.
            네비는 폭 제약이 있어 짧게 걸고, 여기는 title 과 완전히 같은
            전체 문구로 건다. 단일 소스는 carousel-targets.ts. */}
        <nav
          aria-label="사이트맵"
          className="mx-auto mt-8 grid max-w-2xl gap-x-8 gap-y-2.5 text-left sm:grid-cols-2"
        >
          {CAROUSEL_ORDER.map((key) => {
            const t = CAROUSEL_TARGETS[key];
            return (
              <Link
                key={t.path}
                href={t.path}
                className="text-[0.82rem] text-text-muted transition-colors duration-200 hover:text-accent"
              >
                {t.title}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
          {/* /about · /doctor 는 위 사이트맵으로 옮겼다 — 같은 URL 에
              "일산한의원" 같은 다른 앵커가 남으면 라벨 신호가 갈린다 */}
          <Link
            href="/column"
            className="text-[0.82rem] text-text-muted transition-colors duration-200 hover:text-accent"
          >
            의학칼럼
          </Link>
          <Link
            href="/blog"
            className="text-[0.82rem] text-text-muted transition-colors duration-200 hover:text-accent"
          >
            블로그
          </Link>
          <a
            href="https://diet.ilsanhan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.82rem] text-text-muted transition-colors duration-200 hover:text-accent"
          >
            일산감비환
          </a>
          <Link
            href="https://naver.me/IItclnGB"
            target="_blank"
            className="text-[0.82rem] text-text-muted transition-colors duration-200 hover:text-accent"
          >
            네이버 플레이스
          </Link>
          <a
            href={CLINIC.telHref}
            className="text-[0.82rem] text-text-muted transition-colors duration-200 hover:text-accent"
          >
            {CLINIC.tel}
          </a>
        </div>

        {/* NAP 표기는 lib/clinic.ts 가 정본이다 (네이버 플레이스 등록 정보 기준).
            여기서 문자열을 직접 쓰면 사이트 안에서 주소가 갈린다. */}
        <p className="mt-4 text-[0.78rem] text-text-muted">
          {CLINIC_ADDRESS_STREET}, {CLINIC.building} · {CLINIC.transit}
        </p>

        <p className="mt-6 text-[0.75rem] text-text-muted">
          © {new Date().getFullYear()} 일산한의원. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
