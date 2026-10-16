# 한약 진료 분류와 원고 근거

2026-10-16 작업 기록. 공개 환자용 FAQ의 주제를 참고하고 일산한의원 운영 사실에 맞춰 독립적으로 작성했다. 검색량 순위, 실제 AI 질문 로그 또는 네이버 환자 원문을 확보한 것으로 표시하지 않는다. 네이버 질문 검색에서는 직접 검증 가능한 원문을 확보하지 못했다. 공개 FAQ는 실제 질문 빈도의 증거가 아니다.

## 정보 구조

- 첫 화면 2열 3행: 통증치료 / 교통사고 / 보험한약 / 체질보약 / 다이어트 / 잡티제거.
- 보험한약: 기능성 소화불량(기존 URL 유지), 월경통, 알레르기 비염, 요추추간판탈출증, 안면신경마비, 뇌혈관질환 후유증.
- 체질보약: 비급여 체질맞춤보약, 자율신경계 두통·어지럼, 갱년기.
- 잡티제거: 기존 CO₂ 소개 다음에 색소치료·리프팅 이동 카드.
- 원문 출처는 이 유지보수 문서에 보관한다. 환자 페이지에는 요청에 따라 외부 근거 링크를 추가하지 않는다.

## 질문 구성 참고

다음 정원한의원 페이지의 질문형 소제목, 짧은 답 뒤 설명, 과정과 관련 진료 연결 방식을 참고했다. 원문의 치료 성과·전문의 자격·검사 장비·운영 방식은 가져오지 않았다.

- https://gardenclinic.kr/treatments/digestive : 정상 내시경 이후 불편, 식후 더부룩함, 기존 약 병행.
- https://gardenclinic.kr/treatments/gynecology : 반복되는 생리통, 진통제, 생리 주기.
- https://gardenclinic.kr/treatments/ent : 비염 유형, 수면을 방해하는 코막힘, 기존 비염약.
- https://gardenclinic.kr/treatments/rehab-neuro : 안면마비 초기 대응, 병원 치료 병행, 뇌졸중 후유증.
- https://gardenclinic.kr/treatments/custom-herbal : 피로, 체질을 모를 때, 비용·복용 기간.
- https://gardenclinic.kr/treatments/neuropsychiatry : 검사 후에도 남은 불편, 수면·소화와 함께 나타나는 증상.
- https://gardenclinic.kr/treatments/menopause : 생리 변화·열감·불면, 호르몬 치료 중 상담.

## 의학·보험 사실 확인

- 보건복지부 정책브리핑 https://www.korea.kr/multi/visualNewsView.do?newsId=148928658 : 6개 질환, 연간 2개 질환 각각 20일. 시범사업의 공지 기간은 2026년 12월까지이므로 이후 제도 변경 시 재확인 필요.
- 한국한의약진흥원 https://www.nikom.or.kr/portal/main/module/dataManage/view.do?idx=696&nav_code=mai1699849170 : 대상 질환과 보험 기준 교차 확인.
- 강동경희대학교병원 https://www.khnmc.or.kr/resources/webzine/2019/foryou_20190304.pdf : 정상 내시경과 기능성 소화불량이 양립 가능. 원고에 수치·효능 보장 표현은 전용하지 않음.
- NHS https://www.nhs.uk/symptoms/period-pain/ : 생리통 원인, 악화·이상 출혈 시 평가.
- NHS https://www.nhs.uk/conditions/allergic-rhinitis/ : 알레르기·비알레르기 비염 구분, 유발 요인, 기존 치료.
- NHS https://www.nhs.uk/conditions/slipped-disc/ : 가능한 활동 유지, 배뇨·회음부 감각 변화 등 응급 징후.
- NHS https://www.nhs.uk/conditions/bells-palsy/ : 72시간 내 초기 치료, 스테로이드 검토, 눈 보호.
- NHS https://www.nhs.uk/conditions/stroke/symptoms/ : 갑작스러운 편측 마비·언어 이상, 증상이 사라져도 응급 평가. 한국 게시물은 119로 현지화.
- NHS https://www.nhs.uk/symptoms/dizziness/ : 어지럼의 다양한 원인과 동반 증상 평가.
- NHS https://www.nhs.uk/conditions/menopause-and-perimenopause/symptoms/ : 폐경 전 증상, 12개월 무월경 후 출혈 평가.
- NHS https://www.nhs.uk/conditions/menopause-and-perimenopause/things-you-can-do/ : 수면 환경, 카페인·술 등 유발 요인, 기존 치료와 병행 상담.

## 원장이 직접 확인한 운영 정보

보험한약 10일 4만원대, 비급여 1개월 39만원·2개월 69만원·3개월 99만원. 원내 조제·탕전, 모든 탕약의 조제 후 약재 사진 전송, 준비 약 1주일, 1개월 60팩, 진료시간 내 카카오톡 의료진 직접 상담. 금액 정본은 src/lib/pricing.ts, 과정 정본은 src/lib/care-guide.ts.

## 구현과 검색 노출

서버에서 읽을 수 있는 본문과 동일 데이터의 FAQ 구조화 정보를 출력한다. 각 상세 페이지의 고유 URL·제목·설명·canonical, 상위 진료 링크, 관련 진료 링크, 사이트맵과 llms.txt를 연결한다. 검색 등록이나 AI 답변 인용은 보장하지 않는다.
