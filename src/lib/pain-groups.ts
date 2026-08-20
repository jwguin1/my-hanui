/**
 * /pain 허브의 부위별 그룹 — 표시 순서와 소속 글을 **명시 배열**로 고정한다.
 *
 * 자동 분류(태그·제목 키워드)를 쓰지 않는 이유: 글이 늘면 조용히 오분류되고,
 * 아무도 모르는 채로 배포된다. 배열이면 틀렸을 때 diff 에 보인다.
 * 「배열 단독 원칙」— 글 쪽 프론트매터에 group 을 넣지 않는다. 정본은 여기 하나다.
 *
 * 순서는 부위별 검색 수요와 몸의 축(척추 → 상지 → 하지) 을 섞어 정했고,
 * 성격이 다른 교통사고를 맨 뒤에 둔다.
 *
 * 누락·중복은 scripts/validate-jsonld.mjs 의 양방향 검사가 잡는다.
 * (배열에 있는데 글이 없다 / 글이 있는데 배열에 없다 — 양쪽 다 FAIL)
 */
export const PAIN_GROUP_ORDER: string[] = [
  "허리",
  "목·팔저림",
  "어깨",
  "무릎",
  "발목",
  "손목·손",
  "팔꿈치",
  "교통사고",
];

export const PAIN_GROUP_POSTS: Record<string, string[]> = {
  허리: [
    "다리만-저릴때-허리디스크",
    "허리디스크-수술안하고",
    "허리디스크-침치료-원리",
  ],
  "목·팔저림": [
    "목디스크-등통증",
    "팔저림-손힘빠짐-목디스크",
    "일자목-거북목-목디스크",
  ],
  어깨: [
    "팔이-안올라감-오십견-회전근개",
    "밤에-어깨-아픈이유",
    "어깨-뚝소리-회전근개파열",
  ],
  무릎: [
    "계단-내려갈때-무릎통증",
    "무릎에-물이-찼을때",
    "무릎연골-재생되나요",
  ],
  발목: [
    "발목-삐었을때-초기대처",
    "발목염좌-오래가는이유",
    "발목-자꾸-접질리는이유",
  ],
  "손목·손": [
    "밤에-손저림-손목터널",
    "손목터널-비수술-치료",
    "엄지쪽-손목통증-건초염",
  ],
  팔꿈치: [
    "팔꿈치-바깥쪽-통증",
    "테니스엘보-오래가는이유",
    "새끼손가락-저림-팔꿈치",
  ],
  교통사고: [
    "교통사고-다음날-목통증",
    "교통사고-엑스레이-정상",
    "교통사고-병원-한의원-병행",
    "교통사고-합의-시점",
  ],
};

/**
 * 그룹별 진료 안내 페이지. 없으면 링크를 걸지 않는다 — 없는 곳을 만들지 않는다.
 * label 은 글 → 허브 역링크의 앵커로도 쓴다. 「자세히 보기」 같은 말은 쓰지 않는다.
 */
export const PAIN_GROUP_HUB: Record<string, { href: string; label: string }> = {
  교통사고: { href: "/accident", label: "교통사고 진료 안내" },
};

/**
 * 글 → 허브 역링크. 허브가 글을 링크하는 것만으로는 한쪽 방향이다.
 * 전역 내비게이션에 /accident 가 있긴 하지만 그건 모든 페이지에 똑같이 있어서
 * 이 글과 저 페이지가 이어져 있다는 신호가 되지 못한다.
 */
export function painPostHub(
  slug: string
): { href: string; label: string } | undefined {
  for (const [group, slugs] of Object.entries(PAIN_GROUP_POSTS)) {
    if (slugs.includes(slug)) return PAIN_GROUP_HUB[group];
  }
  return undefined;
}

/** 배열에 실린 전체 슬러그 (순서 유지). 검증기와 화면이 같은 값을 쓴다. */
export function painGroupSlugs(): string[] {
  return PAIN_GROUP_ORDER.flatMap((g) => PAIN_GROUP_POSTS[g] ?? []);
}
