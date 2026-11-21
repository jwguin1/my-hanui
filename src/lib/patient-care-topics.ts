import type { HerbalGuide } from "./herbal-guides";

type Topic = { group: string; path: string; label: string; keywords: string; posts: string[] };

/** Editorial groupings for different words patients use for the same visit. */
const topics: Record<HerbalGuide["slug"], Topic> = {
  autonomic: { group: "두통·어지럼", path: "/autonomic/care", label: "두통·어지럼·이명 진료 안내", keywords: "머리 아픔 편두통 이석증 귀울림 현기증", posts: ["일산-두통-신경과-뇌파검사", "일산-이석증-어지럼증", "일산-이명-돌발성난청", "일산-자율신경실조증-상담"] },
  menopause: { group: "갱년기", path: "/herbal/tonic/menopause", label: "갱년기 열감·수면 진료 안내", keywords: "폐경 완경 안면홍조 식은땀 밤잠", posts: ["일산-갱년기-열감-불면"] },
  constitution: { group: "체질보약", path: "/herbal/tonic/constitution", label: "피로·식욕 저하와 체질보약 진료", keywords: "기운 피곤 피로 입맛 부모님 보양 한약", posts: ["피로-식사량-저하", "부모님-보약-상담준비", "한약-복용약-함께", "일산-한약-공진단-상담", "일산-수액-피로-검사"] },
  dyspepsia: { group: "기능성 소화불량", path: "/internal/dyspepsia", label: "식후 더부룩함·소화불량 진료", keywords: "더부룩함 더부룩 조기포만감 체기", posts: ["소화불량-한약-재진", "소화불량-보험한약-보약-비용", "일산-내과-한의원-소화불량"] },
  rhinitis: { group: "비염", path: "/herbal/insurance/rhinitis", label: "비염·코막힘 진료 안내", keywords: "코막힘 콧물 재채기", posts: ["일산-비염-한의원-축농증"] },
  "period-pain": { group: "월경·산후", path: "/herbal/insurance/period-pain", label: "생리통 진료와 보험한약", keywords: "월경통 생리통", posts: ["일산-생리통-자궁근종-상담"] },
  "lumbar-disc": { group: "통증", path: "/herbal/insurance/lumbar-disc", label: "허리디스크 진료와 보험한약", keywords: "허리 디스크 다리 저림", posts: [] },
  "facial-palsy": { group: "안면마비·뇌졸중 회복", path: "/herbal/insurance/facial-palsy", label: "구안와사·안면신경마비 진료", keywords: "구안와사 안면마비 얼굴마비 눈감기", posts: ["일산-안면마비-구안와사"] },
  stroke: { group: "안면마비·뇌졸중 회복", path: "/herbal/insurance/stroke", label: "뇌졸중 퇴원 후 한방 진료", keywords: "중풍 뇌졸중 재활 후유증", posts: [] },
};

export function herbalTopic(guide: HerbalGuide) {
  return topics[guide.slug];
}

export function articleCareTopic(slug: string) {
  return Object.values(topics).find(topic => topic.posts.includes(slug));
}

export function herbalQuestionAnchor(question: string) {
  return "한약질문-" + question.normalize("NFC").replace(/[^\p{L}\p{N}]+/gu, "-").replace(/-$/, "");
}
