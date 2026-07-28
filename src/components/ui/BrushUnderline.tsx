export default function BrushUnderline({
  width = "90%",
}: {
  width?: number | string;
}) {
  return (
    <svg
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
      style={{ width, height: 14 }}
      aria-hidden="true"
      focusable="false"
      className="block"
    >
      {/* 살짝 굽은 곡선 1개. 가로로 늘려도 획 두께가 변하지 않도록 non-scaling-stroke 사용 */}
      <path
        d="M5 10C55 3 145 3 195 7"
        stroke="var(--brush)"
        strokeWidth={8}
        strokeLinecap="round"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
