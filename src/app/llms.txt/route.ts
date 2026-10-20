import { HERBAL_GUIDES, herbalPath } from "@/lib/herbal-guides";
import { CARE_GUIDE } from "@/lib/care-guide";
import { HOME_VISIT, HOME_VISIT_FAQS, HOME_VISIT_PRICES } from "@/lib/home-visit";
import {
  CLINIC,
  CLINIC_ADDRESS_FULL,
  CLINIC_HOURS_LUNCH,
  CLINIC_HOURS_WEEKDAY,
  CLINIC_HOURS_WEEKEND,
  CLINIC_WEEKEND_HOLIDAY_LABEL,
} from "@/lib/clinic";
import { getAllPosts } from "@/lib/blog-local";
import { PIGMENTATION_SLUGS, LIFTING_SLUGS, LIFTING_PATH, SHURINK_CARE } from "@/lib/skin-guides";
import { PIGMENTATION_PRICES, SHURINK_PRICES, PAIN_PRICES, HERBAL_PRICES, PAIN_INSURANCE_NOTE, PHARMACOPUNCTURE_NOTE, HERBAL_INSURANCE_CONDITIONS, HERBAL_INSURANCE_LIMIT, won, painWon } from "@/lib/pricing";
import { postPath } from "@/lib/slug";

/**
 * llms.txt — AI 크롤러용 요약.
 *
 * 예전에는 `public/llms.txt` 정적 파일이었다. 그래서 진료시간이 바뀔 때마다
 * 손으로 고쳐야 했고, 실제로 공휴일 표기가 여기만 낡은 채 남아 있었다.
 * 지금은 clinic.ts 에서 파생한다 — 정본이 바뀌면 여기도 같이 바뀐다.
 *
 * 아래 링크 목록은 clinic.ts 에 둘 성격이 아니라 그대로 둔다.
 */
const BASE = "https://www.ilsanhan.com";

