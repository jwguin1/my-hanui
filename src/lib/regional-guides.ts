/** 환자 질문의 배치 정본. 제목과 요약은 발행된 글에서 읽는다. */
export const CONSULTATION_GUIDE_SLUGS: readonly string[] = [
  "일산-겨드랑이-브라질리언-제모",
  "일산-여드름흉터-치료-피코프락셀",
  "일산-피부-레이저-선택",
  "일산-온다-티타늄-리프팅-선택",
  "일산-문신-눈썹문신-타투-제거",
  "일산-루비레이저-피코토닝",
  "일산-스킨보톡스-이마-미간-가격",
  "일산-승모근-종아리-침샘-보톡스",
  "일산-여드름-압출-치료-관리",
  "일산-아토피-피부과-한의원",
  "일산-탈모치료-원형탈모-헤드스파",
  "일산-사마귀-티눈-제거"
];
export const REGIONAL_GUIDE_GROUPS = [
  {
    "name": "점·편평사마귀·쥐젖·비립종",
    "description": "병변 구분부터 제거 범위와 회복까지",
    "items": [
      {
        "category": "skin",
        "slug": "일산-편평사마귀-제거"
      },
      {
        "category": "skin",
        "slug": "일산-편평사마귀-가격"
      },
      {
        "category": "skin",
        "slug": "일산-편평사마귀-성지-가격비교"
      },
      {
        "category": "skin",
        "slug": "일산-점제거-점빼기-수술"
      },
      {
        "category": "skin",
        "slug": "일산-점빼기-성지-피부과-병원"
      },
      {
        "category": "skin",
        "slug": "잡티제거-개수와-비용"
      },
      {
        "category": "skin",
        "slug": "일산-쥐젖-제거-무제한"
      },
      {
        "category": "skin",
        "slug": "일산-비립종-제거-압출"
      }
    ]
  },
  {
    "name": "색소·피부결과 스킨부스터",
    "description": "원내 피코토닝·제네시스와 도포 구성",
    "items": [
      {
        "category": "skin",
        "slug": "피코토닝-효과-횟수"
      },
      {
        "category": "skin",
        "slug": "기미레이저-재발-관리"
      },
      {
        "category": "skin",
        "slug": "흑자제거-피코레이저"
      },
      {
        "category": "skin",
        "slug": "제네시스토닝-효과"
      },
      {
        "category": "skin",
        "slug": "일산-스킨부스터-리쥬란-쥬베룩"
      }
    ]
  },
  {
    "name": "리프팅·얼굴 제모",
    "description": "실제 사용하는 장비와 구성·횟수",
    "items": [
      {
        "category": "skin",
        "slug": "얼굴제모-가격-부위-케어"
      },
      {
        "category": "skin",
        "slug": "수염제모-횟수-간격-1년권"
      },
      {
        "category": "skin",
        "slug": "슈링크-시간-횟수-주기"
      },
      {
        "category": "skin",
        "slug": "볼뉴머-효과-슈링크-차이"
      },
      {
        "category": "skin",
        "slug": "일산-올리지오-볼뉴머-고주파"
      }
    ]
  },
  {
    "name": "일산감비환·다이어트",
    "description": "복용 상담과 체중·체형 관리의 구분",
    "items": [
      {
        "category": "diet",
        "slug": "일산-다이어트약-비만클리닉"
      },
      {
        "category": "diet",
        "slug": "일산-지방분해주사-감비환-차이"
      }
    ]
  },
  {
    "name": "피부 고민과 치료 선택",
    "description": "증상 구분과 진료 선택 안내입니다. 글마다 원내 시행 범위와 다른 의료기관에서 상담할 항목을 구분했습니다.",
    "items": [
      {
        "category": "skin",
        "slug": "일산-겨드랑이-브라질리언-제모"
      },
      {
        "category": "skin",
        "slug": "일산-여드름흉터-치료-피코프락셀"
      },
      {
        "category": "skin",
        "slug": "일산-피부-레이저-선택"
      },
      {
        "category": "skin",
        "slug": "일산-온다-티타늄-리프팅-선택"
      },
      {
        "category": "skin",
        "slug": "일산-문신-눈썹문신-타투-제거"
      },
      {
        "category": "skin",
        "slug": "일산-루비레이저-피코토닝"
      },
      {
        "category": "skin",
        "slug": "일산-스킨보톡스-이마-미간-가격"
      },
      {
        "category": "skin",
        "slug": "일산-승모근-종아리-침샘-보톡스"
      },
      {
        "category": "skin",
        "slug": "일산-여드름-압출-치료-관리"
      },
      {
        "category": "skin",
        "slug": "일산-아토피-피부과-한의원"
      },
      {
        "category": "skin",
        "slug": "일산-탈모치료-원형탈모-헤드스파"
      },
      {
        "category": "skin",
        "slug": "일산-사마귀-티눈-제거"
      }
    ]
  },
  {
    "name": "의료기관 선택·방문 준비",
    "description": "의료진·진료 범위·주소를 확인하고 상담 준비하기",
    "items": [
      {
        "category": "blog",
        "slug": "일산-피부과-성형외과-진료선택"
      },
      {
        "category": "blog",
        "slug": "일산-동구-서구-피부진료-방문"
      },
      {
        "category": "blog",
        "slug": "일산-한의원-추천-진료상담"
      },
      {
        "category": "blog",
        "slug": "일산-병원-의원-이름-예약확인"
      }
    ]
  }
] as const;
