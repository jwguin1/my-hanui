import Link from "next/link";

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

        <div className="mt-6 flex flex-wrap items-center justify-center gap-5">
          <Link
            href="/about"
            className="text-[0.82rem] text-text-muted transition-colors duration-200 hover:text-accent"
          >
            일산한의원
          </Link>
          <Link
            href="/column"
            className="text-[0.82rem] text-text-muted transition-colors duration-200 hover:text-accent"
          >
            의학칼럼
          </Link>
          <Link
            href="/doctor"
            className="text-[0.82rem] text-text-muted transition-colors duration-200 hover:text-accent"
          >
            의료진
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
            href="tel:031-976-7706"
            className="text-[0.82rem] text-text-muted transition-colors duration-200 hover:text-accent"
          >
            031-976-7706
          </a>
        </div>

        <p className="mt-4 text-[0.78rem] text-text-muted">
          경기 고양시 일산동구 무궁화로 237, 3층 · 경의중앙선 풍산역 2번 출구 도보
          1분
        </p>

        <p className="mt-6 text-[0.75rem] text-text-muted">
          © {new Date().getFullYear()} 일산한의원. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