function body(): string {
  const holidayLine = `- ${CLINIC_WEEKEND_HOLIDAY_LABEL}: ${CLINIC_HOURS_WEEKEND} (점심시간 없이 진료)`;
  const closedLine = `- ${CLINIC.holidayClosedNote}`;
  const skinPosts = getAllPosts("skin");
  const pigmentLinks = PIGMENTATION_SLUGS.flatMap((slug) => {
    const post = skinPosts.find((p) => p.slug === slug);
    return post ? [`- [${post.title}](${BASE}${postPath("skin", post.slug)})`] : [];
  }).join("\n");
  const liftingLinks = LIFTING_SLUGS.flatMap((slug) => {
    const post = skinPosts.find((p) => p.slug === slug);
    return post ? [`- [${post.title}](${BASE}${postPath("skin", post.slug)})`] : [];
  }).join("\n");

  return `# 일산한의원 (Ilsanhan Korean Medicine Clinic)

경기도 고양시 일산동구에 있는 한의원입니다. 6인의 한의사가 근골격계·내과·미용
진료를 함께합니다. 근골격계 초음파로 확인한 뒤 필요한 치료만 권하는 것을
진료 원칙으로 삼습니다.

- 웹사이트: ${BASE}
- 주소: ${CLINIC_ADDRESS_FULL}
- 상담·예약: [카카오톡 상담](${CLINIC.kakaoHref})으로 편하게 문의해 주세요.
- 전화: ${CLINIC.tel}
- 교통: ${CLINIC.transit}
- 주차: ${CLINIC.parking}
- 진료지역: 고양시(일산동구·일산서구·덕양구), 파주 운정
- 개원: ${CLINIC.foundingYear}년

## 진료시간

- 월~금: ${CLINIC_HOURS_WEEKDAY} (점심 ${CLINIC_HOURS_LUNCH})
${holidayLine}
${closedLine}
- ${CLINIC.receptionNote}
- ${CLINIC.closedNote}

## 방문과 관리 안내

- [진료비·소요 시간 안내](${BASE}/pricing)
- [환자 질문 검색](${BASE}/blog)
- [오늘 방문·접수 마감](${BASE}/contact#before-visit)
- [치료 후 관리](${BASE}/aftercare)

## 진료 항목

- 침 치료, 물리치료, 부항, 온열·뜸
- 추나요법 (건강보험 적용, 연 20회까지)
- 약침·초음파 약침
- 한약 처방 (기능성소화불량은 첩약 건강보험 시범사업 적용 대상)
- 근골격계 초음파 진단 (${CLINIC.ultrasound.name} ${CLINIC.ultrasound.count}대)
- 체외충격파, 무중력 감압치료
- 피부 CO2 레이저 (점·편평사마귀·쥐젖 제거)
- 색소치료: 피코하이 피코토닝 · 엘리멘트 TL 제네시스
- 슈링크 유니버스 리프팅

## 보험한약과 체질보약

- [보험한약 6개 질환](${BASE}/herbal/insurance): 10일 본인부담금 ${HERBAL_PRICES.insuredTenDays}. ${HERBAL_INSURANCE_LIMIT}
- [체질보약 · 비급여 한약](${BASE}/herbal/tonic): 체질맞춤보약, 자율신경계 두통·어지럼, 갱년기. 1개월 ${won(HERBAL_PRICES.oneMonth)}, 2개월 ${won(HERBAL_PRICES.twoMonths)}, 3개월 ${won(HERBAL_PRICES.threeMonths)}.
${HERBAL_GUIDES.map(g => `- [${g.title}](${BASE}${herbalPath(g)}): ${g.question}`).join("\n")}

## 방문진료

- [일산·고양 방문진료 안내](${BASE}${HOME_VISIT.path})
- 일산한의원은 일차의료 한의 방문진료 수가 시범사업 참여기관입니다. 한의사가 집으로 찾아가는 방문진료를 운영하며, 재택의료센터 서비스는 아닙니다.
- 대상: 질병·부상 등으로 거동이 불편해 내원이 어려운 환자. 보호자도 신청할 수 있습니다.
- 지역: ${HOME_VISIT.areaDetail} ${HOME_VISIT.areaNote}
- 비용: ${HOME_VISIT_PRICES.map(p => `${p.label} ${p.price} (${p.rate})`).join("; ")}.
- 비용 기준: ${HOME_VISIT.costNote}
- 상담 신청: ${HOME_VISIT.formUrl}
${HOME_VISIT_FAQS.map(f => `- [${f.q}](${BASE}${HOME_VISIT.path}#question-${f.id}): ${f.a}`).join("\n")}

## 진료 안내 페이지

- 급성 통증 (담 결림·허리 삐끗·발목 염좌): ${BASE}/pain/acute
- 만성 통증 (오십견·디스크·척추관협착증): ${BASE}/pain/chronic
- 교통사고 후유증 (자동차보험): ${BASE}/accident
- 소화불량 (급체·기능성소화불량): ${BASE}/internal/dyspepsia
- 이명·어지럼·두통: ${BASE}/autonomic/care
- 다이어트 한약 처방: ${BASE}/diet/program
- 잡티 제거 (점·편평사마귀·쥐젖): ${BASE}/skin/spot
- 색소치료 (피코토닝·제네시스·기미·흑자): ${BASE}/skin/pigmentation
- 리프팅 (슈링크 유니버스·탄력·턱선): ${BASE}${LIFTING_PATH}

## 방문 시간·치료 과정·한약 조제

- ${CARE_GUIDE.time}
- ${CARE_GUIDE.basic}
- ${CARE_GUIDE.extra}
- ${CARE_GUIDE.selection}
- ${CARE_GUIDE.acuteReview}
- ${CARE_GUIDE.chronicReview}
- ${CARE_GUIDE.records}
- ${CARE_GUIDE.herbalProcess}
- ${CARE_GUIDE.herbalTiming}
- ${CARE_GUIDE.consultation}

## 통증 치료와 한약 비용

2026-10-16 원내 확인 금액:
- 일반 근골격계 초진 진료비: ${painWon(PAIN_PRICES.firstVisit)}
- 단순추나: ${painWon(PAIN_PRICES.simpleChuna)}, 복잡추나: ${painWon(PAIN_PRICES.complexChuna)}
- 초진·추나 금액 기준: ${PAIN_INSURANCE_NOTE}
- 초음파 유도 기본 통원약침(포도당 5%): ${painWon(PAIN_PRICES.dextrose)}
- 초음파 유도 PDRN 약침: ${painWon(PAIN_PRICES.pdrn)}
- 약침 금액 기준: ${PHARMACOPUNCTURE_NOTE}
- 건강보험 한약 10일 본인부담금: ${HERBAL_PRICES.insuredTenDays}
- 건강보험 한약 대상: ${HERBAL_INSURANCE_CONDITIONS.join("·")} 6개 질환. ${HERBAL_INSURANCE_LIMIT}
- 한약 1개월: ${won(HERBAL_PRICES.oneMonth)}, 2개월: ${won(HERBAL_PRICES.twoMonths)}, 3개월: ${won(HERBAL_PRICES.threeMonths)}
- 통증 치료 비용 안내: ${BASE}/pain/chronic#prices
- 한약 비용과 약재 확인 안내: ${BASE}/internal/dyspepsia#herbal-prices

## 색소치료 질문과 비용

상담한 원장이 피부 상태와 치료 목표를 확인하고 피코하이 또는 엘리멘트 TL 중 필요한 장비를 선택해 직접 시술합니다. 엘리멘트 TL은 532·755·1064nm 세 파장의 롱펄스 레이저입니다.
- 레이저 시술 자체는 20분 이내이며 상담·준비 시간은 별도입니다. 최소 2,000샷을 기준으로 진행합니다.
- 한의사 6명 모두 피부레이저 진료를 담당하며 대한통합레이저의학회 정회원입니다. 장경진 원장은 같은 학회의 인증의입니다.
- 피부레이저 의료진 안내: ${BASE}/doctor#skin-laser

2026-10-16 확인한 가격과 구성:
- ${PIGMENTATION_PRICES.name}: 1회 ${won(PIGMENTATION_PRICES.single)}, 10회 ${won(PIGMENTATION_PRICES.tenSessions)} (회당 ${won(PIGMENTATION_PRICES.perSession)})
- ${PIGMENTATION_PRICES.booster}
- 흑자 개별 치료 범위와 포함 여부는 상담 시 확인합니다.

${pigmentLinks}

## 리프팅 질문과 비용

슈링크 유니버스를 사용합니다. 2026-10-01 확인한 가격:
- ${SHURINK_PRICES.name}: 1회 ${won(SHURINK_PRICES.single)}, 3회 ${won(SHURINK_PRICES.threeSessions)} (매회 300샷, 회당 ${won(SHURINK_PRICES.threeSessions / 3)})
- 시술 과정: ${SHURINK_CARE.steps.map((step) => `${step.title} ${step.minutes}분`).join(" → ")} (총 약 ${SHURINK_CARE.totalMinutes}분, 초진 상담·접수 별도)
- 원내 재시술 안내 간격: ${SHURINK_CARE.intervalWeeks}주
- 피부 탄력과 처짐은 리프팅, 갈색 색소와 피부톤은 피코토닝, 붉은기와 피부결은 제네시스를 중심으로 상담합니다.

${liftingLinks}

## 의학정보 아카이브

진료 분야별 질문과 치료 정보를 정리한 글 모음입니다.

- 통증: ${BASE}/pain
- 다이어트: ${BASE}/diet
- 피부: ${BASE}/skin
- 자율신경: ${BASE}/autonomic
- 전체 글: ${BASE}/blog

## 그 외

- 병원 소개: ${BASE}/about
- 의료진 (6인): ${BASE}/doctor
- 오시는 길·진료시간: ${BASE}/contact
- 의학칼럼: ${BASE}/column
- 유튜브: ${BASE}/media
- 다이어트 전문 사이트: https://diet.ilsanhan.com

## 참고

- sitemap: ${BASE}/sitemap.xml
- 이 사이트에는 환자 후기나 치료 전후 사진을 게시하지 않습니다.
  의료광고 규정에 따라 치료 효과를 단정하는 표현을 쓰지 않습니다.
`;
}

export function GET() {
  return new Response(body(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
