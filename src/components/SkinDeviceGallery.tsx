import Image from "next/image";
import Link from "next/link";
import { SKIN_DEVICES, type SkinDeviceId } from "@/lib/skin-devices";

export default function SkinDeviceGallery({ ids, links = false }: { ids?: readonly SkinDeviceId[]; links?: boolean }) {
  const devices = SKIN_DEVICES.filter(device => !ids || ids.includes(device.id));
  return <div className={`grid gap-4 ${devices.length > 2 ? "grid-cols-2 lg:grid-cols-3" : devices.length === 2 ? "sm:grid-cols-2" : ""}`}>
    {devices.map(device => <figure key={device.id} className={`overflow-hidden rounded-2xl border border-line bg-white ${devices.length === 1 ? "flex flex-col items-center sm:flex-row" : ""}`}>
      <Image src={`/images/devices/${device.id}.webp`} alt={`${device.name} ${device.type} 장비`} width={720} height={720} sizes={devices.length === 1 ? "(max-width: 640px) 280px, 240px" : "(max-width: 640px) 180px, 300px"} className={`mx-auto object-contain ${devices.length === 1 ? "h-60 w-60 shrink-0" : "h-44 w-full sm:h-56"}`} />
      <figcaption className="w-full px-4 pb-5 sm:px-6 sm:pb-6">
        <p className="text-sm leading-relaxed text-muted">{device.type}</p>
        <h3 className="mt-1 text-lg font-bold leading-snug text-ink">{device.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{device.description}</p>
        {links && <Link href={device.href} className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary underline underline-offset-4"><span>{device.name} 안내</span><span aria-hidden="true" className="shrink-0">→</span></Link>}
      </figcaption>
    </figure>)}
  </div>;
}
