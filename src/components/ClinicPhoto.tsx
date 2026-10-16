import Image from "next/image";
import { CLINIC_PHOTOS, type ClinicPhotoKey } from "@/lib/clinic-photos";

export default function ClinicPhoto({ photo, caption = true }: { photo: ClinicPhotoKey; caption?: boolean }) {
  const item = CLINIC_PHOTOS[photo];
  return <figure className="overflow-hidden rounded-2xl border border-line bg-card">
    <Image src={item.src} alt={item.alt} width={item.width} height={item.height}
      sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1023px) 50vw, 600px"
      className="block h-auto w-full" />
    {caption && <figcaption className="p-5">
      <p className="text-base font-semibold leading-relaxed text-ink">{item.title}</p>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.caption}</p>
    </figcaption>}
  </figure>;
}

export function ClinicPhotoGallery({ photos, title, id = "clinic-photos" }: { photos: ClinicPhotoKey[]; title: string; id?: string }) {
  return <section id={id} className="scroll-mt-24 mx-auto max-w-6xl px-6 py-12 md:py-16">
    <h2 className="font-serif text-2xl font-semibold text-ink md:text-3xl">{title}</h2>
    <div className={`mt-7 grid items-start gap-6 ${photos.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
      {photos.map(photo => <ClinicPhoto key={photo} photo={photo} />)}
    </div>
  </section>;
}
