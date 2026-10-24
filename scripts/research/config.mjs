export const config = {
  years: 10,
  model: process.env.RESEARCH_MODEL || 'claude-sonnet-4-6',
  origin: 'https://research.ilsanhan.com',
  maxCandidates: 50,
  maxAttempts: 3,
  maxSourceChars: 160000,
  maxRunInputTokens: 220000,
  maxRunOutputTokens: 50000,
  queueSize: 6,
};
export const categories = {
  pain: { label: '통증·근골격', day: 1, treatment: '/pain', topics: [
    '((low back pain) AND (manual therapy OR spinal manipulation OR acupuncture))',
    '((ultrasound guided) AND (musculoskeletal OR tendinopathy OR shoulder))',
    '((lumbar disc OR radiculopathy OR neck pain) AND (acupuncture OR exercise OR manual therapy))',
  ], links: [{href:'/pain/acute',label:'급성 통증 진료'}, {href:'/pain/chronic',label:'만성 통증 진료'}, {href:'/pricing',label:'통증치료 비용·시간'}] },
  skin: { label: '피부·미용', day: 3, treatment: '/skin', topics: [
    '((melasma OR pigmentation) AND (Q-switched OR picosecond OR long pulsed laser))',
    '((skin rejuvenation OR acne scars) AND (fractional carbon dioxide OR microneedling OR radiofrequency))',
    '((skin tightening OR facial rejuvenation) AND (HIFU OR microfocused ultrasound OR monopolar radiofrequency OR skin booster))',
  ], links: [{href:'/skin/pigmentation',label:'피코·제네시스 색소치료'}, {href:'/skin/lifting',label:'슈링크 유니버스 리프팅'}, {href:'/skin/spot',label:'CO₂ 잡티제거'}] },
  korean: { label: '한의학·한약', day: 5, treatment: '/herbal', topics: [
    '((functional dyspepsia) AND (Chinese herbal medicine OR Korean medicine OR acupuncture))',
    '((insomnia OR fatigue OR menopause) AND (Chinese herbal medicine OR Korean medicine OR acupuncture))',
    '((dysmenorrhea OR allergic rhinitis) AND (Chinese herbal medicine OR Korean medicine OR acupuncture))',
  ], links: [{href:'/herbal/insurance',label:'보험한약 진료'}, {href:'/herbal/tonic',label:'체질맞춤 한약'}, {href:'/internal/dyspepsia',label:'소화불량 진료'}] },
};
