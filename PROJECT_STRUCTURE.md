# 일산한의원 홈페이지 — 프로젝트 구조

> 클로드(Claude)에게 이 프로젝트를 설명하기 위한 구조 문서.
> 작성 기준일: 2026-05-18

---

## 1. 한 줄 요약

**Next.js 16(App Router) 기반의 일산한의원(이마트 풍산점) 홍보 + 의학 콘텐츠 홈페이지.**
마크다운 파일을 콘텐츠 소스로 쓰는 자체 블로그 시스템과, 네이버 블로그 RSS·유튜브 연동을 가진 정적/ISR 사이트.

- 운영 도메인: `https://www.ilsanhan.com`
- 패키지명: `my-hanui` (v0.1.0)

---

## 2. 기술 스택

| 항목 | 사용 |
|------|------|
| 프레임워크 | Next.js `^16.2.1` (App Router, RSC) |
| 언어 | TypeScript `^5`, React `^19` |
| 스타일 | Tailwind CSS `^4` (`@tailwindcss/postcss`), `src/app/globals.css` |
| 마크다운 | `gray-matter`(프론트매터 파싱) + `react-markdown`(렌더링) |
| 폰트 | Noto Serif KR (로컬 woff2, `next/font/local`) + Pretendard (CDN) |
| 데이터 소스 | 로컬 `.md` 파일, 네이버 블로그 RSS, YouTube Data API |
| 배포 | (정적/ISR 빌드 — `next build`) |

---

## 3. 디렉터리 구조

```
my-hanui/
├── content/                  # 콘텐츠 소스 (마크다운) — 사이트 글의 원천
│   ├── blog/                 # 미분류/공지 글 (welcome.md 등)
│   ├── pain/                 # 통증 카테고리 글
│   ├── diet/                 # 다이어트 카테고리 글
│   ├── autonomic/            # 자율신경 카테고리 글
│   ├── skin/                 # 피부 카테고리 글
│   └── health-info/          # (논문 요약 원자료 — 라우팅되지 않음)
├── public/
│   ├── blog-images/{slug}/   # API로 업로드된 글의 이미지 (img-1.png, thumbnail.*)
│   ├── images/               # 의료진 사진 등 정적 이미지
│   └── fonts/                # NotoSerifKR woff2
├── src/
│   ├── app/                  # Next.js App Router (라우트 = 폴더)
│   ├── components/           # 공용 UI 컴포넌트
│   └── lib/                  # 데이터 로직 (blog, blog-local, youtube)
├── next.config.ts
├── package.json
└── PROJECT_STRUCTURE.md      # (이 문서)
```

---

## 4. 라우팅 맵 (`src/app/`)

| 경로 | 파일 | 역할 |
|------|------|------|
| `/` | `page.tsx` | **홈페이지** (아래 5장 참고) |
| `/about` | `about/page.tsx` | 한의원 소개 |
| `/doctor` | `doctor/page.tsx` | 의료진 6인 소개 (`DoctorGrid`) |
| `/treatment` | `treatment/page.tsx` | 진료/치료 안내 |
| `/contact` | `contact/page.tsx` | 오시는 길 / 진료시간 |
| `/pain` | `pain/page.tsx` | 통증 카테고리 글 목록 (`CategoryListPage`) |
| `/pain/[slug]` | `pain/[slug]/page.tsx` | 통증 글 상세 (`CategoryPostPage`) |
| `/diet`, `/diet/[slug]` | 동일 패턴 | 다이어트 (목록에 `diet.ilsanhan.com` 전문 사이트 배너 포함) |
| `/autonomic`, `/autonomic/[slug]` | 동일 패턴 | 자율신경 |
| `/skin`, `/skin/[slug]` | 동일 패턴 | 피부 |
| `/blog` | `blog/page.tsx` | 전체 글 아카이브 |
| `/blog/[slug]` | `blog/[slug]/page.tsx` | 글 상세. **카테고리 글이면 `/{category}/{slug}`로 308 영구 리다이렉트**(정규화) |
| `/column` | `column/page.tsx` | 네이버 블로그 RSS 칼럼 목록 (외부 링크) |
| `/media` | `media/page.tsx` | 유튜브 영상 목록 |
| `/api/publish-blog` | `api/publish-blog/route.ts` | 글 발행 API (POST, 7장 참고) |
| `/sitemap.xml` | `sitemap.ts` | 동적 사이트맵 (정적 + 카테고리 + 전체 글) |
| `/robots.txt` | `robots.ts` | 전체 허용 + 사이트맵 링크 |
| `/rss.xml` | `rss.xml/route.ts` | RSS 피드 (로컬 글 기반) |

