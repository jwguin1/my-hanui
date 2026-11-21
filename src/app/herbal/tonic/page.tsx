import { HerbalHub, HERBAL_HUB_META } from "@/components/HerbalPages";
import { pageMetadata } from "@/lib/page-metadata";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { publicLetters, publicLetterPhotoUrl } from "@/lib/medication-public";
export const metadata = pageMetadata({ path: "/herbal/tonic", ...HERBAL_HUB_META.tonic, routeOgImage: true });
async function HerbalLetterPhoto() {
  const { letters } = await publicLetters();
  const letter = letters.find(item => item.listed !== false);
  if (!letter) return <Link href="/herbs" className="underline">오늘의 한약 복약편지 보기</Link>;
  return <Link href={`/herbs/${letter.token}`} prefetch={false} className="block max-w-lg">
    <figure>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface">
        <Image unoptimized fill src={publicLetterPhotoUrl(letter.token, "web")} sizes="(max-width: 600px) 90vw, 512px" alt="공개 복약편지에 담긴 원내 조제 약재" className="object-contain" referrerPolicy="no-referrer" />
      </div>
      <figcaption className="mt-3 text-base text-primary underline">사진 속 약재를 준비한 이유 · 복약편지 읽기</figcaption>
    </figure>
  </Link>;
}

export default function Page() {
  return <HerbalHub category="tonic">
    <section className="mx-auto max-w-5xl px-6 py-8">
      <h2 className="mb-5 text-2xl font-semibold text-ink">원내에서 준비한 오늘의 약재</h2>
      <Suspense fallback={<Link href="/herbs" className="underline">약재 사진과 복약편지 보기</Link>}>
        <HerbalLetterPhoto />
      </Suspense>
    </section>
  </HerbalHub>;
}
