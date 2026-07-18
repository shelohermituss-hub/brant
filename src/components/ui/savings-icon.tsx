export function SavingsIcon({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      <circle cx="28" cy="30" r="22" fill="var(--color-green)" opacity="0.55" />
      <circle cx="28" cy="26" r="20" fill="var(--color-ink)" />
      <circle cx="28" cy="26" r="8" fill="var(--color-green)" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        const x1 = 28 + Math.cos(angle) * 12;
        const y1 = 26 + Math.sin(angle) * 12;
        const x2 = 28 + Math.cos(angle) * 16;
        const y2 = 26 + Math.sin(angle) * 16;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="white"
            strokeWidth={2}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