- 카테고리 상세는 `revalidate = 60`, `dynamicParams = true` (ISR + 신규 슬러그 온디맨드).
- 레이아웃: `src/app/layout.tsx` — `Navigation` + `<main>` + `Footer` + `KakaoButton`, 전역 메타데이터/JSON-LD(`MedicalClinic`) 주입.

---

## 5. 홈페이지(`/`) 섹션 구성

`src/app/page.tsx` — 위에서 아래로 단일 스크롤 페이지:

1. **Hero** — "몸과 마음이 편안해지는 곳" / 위치 한 줄
2. **Trust(신뢰의 지표)** — 통계 5종 (`TRUST_STATS` 상수): 연간 내원 65,700명 / 시술 18,250건 / 다이어트 처방 8,000건+ / 6인 협진 / 야간진료 ~20:00
3. **Why Ilsanhan(다른 이유)** — ① 규모 ② 임상 ③ 편의 카드 3개
4. **Clinics(진료 범위)** — 4개 분과 카드 → `/pain` `/autonomic` `/diet` `/skin` 링크
5. **Philosophy(진료 철학)** — 3개 문구 → `/about`
6. **Column(의학칼럼)** — 네이버 RSS 최신 3건 (`fetchBlogPosts().slice(0,3)`) → `/column`
7. **YouTube(유튜브)** — 최신 3개 (`fetchLatestVideos(3)`) + 카카오톡/네이버 플레이스 버튼 → `/media`
8. **FAQ** — `FAQS` 상수 6문항 + `FAQPage` JSON-LD
9. **Hours & Contact** — 진료시간표 / 주소·전화·교통·주차 → `/contact`

> 통계·FAQ·진료시간 등은 `page.tsx` 내 **하드코딩 상수**다. 수치 변경 시 이 파일을 직접 수정.

---

## 6. 콘텐츠(블로그) 시스템 — 핵심

마크다운 파일이 곧 콘텐츠다. 로직은 **`src/lib/blog-local.ts`**.

### 카테고리

```
CATEGORIES = ["pain", "diet", "autonomic", "skin"]
라벨        = 통증 / 다이어트 / 자율신경 / 피부
```

`content/blog/`은 미분류(공지)용 — 카테고리에 속하지 않음.

### 글 파일 위치 & 프론트매터

`content/{category}/{slug}.md` 형식. 프론트매터 스키마:

```yaml
---
title: "글 제목"
description: "메타/카드 설명"
date: "2026-05-01"          # YYYY-MM-DD (정렬 기준, KST로 ISO 변환)
tags:
  - "골관절염"
  - "초음파검사"
thumbnail: "/blog-images/{slug}/img-1.png"   # 없으면 본문 첫 이미지 자동 사용
published: true              # false면 목록·상세에서 제외
---
# 본문 마크다운...
```

### 주요 함수 (`blog-local.ts`)

| 함수 | 역할 |
|------|------|
| `getAllPosts(category?)` | 카테고리(또는 전체) 글 목록, `published` 필터 + 날짜 내림차순 정렬 |
| `getPostBySlug(slug, category?)` | 슬러그로 글 1건 조회 (미지정 시 blog→전 카테고리 순차 탐색) |
| `getRelatedPosts(slug, n, cat?)` | 태그 겹침수 기준 관련 글, 부족하면 최신 글로 채움 |
| `autoLinkMarkdown(content, slug, max=3)` | 본문 내 **다른 글의 태그 키워드를 자동 내부 링크화** (코드펜스/헤딩/이미지/기존 링크 줄 제외, 최대 3개) |
| `createPost(...)` | 프론트매터+본문을 `.md`로 기록 (발행 API가 사용) |
| `toISO8601KST(date)` | JSON-LD용 `+09:00` ISO 변환 |

### 상세 페이지 렌더링 흐름

`getPostBySlug` → `autoLinkMarkdown`로 내부 링크 주입 → `PostContent`(react-markdown) 렌더 → `getRelatedPosts`로 관련 글 → `Article` JSON-LD 출력.

---

## 7. 글 발행 API — `POST /api/publish-blog`

외부(자동화)에서 글을 올리는 엔드포인트.

- **인증**: 헤더 `x-api-key` === 환경변수 `BLOG_API_KEY` (불일치 시 401)
- **필수 본문**: `title`, `content`, `category`(`pain|diet|autonomic|skin` 중 하나)
- **선택**: `description`, `tags[]`, `thumbnail`, `published`
- **슬러그**: `YYYYMMDD-{제목슬러그}` 자동 생성, 중복 시 409
- **이미지 처리**: 본문/썸네일의 `data:image/...;base64` → `public/blog-images/{slug}/img-N.ext`로 저장하고 경로 치환
- **결과**: `201` + `{ success, slug, category, url }`

