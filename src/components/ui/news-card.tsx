interface NewsCardProps {
  sourceInitials: string;
  sourceColor: string;
  sourceName: string;
  time: string;
  headline: string;
}

export function NewsCard({
  sourceInitials,
  sourceColor,
  sourceName,
  time,
  headline,
}: NewsCardProps) {
  return (
    <div className="flex w-64 shrink-0 flex-col gap-3 rounded-lg bg-surface p-4">
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: sourceColor }}
        >
          {sourceInitials}
        </span>
        <div className="flex flex-col">
          <span className="text-[0.95rem] font-bold text-ink">{sourceName}</span>
          <span className="text-xs text-ink-secondary">{time}</span>
        </div>
      </div>
      <p className="text-[0.95rem] leading-snug font-medium text-ink">
        {headline}
      </p>
    </div>
  );
}
