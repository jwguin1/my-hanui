/** 원내에서 제공한 공간·진료 사진. */
export const CLINIC_PHOTOS = {
  entrance: { src: "/images/clinic/entrance.webp", width: 1280, height: 846, title: "이마트 풍산점 3층에서 만나요", alt: "일산한의원 간판과 정면 출입구", caption: "이마트 풍산점 3층의 일산한의원 입구입니다. 간판을 확인하고 안쪽 데스크에서 접수해 주세요." },
  reception: { src: "/images/clinic/reception.webp", width: 1280, height: 853, title: "방문하시면 데스크에서 안내합니다", alt: "일산한의원 접수 데스크와 내부 복도", caption: "처음 방문하셨다면 불편한 부위와 원하시는 진료를 알려주세요. 다른 병원 검사 결과를 가져오셨다면 함께 말씀해 주세요." },
  room: { src: "/images/clinic/treatment-room.webp", width: 1280, height: 853, title: "침·기본 물리치료를 받는 공간", alt: "커튼으로 구분된 일산한의원 치료실과 치료 장비", caption: "침 치료와 기본 ICT 물리치료를 받는 공간입니다. 초진·재진 모두 접수부터 기본 치료까지 40분 이내 소요됩니다." },
  acupuncture: { src: "/images/clinic/acupuncture.webp", width: 1280, height: 853, title: "불편한 부위를 살피고 침 치료를 진행합니다", alt: "목과 어깨 부위에 침 치료를 진행하는 모습", caption: "진찰로 통증 부위와 움직임을 확인한 뒤 침 치료를 진행합니다. 치료 후에는 처음 불편했던 증상의 변화를 살펴봅니다." },
  ict: { src: "/images/clinic/ict.webp", width: 1280, height: 853, title: "기본 치료에 포함되는 ICT 물리치료", alt: "목과 어깨 부위에 ICT 물리치료 전극을 부착하는 모습", caption: "ICT는 기본 통증 치료에 포함되는 간섭파 물리치료입니다. 전극을 부착하고 치료 강도를 조절합니다." },
  ultrasound: { src: "/images/clinic/ultrasound.webp", width: 1280, height: 853, title: "초음파 영상을 보며 치료 부위를 확인합니다", alt: "초음파 화면과 탐촉자로 부위를 확인하며 약침 시술을 진행하는 모습", caption: "초음파 영상으로 필요한 부위를 확인하며 약침 치료를 진행합니다. 기본 통원약침과 PDRN 약침의 구성·비용을 진료에서 안내합니다." },
  chuna: { src: "/images/clinic/chuna.webp", width: 1280, height: 853, title: "몸의 움직임과 정렬을 살피는 추나치료", alt: "옆으로 누운 환자의 몸을 지지하며 추나치료를 진행하는 모습", caption: "몸의 움직임과 정렬을 살펴 필요한 추나치료를 진행합니다. 단순추나·복잡추나 금액에는 기본 진료비가 포함됩니다." },
} as const;

export type ClinicPhotoKey = keyof typeof CLINIC_PHOTOS;