---

## 8. 외부 데이터 소스

| 모듈 | 소스 | 캐시 | 폴백 |
|------|------|------|------|
| `src/lib/blog.ts` `fetchBlogPosts()` | 네이버 블로그 RSS (`rss.blog.naver.com/jwguin`) | `revalidate 3600` | 실패 시 빈 배열 |
| `src/lib/youtube.ts` `fetchLatestVideos()` | YouTube Data API (업로드 재생목록 `UUGpUiNmBn6BNDn6gFZf_ZrQ`) | `revalidate 1800` | `YOUTUBE_API_KEY` 없거나 실패 시 `FALLBACK_VIDEOS` 8개 |

> `/column`·홈 Column 섹션은 **네이버 블로그(외부)** 글이고, `/pain` 등 카테고리 글은 **로컬 `.md`** 다. 둘은 별개 소스다.

---

## 9. 컴포넌트 (`src/components/`)

| 컴포넌트 | 역할 |
|----------|------|
| `Navigation.tsx` | 상단 고정 헤더, 스크롤 시 배경 변화, 모바일 햄버거. 메뉴: 일산한의원/의료진/통증/다이어트/자율신경/피부/의학칼럼/유튜브/오시는 길 |
| `Footer.tsx` | 하단 푸터 |
| `KakaoButton.tsx` | 우하단 카카오 상담 플로팅 버튼 |
| `SectionReveal.tsx` | 스크롤 진입 시 페이드인 래퍼 |
| `CategoryListPage.tsx` | 카테고리 글 목록 + 인트로 카드 + `ItemList` JSON-LD (diet엔 전문 사이트 배너) |
| `CategoryPostPage.tsx` | 카테고리 글 상세 (Hero/본문/관련 글/Article JSON-LD) |
| `PostContent.tsx` | react-markdown 렌더러 (prose 스타일) |
| `DoctorGrid.tsx` / `DoctorCard.tsx` | 의료진 6인 그리드/카드 |

---

## 10. SEO / 구조화 데이터

- `layout.tsx`: 전역 `metadata`(title 템플릿, OG, robots, canonical, 구글/네이버 verification) + **`MedicalClinic` JSON-LD**(주소·좌표·진료시간·6인 의료진·진료과목·편의시설).
- 홈: `FAQPage` JSON-LD.
- 카테고리 목록: `ItemList` JSON-LD / 글 상세: `Article` JSON-LD.
- `sitemap.ts`, `robots.ts`, `rss.xml` 자동 생성.

---

## 11. 핵심 사실 (콘텐츠에 자주 쓰이는 한의원 정보)

- 상호: **일산한의원** (이마트 풍산점 3층)
- 주소: 경기 고양시 일산동구 무궁화로 237, 이마트 풍산점 3층 / 전화: 031-976-7706
- 교통: 경의중앙선 풍산역 2번 출구 도보 1분 / 주차: 이마트 4·5·6·7층 무료 3시간
- 진료시간: 평일 10:00–20:00, 주말 10:00–16:00, 평일 점심 13:00–14:00, 매월 2·4째 수요일 휴무
- 규모: 고양시 최대 규모, 6인 한의사 협진 (장경진·남태훈·박건희·강민석·박동석·이명주)
- 4개 분과: 근골격계·통증(MSK) / 자율신경·내과 / 한방비만·다이어트 / 피부·미용레이저
- 다이어트 전문 사이트: `https://diet.ilsanhan.com`
- 채널: 네이버 블로그 `blog.naver.com/jwguin`, 카카오 `pf.kakao.com/_eXXun`, 유튜브 @일산한의원

---

## 12. 콘텐츠 추가/수정 작업 시 규칙

1. **새 글 추가**: `content/{category}/{slug}.md` 생성, 프론트매터 스키마 준수, 이미지는 `public/blog-images/{slug}/`.
2. **글 노출 중단**: 파일 삭제 대신 `published: false`.
3. **관련 글 연결**은 자동(태그 기반) — 의도한 내부 링크를 원하면 공유 태그를 맞춘다.
4. **홈 통계·FAQ·진료시간** 변경은 `src/app/page.tsx` 상수를 직접 수정.
5. **카테고리 자체**(4종)는 `src/lib/blog-local.ts`의 `CATEGORIES`/라벨/설명/`CategoryListPage` 인트로가 SOT.
6. 글은 `/blog/{slug}`로 들어와도 카테고리 글이면 `/{category}/{slug}`로 자동 정규화된다 — 정식 URL은 카테고리 경로.
