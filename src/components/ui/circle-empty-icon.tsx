const round = (n: number) => Math.round(n * 100) / 100;

export function CircleEmptyIcon({ size = 88 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 88 88" aria-hidden="true">
      <circle cx="40" cy="40" r="32" fill="none" stroke="var(--color-border-strong)" strokeWidth={2} />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (Math.PI / 180) * (-90 + (i * 360) / 8);
        const x = round(40 + Math.cos(angle) * 32);
        const y = round(40 + Math.sin(angle) * 32);
        return <circle key={i} cx={x} cy={y} r={4} fill="var(--color-border-strong)" />;
      })}
      <circle cx="40" cy="40" r="16" fill="var(--color-surface-muted)" stroke="var(--color-border-strong)" strokeWidth={1.5} />
      <text
        x="40"
        y="40"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={16}
        fontWeight={700}
        fill="var(--color-ink-secondary)"
      >
        ?
      </text>
    </svg>
  );
}
