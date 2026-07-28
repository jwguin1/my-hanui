export default function StatCard({
  value,
  unit,
  label,
}: {
  value: string;
  unit?: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-6 text-center">
      {/* 390px 2열에서 "65,700명" 이 카드 폭(≈119px)을 넘겨 sm 미만에서만 축소 */}
      <p className="text-[32px] font-bold leading-none text-primary sm:text-[40px]">
        {value}
        {unit ? <span className="text-[15px] font-medium">{unit}</span> : null}
      </p>
      <p className="mt-2 text-[13px] text-muted">{label}</p>
    </div>
  );
}
