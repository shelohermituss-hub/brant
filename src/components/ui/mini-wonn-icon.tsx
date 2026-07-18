export function MiniWonnIcon({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 72 72" aria-hidden="true">
      <circle cx="36" cy="36" r="30" fill="none" stroke="var(--color-border-strong)" strokeWidth={2} />
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (Math.PI / 180) * (-90 + (i * 360) / 10);
        const x = 36 + Math.cos(angle) * 30;
        const y = 36 + Math.sin(angle) * 30;
        return <circle key={i} cx={x} cy={y} r={4} fill="var(--color-border-strong)" />;
      })}
      <circle cx="36" cy="36" r="10" fill="var(--color-surface-muted)" stroke="var(--color-border-strong)" strokeWidth={1.5} />
    </svg>
  );
}
