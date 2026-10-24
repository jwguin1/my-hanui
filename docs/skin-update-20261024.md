# 피부 진료 업데이트 · 2026-10-24

## 원내 확인값

사용자가 확인한 장비·가격·주기·포함 항목을 적용했다. 제모는 엘리멘트 TL, 리프팅은 슈링크 유니버스와 볼뉴머다. 슈링크 3회 단독 26.4만원 구성은 종료하고, 슈링크 3회＋볼뉴머 1회 패키지를 운영한다. 가격 정본은 src/lib/pricing.ts다.

슈링크 300샷 약 30분은 기존 원내 안내를 유지했다. 볼뉴머·600샷의 소요 시간, 두 장비의 당일 병행 순서는 원내 확인값이 없어 예약 상담에서 안내하도록 했다. 제모 1년권은 첫 시술일부터 1년, 최소 4주 간격으로 안내한다. 환불·양도 등 추가 조건은 만들지 않았다.

## 온라인 근거 확인

외부 출처 링크를 진료 페이지에 노출하지 않는 기존 요청을 유지하고, 근거는 이 운영 기록에 남긴다. 연구노트의 논문 원문·라이선스 출처는 그대로 유지한다. 공개 FAQ에서 다루는 질문은 의료기관의 환자 안내에 반복되는 비용·횟수·주기·준비·통증·관리 주제다. 조회수 또는 검색량 순위를 조사한 것으로 표현하지 않았다.

- American Academy of Dermatology, Laser hair removal: FAQs. https://www.aad.org/public/cosmetic/hair-removal/laser-hair-removal-faqs — 반복 시술·간격, 통증·붉은기, 자외선 차단. 원내 간격과 비용은 사용자 확인값.
- American Academy of Dermatology, Laser hair removal: Preparation. https://www.aad.org/public/cosmetic/hair-removal/laser-hair-removal-preparation — 피부 상태·복용약·태닝 등 상담 준비.
- Mayo Clinic, Laser hair removal. https://www.mayoclinic.org/tests-procedures/laser-hair-removal/about/pac-20394555 — 전날 면도, 왁싱·뽑기 중단, 모낭 색소에 작용하는 원리.
- ELEMENIC 공식 제품 안내. https://elemenic.com/home/ — ELEMENT-TL은 triple long-pulsed laser system. 세대·파장별 원내 설정이나 국내 허가 적응증은 추측하여 추가하지 않음.
- CLASSYS Annual Report 2025. https://classys.com/wp-content/uploads/sites/2/2026/04/CLASSYS_AR-2025_eng_v2-1_0422-1.pdf — 볼뉴머 6.78MHz 단극성 고주파 및 지속 쿨링 장치. 결과 보장·타 장비와 동일 효과 주장은 사용하지 않음.

## 구성

- /skin/hair-removal: 제모 전용 안내, 8개 FAQ, 모바일 부위별 가격 카드.
- /skin/lifting: 슈링크·볼뉴머 개요, 단독 가격, 결합 패키지, 8개 FAQ.
- 잡티제거 진입 페이지·메뉴·진료비·기존 리프팅 글·관리 안내·sitemap·llms 갱신.
- 연구노트 피부 진료 링크와 자동 작성용 실제 원내 장비 목록 갱신.
- 연구노트 논문 원본·해설 내용은 유지. 모바일 그림 확대/축소, 닫은 뒤 읽던 위치 복귀, 긴 그림 설명 문단 나눔, 목차·설명 글씨 가독성 보완.

## 검증 결과

- TypeScript 검사와 Next.js 운영 빌드 통과(161개 정적 페이지).
- 연구 자동화 10개, FAQ 9개, 구조화 데이터 22개 테스트 통과.
- 12개 관련 경로에서 새 가격·종료 가격 부재·FAQ JSON-LD·canonical·연결 확인.
- 연구 4편(공개 3편/예약 1편)의 원문·그림·검증 게이트 확인, HTTP smoke 통과.
- 360·390·430px에서 제모·리프팅 및 공개 연구 3편 가로 넘침 없음.
- 실제 브라우저에서 Q&A 펼치기, 논문 확대 150%·가로 스크롤·닫기 후 초점 복귀 확인.
- 기존 전역 article 이미지 제한(모바일 높이 320px)이 논문 그림에도 적용되어 확대를 방해하던 문제를 연구 이미지 전용 클래스로 제외해 해결.
- 카카오톡 링크의 도착지가 ‘일산한의원’ 공식 채널이며 채팅 버튼이 표시되는 것을 확인. 메시지는 발송하지 않음.
