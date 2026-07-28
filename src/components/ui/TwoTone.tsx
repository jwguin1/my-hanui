const SIZE = {
  h1: "text-[32px] md:text-[44px] lg:text-[60px]",
  h2: "text-[26px] md:text-[40px]",
};

export default function TwoTone({
  lead,
  accent,
  as = "h2",
  stacked = false,
}: {
  lead: string;
  accent: string;
  as?: "h1" | "h2";
  /** true 면 accent 를 다음 줄로 내린다. 기본은 한 줄에 이어서 렌더. */
  stacked?: boolean;
}) {
  const Tag = as;

  return (
    <Tag
      className={`${SIZE[as]} font-bold leading-[1.3] tracking-[-0.02em] text-ink`}
    >
      <span className="text-ink">{lead}</span>
      {stacked ? <br /> : null}
      <span className="text-tan">{accent}</span>
    </Tag>
  );
}
