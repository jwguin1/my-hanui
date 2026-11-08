export const config = {
  years: 10,
  model: process.env.RESEARCH_MODEL || 'claude-sonnet-5-5',
  reviewModel: process.env.RESEARCH_REVIEW_MODEL || 'claude-opus-5-5',
  origin: 'https://research.ilsanhan.com',
  maxCandidates: 50,
  maxAttempts: 3,
  maxSourceChars: 160000,
  maxRunInputTokens: 220000,
  maxRunOutputTokens: 50000,
  writerOutputTokens: 12000,
  reviewOutputTokens: 4000,
  queueSize: 6,
};
export const categories = {
  pain: { label: '통증·근골격', treatment: '/pain', questions: ['허리 통증에 침과 수기치료는 어떤 도움이 되나요?', '초음파를 보면서 치료하면 어떤 점이 달라지나요?', '디스크로 다리가 저릴 때 운동과 치료를 어떻게 병행하나요?'], topics: [
    '((low back pain) AND (manual therapy OR spinal manipulation OR acupuncture))',
    '((ultrasound guided) AND (musculoskeletal OR tendinopathy OR shoulder))',
    '((lumbar disc OR radiculopathy OR neck pain) AND (acupuncture OR exercise OR manual therapy))',
  ], links: [{href:'/pain/acute',label:'급성 통증 진료'}, {href:'/pain/chronic',label:'만성 통증 진료'}, {href:'/pricing',label:'통증치료 비용·시간'}] },
  skin: { label: '피부·미용', treatment: '/skin', questions: ['색소 레이저를 선택할 때 무엇을 비교하나요?', '모공과 흉터 치료 후 어떤 변화를 기대할 수 있나요?', '초음파와 고주파 리프팅은 피부에 어떻게 작용하나요?'], topics: [
    '((melasma OR pigmentation) AND (Q-switched OR picosecond OR long pulsed laser))',
    '((skin rejuvenation OR acne scars) AND (fractional carbon dioxide OR microneedling OR radiofrequency))',
    '((skin tightening OR facial rejuvenation) AND (HIFU OR microfocused ultrasound OR monopolar radiofrequency OR skin booster))',
  ], links: [{href:'/skin/pigmentation',label:'피코·제네시스 색소치료'}, {href:'/skin/lifting',label:'슈링크·볼뉴머 리프팅'}, {href:'/skin/hair-removal',label:'엘리멘트 TL 얼굴 제모'}, {href:'/skin/spot',label:'CO₂ 잡티제거'}] },
  diet: { label: '다이어트', treatment: '/diet/program', questions: ['체중 감량에서 한약 연구는 무엇을 확인했나요?', '감량한 체중을 유지하려면 무엇을 살펴야 하나요?', '식욕과 체중을 관리할 때 침 치료는 어떤 역할을 하나요?'], topics: [
    '((obesity OR overweight) AND (herbal medicine OR Chinese herbal medicine OR Korean medicine) AND (randomized OR systematic review))',
    '((weight loss maintenance OR weight regain) AND (diet OR exercise OR behavioral) AND (randomized OR systematic review))',
    '((obesity OR overweight) AND acupuncture AND (randomized OR systematic review))',
  ], links: [{href:'/diet/program',label:'일산감비환 진료·비용'}, {href:'/diet',label:'다이어트 환자 질문'}] },
  digestive: { label: '기능성 소화불량', treatment: '/internal/dyspepsia', questions: ['식후 더부룩함에 침 치료가 도움이 되나요?', '기능성 소화불량 한약 연구에서는 무엇이 달라졌나요?', '음식과 생활 습관은 기능성 소화불량에 어떤 영향을 주나요?'], topics: [
    '((functional dyspepsia OR postprandial distress syndrome) AND acupuncture AND (randomized OR systematic review))',
    '((functional dyspepsia) AND (herbal medicine OR Chinese herbal medicine OR Korean medicine OR Kampo) AND (randomized OR systematic review))',
    '((functional dyspepsia) AND (diet OR exercise OR lifestyle OR gut brain) AND (randomized OR systematic review))',
  ], links: [{href:'/internal/dyspepsia',label:'소화불량 진료·보험한약'}, {href:'/blog/내시경-정상-기능성소화불량',label:'내시경은 정상인데 소화가 안 될 때'}] },
  korean: { label: '한의학·한약', treatment: '/herbal', topics: [
    '((functional dyspepsia) AND (Chinese herbal medicine OR Korean medicine OR acupuncture))',
    '((insomnia OR fatigue OR menopause) AND (Chinese herbal medicine OR Korean medicine OR acupuncture))',
    '((dysmenorrhea OR allergic rhinitis) AND (Chinese herbal medicine OR Korean medicine OR acupuncture))',
  ], links: [{href:'/herbal/insurance',label:'보험한약 진료'}, {href:'/herbal/tonic',label:'체질맞춤 한약'}, {href:'/internal/dyspepsia',label:'소화불량 진료'}] },
};
