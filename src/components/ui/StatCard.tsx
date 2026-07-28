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
      <p className="text-[40px] font-bold leading-none text-primary">
        {value}
        {unit ? <span className="text-[15px] font-medium">{unit}</span> : null}
      </p>
      <p className="mt-2 text-[13px] text-muted">{label}</p>
    </div>
  );
}
