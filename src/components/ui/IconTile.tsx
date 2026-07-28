import type { ReactNode } from "react";

export default function IconTile({ icon }: { icon: ReactNode }) {
  return (
    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface text-primary [&>svg]:h-5 [&>svg]:w-5">
      {icon}
    </span>
  );
}
