import { CLINIC, CLINIC_CTA_LINES } from "@/lib/clinic";

export default function ClinicVisitInfo({ className = "" }: { className?: string }) {
  return (
    <address className={`space-y-1 text-sm not-italic leading-relaxed text-muted ${className}`}>
      {CLINIC_CTA_LINES.map((line) => (
        <p key={line}>{line.replace(` · ${CLINIC.tel}`, "")}</p>
      ))}
    </address>
  );
}
