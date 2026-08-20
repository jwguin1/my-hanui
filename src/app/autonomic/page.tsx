import type { Metadata } from "next";
import CategoryListPage from "@/components/CategoryListPage";
import { categoryMetadata } from "@/lib/categories";

/**
 * revalidate 를 두지 않는다 = 빌드 시 정적 생성, 다음 배포까지 고정.
 *
 * 이 페이지의 데이터는 전부 레포 안의 content/*.md 다. 배포 없이는 바뀌지 않으므로
 * ISR 로 얻을 것이 없다. 반면 잃는 것은 있었다 — Next 의 stale-while-revalidate 는
 * 만료 후 첫 요청자에게 **낡은 사본을 먼저 주고** 뒤에서 재생성한다.
 * 저트래픽 사이트에서 하루 한 번 오는 크롤러는 매번 그 낡은 사본을 받는다.
 *
 * 실제로 2026-08-19 발행한 21편이 /blog 에는 보이는데 /pain 에는 안 보이는 상태가
 * 관측됐다 (X-Vercel-Cache: STALE). 같은 배포, 같은 시점이었다.
 *
 * 외부 데이터를 읽는 / · /column · /media 는 예외다 — 거긴 배포와 무관하게
 * 원본이 바뀌므로 fetch 단위 revalidate 를 그대로 둔다.
 */

export const metadata: Metadata = categoryMetadata("autonomic");

export default function AutonomicListPage() {
  return <CategoryListPage category="autonomic" />;
}
