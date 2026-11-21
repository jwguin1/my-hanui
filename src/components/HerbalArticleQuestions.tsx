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
  tonic: {
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
