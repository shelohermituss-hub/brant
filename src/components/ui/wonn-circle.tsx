export type WonnMemberStatus = "paid" | "wait" | "late" | "upcoming";

export interface WonnMember {
  position: number;
  status: WonnMemberStatus;
}

interface WonnCircleProps {
  members: WonnMember[];
  beneficiaryPosition: number;
  potAmount: string;
  beneficiaryName: string;
}

const STATUS_FILL: Record<WonnMemberStatus, string> = {
  paid: "var(--color-paid)",
  wait: "var(--color-wait)",
  late: "var(--color-late)",
  upcoming: "var(--color-gray-300)",
};

const SIZE = 280;
const CENTER = SIZE / 2;
const RADIUS = 104;
const DISK_RADIUS = 13;

export function WonnCircle({
  members,
  beneficiaryPosition,
  potAmount,
  beneficiaryName,
}: WonnCircleProps) {
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto h-64 w-64" aria-hidden="true">
      <circle
        cx={CENTER}
        cy={CENTER}
        r={RADIUS}
        fill="none"
        stroke="var(--color-border)"
        strokeWidth={1.5}
      />

      {members.map(({ position, status }) => {
        const angle = (Math.PI / 180) * (-90 + ((position - 1) * 360) / members.length);
        const x = CENTER + RADIUS * Math.cos(angle);
        const y = CENTER + RADIUS * Math.sin(angle);
        const isBeneficiary = position === beneficiaryPosition;

        return (
          <g key={position}>
            {isBeneficiary && (
              <circle cx={x} cy={y} r={DISK_RADIUS + 8} fill="var(--color-soley)" opacity={0.35} />
            )}
            <circle
              cx={x}
              cy={y}
              r={DISK_RADIUS}
              fill={isBeneficiary ? "var(--color-soley)" : STATUS_FILL[status]}
              stroke="var(--color-surface)"
              strokeWidth={2}
            />
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={11}
              fontWeight={700}
              fill="white"
            >
              {position}
            </text>
          </g>
        );
      })}

      <text
        x={CENTER}
        y={CENTER - 8}
        textAnchor="middle"
        fontSize={22}
        fontWeight={700}
        fill="var(--color-ink)"
      >
        {potAmount}
      </text>
      <text
        x={CENTER}
        y={CENTER + 16}
        textAnchor="middle"
        fontSize={13}
        fill="var(--color-ink-secondary)"
      >
        {beneficiaryName}
      </text>
    </svg>
  );
}
