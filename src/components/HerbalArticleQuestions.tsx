import Link from "next/link";

const topics = {
  rhinitis: {
    title: "비염 진료 전 궁금한 점",
    articles: [
      ["아침마다 재채기하고 밤에는 코가 막혀요. 어떻게 치료하나요?", "/blog/일산-비염-한의원-축농증"],
      ["콧물이 목으로 넘어가고 목에 뭐가 걸린 느낌이 들어요.", "/blog/일산-이비인후과-편도결석#section-5"],
      ["누우면 기침이 심해져요. 코막힘과 관련이 있나요?", "/blog/일산-만성기침-호흡기내과#section-5"],
    ],
  },
  dyspepsia: {
    title: "소화불량 진료 전 궁금한 점",
    articles: [
      ["내시경은 정상인데 왜 계속 더부룩할까요?", "/blog/내시경-정상-기능성소화불량"],
      ["몇 숟갈만 먹어도 배가 차요. 위가 작아진 걸까요?", "/blog/조금만-먹어도-배부름"],
      ["소화가 안 될 때 커피와 밀가루를 꼭 끊어야 하나요?", "/blog/기능성소화불량-식사-커피"],
    ],
  },
  "period-pain": {
    title: "생리통 진료 전 궁금한 점",
    articles: [
      ["매달 진통제를 먹는데, 진료 전에 무엇을 기록해 두면 좋을까요?", "/blog/일산-생리통-자궁근종-상담#section-1"],
      ["자궁근종이 있어도 생리통 한약을 상담할 수 있나요?", "/blog/일산-생리통-자궁근종-상담#section-2"],
      ["생리통 한약은 언제 건강보험이 적용되나요?", "/blog/일산-생리통-자궁근종-상담#section-3"],
    ],
  },
  "lumbar-disc": {
    title: "허리디스크 진료 전 궁금한 점",
    articles: [
      ["허리는 안 아프고 다리만 저린데 허리디스크일까요?", "/pain/다리만-저릴때-허리디스크"],
      ["MRI에서 디스크가 보이면 꼭 수술해야 하나요?", "/pain/허리디스크-수술안하고"],
      ["허리디스크로 침 치료를 받으면 무엇이 달라지나요?", "/pain/허리디스크-침치료-원리"],
    ],
  },
  "facial-palsy": {
    title: "안면마비가 생겼을 때 궁금한 점",
    articles: [
      ["갑자기 한쪽 얼굴이 잘 움직이지 않아요. 오늘 진료를 받아야 하나요?", "/blog/일산-안면마비-구안와사"],
      ["회복 과정을 사진으로 남기려면 어떤 표정을 찍으면 좋을까요?", "/blog/일산-안면마비-구안와사#section-3"],
      ["눈이 잘 안 감기고 물을 마시면 새요. 재진 때 무엇을 보나요?", "/blog/일산-안면마비-구안와사#section-5"],
    ],
  },
  stroke: {
    title: "뇌졸중 퇴원 후 궁금한 점",
    articles: [
      ["퇴원 후 재활치료를 받을 곳은 어떻게 고르나요?", "/blog/일산-재활-도수치료-운동#section-1"],
      ["집에서 하는 재활운동은 언제부터 늘려도 될까요?", "/blog/일산-재활-도수치료-운동#section-3"],
      ["퇴원 후 침 치료를 받으려면 어떤 기록을 가져가야 하나요?", "/blog/일산-재활-도수치료-운동#section-4"],
    ],
  },
  autonomic: {
    title: "두통·어지럼 진료 전 궁금한 점",
    articles: [
      ["두통이 자꾸 반복돼요. 아픈 날에는 무엇을 기록할까요?", "/blog/일산-두통-신경과-뇌파검사#section-3"],
      ["고개를 돌릴 때 핑 도는 것과 일어설 때 아찔한 건 어떻게 다른가요?", "/blog/일산-이석증-어지럼증#section-1"],
      ["어지럽고 잠도 안 오고 속까지 답답해요. 무엇부터 치료하나요?", "/blog/일산-자율신경실조증-상담#section-5"],
    ],
  },
  menopause: {
    title: "갱년기 한약을 짓기 전 궁금한 점",
    articles: [
      ["호르몬 치료를 받고 있는데 갱년기 한약도 상담할 수 있나요?", "/blog/일산-갱년기-열감-불면#section-2"],
      ["열감 때문에 밤에 자꾸 깨요. 수면 기록은 어떻게 남기나요?", "/blog/일산-불면증-수면장애#section-1"],
      ["갱년기 한약에도 건강보험이 적용되나요?", "/blog/일산-갱년기-열감-불면#section-4"],
    ],
  },
  constitution: {
    title: "보약을 짓기 전 궁금한 점",
    articles: [
      ["입맛이 줄고 자꾸 피곤해요. 어떤 보약이 맞을까요?", "/blog/피로-식사량-저하"],
      ["혈압약이나 위장약을 먹고 있는데 한약을 같이 먹어도 되나요?", "/blog/한약-복용약-함께"],
      ["부모님 보약을 자녀가 먼저 알아봐도 될까요?", "/blog/부모님-보약-상담준비"],
    ],
  },
};

export default function HerbalArticleQuestions({ topic }: { topic: keyof typeof topics }) {
  const { title, articles } = topics[topic];
  return <nav aria-labelledby="patient-articles-title" className="mx-auto max-w-3xl px-6 py-8">
    <h2 id="patient-articles-title" className="text-xl font-semibold text-ink">{title}</h2>
    <ul className="mt-4 divide-y divide-line rounded-xl border border-line bg-card">
      {articles.map(([question, href]) => <li key={href}>
        <Link href={href} className="flex min-h-12 items-center justify-between gap-3 px-4 py-3 text-base leading-7 text-primary hover:underline focus-visible:underline">
          {question}<span aria-hidden="true">→</span>
        </Link>
      </li>)}
    </ul>
  </nav>;
}
