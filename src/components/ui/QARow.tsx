import { ArrowRight, QuestionMark } from "@/components/ui/icons";

export default function QARow({
  quote,
  answer,
}: {
  quote: string;
  answer: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-card px-5 py-4 transition-colors duration-200 hover:border-accent lg:flex-row lg:items-center lg:gap-4">
      <div className="flex items-start gap-2.5 lg:w-[52%]">
        <span
          aria-hidden="true"
          className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface text-tan-soft"
        >
          <QuestionMark size={14} />
        </span>
        <p className="text-[14px] leading-relaxed text-ink">{quote}</p>
      </div>

      <div className="flex items-start gap-2.5 lg:w-[48%]">
        <span aria-hidden="true" className="mt-0.5 shrink-0 text-line">
          <ArrowRight size={16} />
        </span>
        <p className="text-[14px] font-medium leading-relaxed text-primary">
          {answer}
        </p>
      </div>
    </div>
  );
}
