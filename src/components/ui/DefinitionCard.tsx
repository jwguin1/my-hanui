export default function DefinitionCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-r-xl border-l-4 border-primary bg-surface p-6">
      <p className="text-[16px] font-medium text-primary">{title}</p>
      <p className="mt-2 text-[15px] leading-[1.8] text-ink">{body}</p>
    </div>
  );
}
