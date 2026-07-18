const round = (n: number) => Math.round(n * 100) / 100;

export function SoleyBurst({ size = 120 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (Math.PI / 180) * (i * 30);
        const x1 = round(60 + Math.cos(angle) * 44);
        const y1 = round(60 + Math.sin(angle) * 44);
        const x2 = round(60 + Math.cos(angle) * 58);
        const y2 = round(60 + Math.sin(angle) * 58);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--color-soley)"
            strokeWidth={4}
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="60" cy="60" r="34" fill="var(--color-soley)" />
    </svg>
  );
}
