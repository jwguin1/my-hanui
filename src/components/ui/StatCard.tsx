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
      {/* 390px 2열에서 "13,000명" 이 카드 폭(≈119px)을 넘겨 sm 미만에서만 축소 */}
      <p className="text-[32px] font-bold leading-none text-primary sm:text-[40px]">
        {value}
        {unit ? <span className="text-[15px] font-medium">{unit}</span> : null}
      </p>
      {/* "누적 다이어트 처방 건수" 같은 긴 라벨이 어절 중간에서 끊기지 않도록 keep-all */}
      <p className="mt-2 break-keep text-[13px] text-muted">{label}</p>
    </div>
  );
}
