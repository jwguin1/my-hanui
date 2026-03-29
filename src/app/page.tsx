import Link from "next/link";
import SectionReveal from "@/components/SectionReveal";
import { fetchBlogPosts } from "@/lib/blog";

export default async function Home() {
  const posts = (await fetchBlogPosts()).slice(0, 3);
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex min-h-[70vh] items-end justify-center overflow-hidden">
        <div className="absolute inset-0 bg-hero-overlay" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(14,14,14,0.7) 70%, #0e0e0e 100%)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-[1100px] px-6 pb-20 text-center">
          <p
            className="fade-in text-[0.85rem] text-text-muted"
            style={{ letterSpacing: "0.15em" }}
          >
            일산한의원
          </p>
          <p
            className="fade-in mt-3 text-[0.95rem] text-accent"
            style={{ animationDelay: "0.15s", letterSpacing: "0.1em" }}
          >
            매 순간 최선을 다해 진료합니다
          </p>
          <h1
            className="fade-in heading-xl mt-5"
            style={{ animationDelay: "0.3s" }}
          >
            몸과 마음이
            <br />
            편안해지는 곳
          </h1>
          <div
            className="fade-in gold-divider mx-auto mt-8"
            style={{ animationDelay: "0.45s" }}
          />
          <p
            className="fade-in mt-6 text-[1rem] text-text-muted"
            style={{ animationDelay: "0.55s" }}
          >
            이마트 풍산점 3층 · 풍산역 도보 1분
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <div
            className="h-12 w-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--color-accent), transparent)",
              animation: "scrollDown 2s infinite",
            }}
          />
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="section-padding">
        <SectionReveal>
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-label">Philosophy</p>
            <h2 className="heading-lg mt-4">진료 철학</h2>
          </div>

          <div className="mx-auto mt-14 max-w-3xl space-y-10">
            <div>
              <p className="font-serif text-[1.05rem] font-semibold leading-relaxed text-text">
                &ldquo;진료비라는 무거운 짐을 얹어드리지 않겠습니다.&rdquo;
              </p>
              <p className="body-text mt-3" style={{ lineHeight: 2 }}>
                건강보험 진료를 우선하며, 오직 온전한 회복에만 집중할 수 있는
                정직한 공간이 되겠습니다.
              </p>
            </div>
            <div>
              <p className="font-serif text-[1.05rem] font-semibold leading-relaxed text-text">
                &ldquo;객관적이고 정교한 비수술 치료&rdquo;
              </p>
              <p className="body-text mt-3" style={{ lineHeight: 2 }}>
                대학병원급 초음파와 혈액검사 장비로 상태를 객관적으로 파악하고,
                수술 없이 일상을 지킬 수 있는 치료를 제공합니다.
              </p>
            </div>
            <div>
              <p className="font-serif text-[1.05rem] font-semibold leading-relaxed text-text">
                &ldquo;내 몸에 꼭 맞는 해답을 찾는 동행&rdquo;
              </p>
              <p className="body-text mt-3" style={{ lineHeight: 2 }}>
                아픔의 근본적인 원인을 살피고 깊이 공감하며, 함께 해결책을
                찾아가는 든든한 동반자가 되겠습니다.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link href="/about" className="btn-ghost">
              자세히 보기
            </Link>
          </div>
        </SectionReveal>
      </section>

      {/* ── Column (Blog) ── */}
      {posts.length > 0 && (
        <section className="section-padding !pt-8">
          <SectionReveal>
            <p className="section-label text-center">Column</p>
            <h2 className="heading-lg mt-4 text-center">의학칼럼</h2>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <a
                  key={i}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card group flex flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1"
                >
                  {post.thumbnail ? (
                    <div className="relative aspect-square overflow-hidden bg-bg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-square items-center justify-center bg-bg">
                      <span className="text-2xl">📝</span>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-serif text-[1rem] font-semibold leading-snug text-text line-clamp-2 group-hover:text-accent transition-colors duration-200">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-[0.82rem] leading-relaxed text-text-muted line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link href="/column" className="btn-ghost">
                칼럼 더보기
              </Link>
            </div>
          </SectionReveal>
        </section>
      )}

      {/* ── YouTube ── */}
      <section className="section-padding !pt-8">
        <SectionReveal>
          <p className="section-label text-center">YouTube</p>
          <h2 className="heading-lg mt-4 text-center">유튜브</h2>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { id: "LVCKZ2Ou1fE", title: "발바닥 통증의 진짜 해법! 족저근막염 치료" },
              { id: "kQ0PtqhoqEY", title: "아킬레스건 통증! 꼭 치료해야 하는 이유" },
              { id: "BI2kzHjt-ko", title: "무릎 통증 비싼 연골주사 말고 진짜 치료 방법" },
            ].map((v) => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="card group overflow-hidden transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="relative aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${v.id}`}
                    title={v.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full pointer-events-none"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-[1rem] font-semibold leading-snug text-text group-hover:text-accent transition-colors duration-200">
                    {v.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-8">
            <Link href="/media" className="btn-ghost">
              영상 더보기
            </Link>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://pf.kakao.com/_eXXun"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#FEE500] px-7 py-3 text-[0.9rem] font-semibold text-[#3C1E1E] transition-opacity hover:opacity-90"
              >
                💬 카카오톡 상담
              </a>
              <a
                href="https://naver.me/IItclnGB"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#03C75A] px-7 py-3 text-[0.9rem] font-semibold text-white transition-opacity hover:opacity-90"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.27 10.6L6.44 1H1v18h5.73V9.4L13.56 19H19V1h-5.73z" />
                </svg>
                네이버 플레이스 보기
              </a>
            </div>
          </div>
        </SectionReveal>
      </section>

      {/* ── Hours & Contact Summary ── */}
      <section className="section-padding !pt-8">
        <SectionReveal>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="section-label">Hours</p>
              <h2 className="heading-lg mt-4">진료시간</h2>
              <ul className="mt-8 space-y-3 text-[0.9rem]">
                <li className="flex justify-between border-b border-border pb-3">
                  <span className="text-text">월 – 금</span>
                  <span className="text-text">10:00 – 20:00</span>
                </li>
                <li className="flex justify-between border-b border-border pb-3">
                  <span className="text-text">토 · 일</span>
                  <span className="text-text">10:00 – 16:00</span>
                </li>
                <li className="flex justify-between border-b border-border pb-3">
                  <span className="text-text-muted">점심시간 (평일)</span>
                  <span className="text-text-muted">13:00 – 14:00</span>
                </li>
              </ul>
              <p className="mt-4 text-[0.82rem] text-accent">
                주말·공휴일은 점심시간 없이 진료합니다
              </p>
              <p className="mt-1 text-[0.82rem] text-text-muted">
                매달 2·4번째 수요일 휴무 (이마트 풍산점 휴업일)
              </p>
            </div>

            <div>
              <p className="section-label">Contact</p>
              <h2 className="heading-lg mt-4">오시는 길</h2>
              <div className="mt-8 space-y-5">
                <div>
                  <p className="text-[0.8rem] text-accent">주소</p>
                  <p className="mt-1 text-text">
                    경기 고양시 일산동구 무궁화로 237
                  </p>
                  <p className="text-text">이마트 풍산점 3층</p>
                </div>
                <div>
                  <p className="text-[0.8rem] text-accent">전화</p>
                  <a
                    href="tel:031-976-7706"
                    className="mt-1 block text-[1.1rem] font-semibold text-text transition-colors hover:text-accent"
                  >
                    031-976-7706
                  </a>
                </div>
                <div>
                  <p className="text-[0.8rem] text-accent">교통</p>
                  <p className="mt-1 text-[0.9rem] text-text">
                    경의중앙선 풍산역 2번 출구 도보 1분
                  </p>
                </div>
                <div>
                  <p className="text-[0.8rem] text-accent">주차</p>
                  <p className="mt-1 text-[0.9rem] text-text-muted">
                    이마트 4·5·6·7층 주차장 · 무료주차 3시간
                  </p>
                </div>
              </div>
              <Link href="/contact" className="btn-primary mt-8 inline-block">
                자세한 안내 →
              </Link>
            </div>
          </div>
        </SectionReveal>
      </section>
    </>
  );
}
