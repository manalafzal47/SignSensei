export function ScoreRing({
  score,
  label = "tracking",
  size = 120,
}: Readonly<{
  score: number;
  label?: string;
  size?: number;
}>) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  let tone = "var(--mismatch)";
  if (score >= 80) tone = "var(--match)";
  else if (score >= 60) tone = "var(--accent)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * score) / 100}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-2xl font-bold">{score}%</span>
        <span className="text-[10px] tracking-wide text-muted-foreground uppercase">{label}</span>
      </div>
    </div>
  );
}
