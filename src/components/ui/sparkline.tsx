interface SparklineProps {
  color: string;
  path: string;
}

export function Sparkline({ color, path }: SparklineProps) {
  return (
    <svg viewBox="0 0 100 36" className="h-9 w-full" fill="none" aria-hidden="true">
      <path
        d={path}
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
