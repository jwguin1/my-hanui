import Image from "next/image";
import Link from "next/link";
import { SKIN_DEVICES } from "@/lib/skin-devices";

export default function SkinDeviceGallery() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {SKIN_DEVICES.map((device) => (
        <figure key={device.id} className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
          <Image src={`/images/devices/${device.id}.webp`} alt={`${device.name} ${device.type} 장비`}
            width={720} height={720} sizes="(min-width: 1024px) 280px, (min-width: 640px) 240px, 42vw"
            className="h-36 w-full object-contain sm:h-52" />
          <figcaption className="flex flex-1 flex-col items-start px-3 pb-2 sm:px-5 sm:pb-4">
            <p className="text-sm leading-snug text-muted">{device.type}</p>
            <h3 className="mt-1 text-lg font-bold leading-snug text-ink">{device.name}</h3>
            <p className="mb-1 mt-2 text-base leading-snug text-muted">{device.description}</p>
            <Link href={device.href} className="mt-auto inline-flex min-h-11 items-center text-base font-semibold text-primary underline underline-offset-4">{device.name} 안내</Link>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
